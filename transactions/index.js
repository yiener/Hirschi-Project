const { Account } = require("../account");
const {v4:uuidv4, parse} = require("uuid")
const { State } = require("../store/state");
const { Excution } = require("../excution");
const state = new State()
const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec, ec = new EC("secp256k1");
const MINT_PRIVATE_ADDRESS = "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

class Transaction { 
    constructor(from, to,   amount, gas = 0  , code ="") { 
        
        this.from = from; 
        this.to = to; 
        this.amount = amount; 
        this.gas = gas; 
        this.code =  code
        
        
    } 
 
    sign(keyPair) { 
        if (keyPair.getPublic("hex") === this.from) { 
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount + this.gas ), "base64").toDER("hex"); 
        } 
    } 
    static createAccount(code = []){
         return Account.toJSON(code)
    }
   static exc (){
     return this.code
   }
    static isValid(tx, chain) { 
        return (
            tx.from && 
            tx.to && 
            tx.amount &&
            tx.code  &&
            (chain.getBalance(tx.from) >= tx.amount + tx.gas || tx.from === MINT_PUBLIC_ADDRESS) && 
            ec.keyFromPublic(tx.from, "hex").verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
        )
    }
} 

module.exports={Transaction}

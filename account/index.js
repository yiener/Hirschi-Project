const { add } = require("lodash")


const { STATIC_BALANCE } = require("../config")
const { State } = require("../store/state")
const state = new State()
const {ec, keccakHash} = require("../util/index")

class Account{
    constructor(){
        this.keyPair = ec.genKeyPair()
        this.address = this.keyPair.getPublic().encode("hex")
        this.balance =  STATIC_BALANCE
        
        this.generateCodeHash()
    }
   static generateCodeHash(){
        this.codeHash = this.code.length > 0 ? keccakHash(this.address + this.code ) : null
    }
    sign(data){
        return this.keyPair.sign(keccakHash(data))


    }
    static verifySignature({publicKey , data , signature}){
        return ec.keyFromPublic(publicKey , "hex").verify(keccakHash(data) , signature)
    }
   static toJSON(Code_){
       return{ address:this.address,
               balance : this.balance,
               code : [Code_],
               codeHash : this.codeHash


       }
    }
  

   
}

module.exports = {Account}

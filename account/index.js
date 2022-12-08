const { add } = require("lodash")


const { STATIC_BALANCE } = require("../config")
const { State } = require("../store/state")
const state = new State()
const {ec, keccakHash} = require("../util/index")

class Account{
    constructor({code }= {}){
        this.keyPair = ec.genKeyPair()
        this.address = this.keyPair.getPublic().encode("hex")
        this.balance =  STATIC_BALANCE
        this.code = code || []
        this.generateCodeHash()
    }
    generateCodeHash(){
        this.codeHash = this.code.length > 0 ? keccakHash(this.address + this.code ) : null
    }
    sign(data){
        return this.keyPair.sign(keccakHash(data))


    }
    static verifySignature({publicKey , data , signature}){
        return ec.keyFromPublic(publicKey , "hex").verify(keccakHash(data) , signature)
    }
    toJSON(){
       return{ address:this.address,
               balance : this.balance,
               code : this.code ,
               codeHash : this.codeHash

       }
    }
    static calculateBalance({address , state}){
        return state.getAccount({address}).balance
    }

   
}

module.exports = {Account}


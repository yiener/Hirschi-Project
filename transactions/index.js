const { reject } = require("lodash")
const {v4:uuidv4, parse} = require("uuid")

const {Account }= require("../account/index")
const { REWARD } = require("../config")
const Interpreter = require("../interpreter")
const { State } = require("../store/state")

const state = new State()


const TRANSACTION_TYPE_MAP = {
    CREATE_ACCOUNT:"CREATE ACCOUNT" , 
    TRANSACT : "TRANSACT",
    REWARD : "REWARD"
}

class Transaction {
    constructor({id  , from , to , value , data , signature}){
        this.id = id || uuidv4()
        this.from = from || "-"
        this.to = to || "-"
        this.value = value || 0
        this.data = data || "-"
        this.signature = signature || "-"

    }

    static createTransaction({account  , to  , value  , beneficiary }){
        if(beneficiary){
            return new this({
                to : beneficiary ,
                value : REWARD,
                data: {type : TRANSACTION_TYPE_MAP.REWARD}
            })
        }
        if(to){
            const transactionData = {
                id : uuidv4() , 
                from: account.address,
                to ,
                value ,
                data : {type : TRANSACTION_TYPE_MAP.TRANSACT}
            }
            return new Transaction({
                ...transactionData  , signature:account.sign(transactionData)
            })
        }
    return new Transaction({
             data:{
                    type : TRANSACTION_TYPE_MAP.CREATE_ACCOUNT,
                    accountData: JSON.parse(JSON.stringify(account))
            }
        })
        
    }
   
    static validateStandarTransaction({transaction}){
         return new Promise((resolve , reject) => {
            const {id , from , signature  } = transaction 
            const transactionData = {...transaction}
            delete transactionData.signature
            if(!Account.verifySignature(({
                publicKey : from ,
                data : transactionData ,
                signature
            }))){
                  return reject(new Error(`Transatction  ${id} signature is invalid`))
            }
            return resolve()
         })

    }
     static validateCreateAccountTransaction({transaction}){
        return new  Promise((reject  , resolve)=>{
            const expectedAccountDataField =/* () =>{ */Object.keys(new Account().toJSON())
                
             /* toJSON();{
                  return { }
              }
            
            }*/
            const fields = Object.keys(transaction.data.accountData) 
            if(fields.length !== expectedAccountDataField.length){
                return reject(new Error(
                    `the transaction  account data has an icorret of fields`
                ))
            }
            fields.forEach(field =>{
                if(!expectedAccountDataField.includes(field)){
                    return reject(new Error(
                          `the field : ${field} , is unexpect for account data`
                    ))
                }
            })
        })
    }
    static validateReward({transaction }){
        return new Promise((resolve , reject) =>{
            const{value} = transaction
            if(value !== REWARD){
                return reject(new Error(`the reward ${value}doesn't correspond with the reward stablish`))

            }
           return resolve()
        })

    }
    static runTransaction({transaction , state}){
        switch(transaction.data.type){
            case TRANSACTION_TYPE_MAP.TRANSACT:
                Transaction.runStandarTransaction({transaction , state})

                console.log("---update account data to rflect the standar transaction");
              break
            case TRANSACTION_TYPE_MAP.CREATE_ACCOUNT:
                Transaction.runCreateAccountTransaction({transaction })
                console.log(" stored the account data");
                break
            case TRANSACTION_TYPE_MAP.REWARD:
                Transaction.RunRewardTransaction({transaction  , state})
                console.log("-----update accountData to reflect the reward");
                break
            default:
                break
        }

        
    }

    static runStandarTransaction({transaction }){
        const fromAccount = state.getAccount({address: transaction.from})
        const toAccount = state.getAccount({address : transaction.to}) 
        const interpreter  = new Interpreter()
         interpreter.runcode(toAccount.code)
        console.log("----------- start smart contract excution --------------");
        console.log(interpreter.state.stack[0]);
        console.log("---------stop smart contract excution-----");
        const {value} = transaction
        fromAccount.balance -=value
        toAccount.balance += value
        state.putAccount({address : transaction.from ,accountData : fromAccount })
        state.putAccount({address : transaction.from ,accountData : toAccount })

    }
    static runCreateAccountTransaction({transaction , state}){
        const { accountData} = transaction.data
        const {address , codeHash } = accountData
        state.putAccount({address : codeHash ? codeHash :address ,accountData})
    }
    static RunRewardTransaction({ transaction  , state}){
        const {to , value } = transaction
        const accountData = state.getAccount({address : to  })
        accountData.balance += value
        state.putAccount({address : to , accountData})

    }
} 

module.exports= {Transaction  }


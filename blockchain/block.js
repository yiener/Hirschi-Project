
const { cn } = require("../combinations")
const { GENESIS_DATA } = require("../config")
const { Trie } = require("../store/trie")
const { Transaction } = require("../transactions")
const { TransactionQueue } = require("../transactions/transaction-queue")
const transactionQ = new TransactionQueue()
const { keccakHash } = require("../util")

var  callCount = 0 
var r = 0

class Block{
    constructor({blockHeaders , trasactionSeries}){
        this.blockHeaders = blockHeaders

        this.trasactionSeries = trasactionSeries
    }

    static determineCombination(){
        if(callCount  === cn.length-1){
            callCount = 0
            
           
      }else{
         if(callCount === 0 && r === 0){
              r++
         }else{
         callCount += 1;
         }
         
      }
    
      return callCount
      

    }
    static pocnBlock({lastBlock , beneficiary ,transactionsSeries  , stateRoot}){
        const rewardTransaction =  Transaction.createTransaction({
            beneficiary
        })
        transactionsSeries.push(rewardTransaction)
        const transactionsTrie = Trie.buildTrie({items : transactionsSeries})
        
        let timestamp , truncatedBlockHeaders , header

        timestamp = Date.now()
        truncatedBlockHeaders = {
            parentHash : keccakHash(lastBlock.blockHeaders),
            beneficiary,
            number : lastBlock.blockHeaders.number+1 ,
            
            combination : lastBlock.blockHeaders.combination = cn[this.determineCombination()] 
              ,
            timestamp,
            transactionsRoot:transactionsTrie.rootHash ,
            stateRoot,
            transactionsSeries



        }

        header = keccakHash(truncatedBlockHeaders)
        
         return new this({ 
            blockHeaders : {...truncatedBlockHeaders } ,
            transactionsSeries

         })
    }
    
    static genesis(){
        return new this(GENESIS_DATA)
    }
    static validateBlock({lastBlock , block}){

        return new Promise((resolve , reject) =>{
           if(keccakHash(block) === keccakHash(Block.genesis())){
              return resolve()
           }
          /*if(keccakHash(lastBlock.blockHeaders) !== block.blockHeaders.parentHash){
                return reject(new Error("the parent hash must to be a hash  of the last block headers"))
            }*/
          /*  if(block.blockHeaders.number !== lastBlock.blockHeaders.number+1){
                return reject(new Error("the block must be increment by 1 "))
            }*/
            
            return resolve()
        })
    }
   static runBlock({   state }){
        for(let transaction of transactionQ.ViewPool()){
            
            Transaction.runTransaction({transaction , state})
        }
    }
}


module.exports = {Block}

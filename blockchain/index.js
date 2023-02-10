const { State } = require("../store/state")
const { TransactionQueue } = require("../transactions/transaction-queue")
const { Block } = require("./block")
const transactionQueue = new TransactionQueue()

class  Blockchain{
    constructor() {
        this.chain = [Block.genesis()]
        this.state = new State()
    }
    addBlock({ block  ,  }){
       return new Promise((resolve , reject)  =>{
           Block.validateBlock({
            lastBlock: this.chain[this.chain.length - 1],
            block 
           }).then(()=> {
              this.chain.push(block)
              Block.runBlock({   state:this.state})
           
              return resolve()
           }).catch(error => reject(error))
             
       })
           
    }

    replaceChain({ chain }){
        return new  Promise(async (resolve , reject )  =>{
            for(let i = 1 ; i < chain.length; i++ ){
                const block = chain[i]
                const lastBlockIndex = i - 1
                const lastBlock = lastBlockIndex >= 0 ? chain[i - 1] : null
                try{
                    await Block.validateBlock({lastBlock , block})
                    Block.runBlock({  state:this.state })
                } catch (error){
                    return reject(error)
                }
                console.log(`validate Block number ${block.blockHeaders.number}`);
            }
              this.chain = chain
              return resolve()
       })
        
         }

         getLastBlock() {
            return this.chain[this.chain.length - 1];
        }

        getBalance(address) {
            let balance = 0;
    
            this.chain.forEach(block => {
                block.data.forEach(transaction => {
                    if (transaction.from === address) {
                        balance -= transaction.amount;
                        balance -= transaction.gas;
                    }
    
                    if (transaction.to === address) {
                        balance += transaction.amount;
                    }
                })
            })
    
            return balance;
        }
     

}

module.exports =  { Blockchain }







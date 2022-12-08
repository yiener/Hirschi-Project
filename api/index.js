const express = require("express")
const bodyParser= require("body-parser")
const { Blockchain } = require("../blockchain")
const { Block } = require("../blockchain/block")
/*const { PubSub } = require("./pubsub")*/
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const {P2pServer} = require("./pubsub")
const p2pserver = new P2pServer()
const request = require("request")
const { Account } = require("../account")
const { Transaction } = require("../transactions")
const { TransactionQueue } = require("../transactions/transaction-queue");
const { State } = require("../store/state");
const state = new State()
const app = express()

const  blockchain = new Blockchain()
const transactionQueue = new TransactionQueue()
const account = new Account()
/*const pubsub = new PubSub(  )*/
const  transaction = Transaction.createTransaction({ account })

/*console.log(transaction);*/
setTimeout(() => {
    p2pserver.broadcastTransaction(transaction)
} , 300)
app.use(bodyParser.json())


app.get("/blockchain" , (req , res , next) =>{
    const {chain} =  blockchain
    res.json({ chain })
})
app.get("/pool" , (req , res , next) =>{
    
    res.json( transactionQueue.ViewPool() )
})
app.get("/cleanPool" , (req , res , next) =>{
    
    res.json( transactionQueue.clearTransactionPool() )
})
app.get("/blockchain/pocnBlock" , (req , res , next) =>{
    const lastBlock = blockchain.chain[blockchain.chain.length-1]
    const block = Block.pocnBlock({ lastBlock  , beneficiary:account.address ,  transactionsSeries: transactionQueue.ViewPool() , stateRoot:state.getStateRoot()})
    blockchain.addBlock({ block /*, transactionQueue */})
    
    .then(() => { p2pserver.broadcastTransaction(block) , res.json({ block })})
    .catch(next)
       
    
    
})

app.get("/account/balance" , (req , res , next )=>{
    const balance = Account.calculateBalance({
        address : Account.address ,
        state
    })
    res.json({address:account.address , balance})
})

app.post("/account/balance" , (req , res , next )=>{
    const { address } = req.body
    const balance = Account.calculateBalance({
        address ,
        state
    })
    res.json({address  , balance})
    
})

app.post("/account/transact" , (req , res ,next)=>{
     const {code , to , value} = req.body
     const transaction = Transaction.createTransaction({
        account : !to ? new Account({code}) : account ,
        to ,
        value
     })
     
     transactionQueue.updateOrAddTransaction(transaction)
    p2pserver.broadcastTransaction(transaction)
    
     res.json({ transaction })
})

app.use((err , req , res , next) =>{
    console.error("internal server error" , err);
    res.status(500).json({ message:err.message })
})


const peer = process.argv.includes("--peer")
const PORT = peer ? Math.floor(2000 + Math.random() * 1000) : 3000

if(peer){
    
    request(`http://localhost:3000/blockchain` ,(error  ,response  , body) =>{
        const { chain } = JSON.parse(body)
        blockchain.replaceChain({ chain })
       
        .then(() =>console.log("syncronized blockchain with the root node"))
        .catch(error => console.error(error))
        
    })
}

app.listen(PORT  , () =>{console.log(`listening ${PORT}`)})



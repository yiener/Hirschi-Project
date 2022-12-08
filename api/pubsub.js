/*const { json } = require("express");
const PubNub = require("pubnub")
const { v4: uuidv4 } = require('uuid');
const { Blockchain } = require("../blockchain");
const { Transaction } = require("../transactions");
const { TransactionQueue } = require("../transactions/transaction-queue");


const credential = {
    publishKey : "pub-c-7d0732d3-5db0-4903-818d-d9f0223ba15a",
    subscribeKey : "sub-c-5ce03db2-3106-46e6-946b-3dad62ce1222",
    secretKey : "sec-c-NDYwYzI2MWEtMjgwMS00M2UzLWE0MDUtNDE0MmE1NDg0NDVk",
    uuid : uuidv4()
}

const CHANNELS_MAP= {
    TEST : "TEST" ,
    BLOCK : "BLOCK" ,
    TRANSACTION : "TRANSACTION"
}

class PubSub {
     constructor(   ){
        this.pubnub = new PubNub(credential)
        this.TransactionQueue = new TransactionQueue()
        this.blockchain = new Blockchain()
        this.subscribeToChannels()
        this.listen()
     }

     subscribeToChannels(){
        this.pubnub.subscribe({
            channels : Object.values(CHANNELS_MAP)
        })

     }
     publish({channel , message}){
        this.pubnub.publish({channel , message })
     }

     listen(){
        this.pubnub.addListener({
            message: messageObject =>{
                const {channel , message } = messageObject
                const parseMessage = JSON.parse(message)
                console.log("message recived Channel" ,  channel);
                switch(channel){
                    case CHANNELS_MAP.BLOCK:
                        console.log("block message" , message);
                        this.blockchain.addBlock(({ block : parseMessage}))
                        .then(() =>  console.log("New block Accepted" , parseMessage))
                        .catch(error => console.error("new block rejected" , error.message ) )
                        break
                    case CHANNELS_MAP.TRANSACTION:
                        console.log(`transaction received ${parseMessage.id}`)
                        this.TransactionQueue.add(new Transaction(parseMessage))
                        break
                    default:
                        return
                }
            }
        })
     }
    broadcastBlock(block){
            this.publish({
                channel : CHANNELS_MAP.BLOCK ,
                message : JSON.stringify(block)
            })
    }
      broadcastTransaction(transaction){
        this.publish({
            channel : CHANNELS_MAP.TRANSACTION ,
            message : JSON.stringify(transaction)
        })
}
}

module.exports={PubSub}*/
const Websocket = require('ws');
const { Blockchain } = require('../blockchain');
const { Block } = require('../blockchain/block');
const { TransactionQueue } = require('../transactions/transaction-queue');
const P2P_PORT = process.env.P2P_PORT || 5000;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS',

}

class P2pServer{
    constructor(blockchain, transactionPool){
        this.blockchain = blockchain;
        this.TransactionQueue = new TransactionQueue();
        this.blockchain = new Blockchain()
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for peer to peer connections on port ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        })
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        this.sendChain(socket);
    }

    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain)
                    break;
                case MESSAGE_TYPES.transaction:
                    this.TransactionQueue.add(data.transaction);
                    this.blockchain.addBlock({transactionQueue : this.transactionQueue})
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.TransactionQueue.clearTransactionPool();
                    break;
            }
        })
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }));
    }

    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction))
    }

    broadcastClearTransactions(){
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })))
    }
}

module.exports = {P2pServer};



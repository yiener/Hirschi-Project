const sodium = require('libsodium-wrappers');
const crypto = require('crypto');
const tls = require('tls');
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
    constructor(blockchain, transactionPool , port, host, peerCertificate, privateKey){
        this.blockchain = blockchain;
        this.TransactionQueue = new TransactionQueue();
        this.blockchain = new Blockchain()
        this.sockets = [];
        this.port = port;
        this.host = host;
        this.peerCertificate = peerCertificate;
        this.privateKey = privateKey;

    }

    async listen(){
     await sodium.ready;
     const options = {
        key: this.privateKey,
        cert: this.peerCertificate,
        requestCert: true,
        rejectUnauthorized: true
      };
  
      const server = tls.createServer(options, socket => {
        const authenticated = this.verifyPeer(socket);
        if (authenticated) {
          this.connectSocket(socket);
        } else {
          console.log("Peer failed to authenticate");
        }
      });
  
      server.listen(this.port, this.host, () => {
        console.log(`P2P Server listening on ${this.host}:${this.port}`);
      });
  
       /* const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for peer to peer connections on port ${P2P_PORT}`);*/
    }
    verifyPeer(socket) {
        const peerCertificate = socket.getPeerCertificate();
        const peerPublicKey = peerCertificate.pubkey;
    
        if (!peerCertificate.subject) {
          console.log("Peer certificate does not have a subject");
          return false;
        }
    
        const message = "Authentication message";
        const signature = socket.receiveSignature();
        const verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(message);
        return verifier.verify(peerPublicKey, signature, 'hex');
      }
    
      connectSocket(socket) {
        console.log(`Connected to peer: ${socket.remoteAddress}:${socket.remotePort}`);
      }


    connectToPeers(){
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        })
    }

   /* connectSocket(socket){
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        this.sendChain(socket);
    }*/

    messageHandler(socket){
        socket.on('message',async message => {
            const encryptedMessage = JSON.parse(message);
            const decryptedMessage = await sodium.crypto_secretbox_open_easy(
            encryptedMessage.ciphertext,
            encryptedMessage.nonce,
            encryptedMessage.key
        );
            const data = JSON.parse(decryptedMessage);
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
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
        const key = sodium.crypto_secretbox_KEYBYTES;
        const plaintext = JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        });
        const ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, key);
        socket.send(JSON.stringify({
            nonce,
            key,
            ciphertext
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



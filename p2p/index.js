const crypto = require("crypto");const { BroadcastChannel } = require("worker_threads");
 SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
const EC = require("elliptic").ec, ec = new EC("secp256k1");


const MINT_PRIVATE_ADDRESS = "0700a1ad28a20e5b2a517c00242d3e25a88d84bf54dce9e1733e6096e6d6495e";
const MINT_KEY_PAIR = ec.keyFromPrivate(MINT_PRIVATE_ADDRESS, "hex");
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

const privateKey = "62d101759086c306848a0c1020922a78e8402e1330981afe9404d0ecc0a4be3d";
const keyPair = ec.keyFromPrivate(privateKey, "hex");
const publicKey = keyPair.getPublic("hex");

const WS = require("ws");
const { Account } = require("../account");
const { Blockchain, hirs } = require("../blockchain");
const { Block } = require("../blockchain/block");
const { Transaction } = require("../transactions");

const PORT = 3000;
const PEERS = [];
const MY_ADDRESS = "ws://localhost:3000";
const server = new WS.Server({ port: PORT });
let opened = [], connected = [];
let check = [];
let checked = [];
let checking = false;
let tempChain = new Blockchain();

console.log("Listening on PORT", PORT);

server.on("connection", async (socket, req) => {
    socket.on("message", message => {
        const _message = JSON.parse(message);

        console.log(_message);

        switch(_message.type) {
            case "TYPE_REPLACE_CHAIN":
                const [ newBlock,newDiff ] = _message.data;

                const ourTx = [...hirs.transactions.map(tx => JSON.stringify(tx))];
                const theirTx = [...newBlock.data.filter(tx => tx.from !== MINT_PUBLIC_ADDRESS).map(tx => JSON.stringify(tx))];
                const n = theirTx.length;

                if (newBlock.prevHash !== hirs.getLastBlock().prevHash) {
                    for (let i = 0; i < n; i++) {
                        const index = ourTx.indexOf(theirTx[0]);

                        if (index === -1) break;
                        
                        ourTx.splice(index, 1);
                        theirTx.splice(0, 1);
                    }

                    if (
                        theirTx.length === 0 &&
                        SHA256(hirs.getLastBlock().hash + newBlock.timestamp + JSON.stringify(newBlock.data) /*+ newBlock.nonce*/) === newBlock.hash /*&&
                        newBlock.hash.startsWith("000" + Array(Math.round(Math.log(JeChain.difficulty) / Math.log(16) + 1)).join("0"))*/ &&
                        Block.hasValidTransactions(newBlock, hirs) &&
                        (parseInt(newBlock.timestamp) > parseInt(hirs.getLastBlock().timestamp) || hirs.getLastBlock().timestamp === "") &&
                        parseInt(newBlock.timestamp) < Date.now() &&
                        hirs.getLastBlock().hash === newBlock.prevHash &&
                        (newDiff + 1 === hirs.difficulty || newDiff - 1 === hirs.difficulty)
                    ) {
                        hirs.chain.push(newBlock);
                       /* JeChain.difficulty = newDiff;*/
                        hirs.transactions = [...ourTx.map(tx => JSON.parse(tx))];
                    }
                } else if (!checked.includes(JSON.stringify([newBlock.prevHash, hirs.chain[hirs.chain.length-2].timestamp || ""]))) {
                    checked.push(JSON.stringify([hirs.getLastBlock().prevHash, hirs.chain[hirs.chain.length-2].timestamp || ""]));

                    const position = hirs.chain.length - 1;

                    checking = true;

                    sendMessage(produceMessage("TYPE_REQUEST_CHECK", MY_ADDRESS));

                    setTimeout(() => {
                        checking = false;

                        let mostAppeared = check[0];

                        check.forEach(group => {
                            if (check.filter(_group => _group === group).length > check.filter(_group => _group === mostAppeared).length) {
                                mostAppeared = group;
                            }
                        })

                        const group = JSON.parse(mostAppeared)

                        hirs.chain[position] = group[0];
                        hirs.transactions = [...group[1]];
                       /* JeChain.difficulty = group[2];*/

                        check.splice(0, check.length);
                    }, 5000);
                }

                break;

            case "TYPE_REQUEST_CHECK":
                opened.filter(node => node.address === _message.data)[0].socket.send(
                    JSON.stringify(produceMessage(
                        "TYPE_SEND_CHECK",
                        JSON.stringify([hirs.getLastBlock(), hirs.transactions/*, JeChain.difficulty*/])
                    ))
                );

                break;

            case "TYPE_SEND_CHECK":
                if (checking) check.push(_message.data);

                break;

            case "TYPE_CREATE_TRANSACTION":
                const transaction = _message.data;

                hirs.addTransaction(transaction);

                break;
           /* case "TYPE_CREATE_ACCOUNT":
              const account  = _message.data;
              hirs.addTransaction(account)*/
                /*break;*/
            case "TYPE_SEND_CHAIN":
                const { block, finished } = _message.data;

                if (!finished) {
                    tempChain.chain.push(block);
                } else {
                    tempChain.chain.push(block);
                    if (Blockchain.isValid(tempChain)) {
                        hirs.chain = tempChain.chain;
                    }
                    tempChain = new Blockchain();
                }

                break;

            case "TYPE_REQUEST_CHAIN":
                const socket = opened.filter(node => node.address === _message.data)[0].socket;
                
                for (let i = 1; i < hirs.chain.length; i++) {
                    socket.send(JSON.stringify(produceMessage(
                        "TYPE_SEND_CHAIN",
                        {
                            block: hirs.chain[i],
                            finished: i === hirs.chain.length - 1
                        }
                    )));
                }

                break;

            case "TYPE_REQUEST_INFO":
                opened.filter(node => node.address === _message.data)[0].socket.send(JSON.stringify(produceMessage(
                    "TYPE_SEND_INFO",
                    [/*JeChain.difficulty, */hirs.transactions]
                )));

                break;

            case "TYPE_SEND_INFO":
                [/* JeChain.difficulty, */hirs.transactions ] = _message.data;
                
                break;

            case "TYPE_HANDSHAKE":
                const nodes = _message.data;

                nodes.forEach(node => connect(node))
        }
    });
})

async function connect(address) {
	if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
		const socket = new WS(address);

		socket.on("open", () => {
			socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [MY_ADDRESS, ...connected])));

			opened.forEach(node => node.socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [address]))));

			if (!opened.find(peer => peer.address === address) && address !== MY_ADDRESS) {
				opened.push({ socket, address });
			}

			if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
				connected.push(address);
			}
		});

		socket.on("close", () => {
			opened.splice(connected.indexOf(address), 1);
			connected.splice(connected.indexOf(address), 1);
		});
	}
}

function produceMessage(type, data) {
	return { type, data };
}

function sendMessage(message) {
	opened.forEach(node => {
		node.socket.send(JSON.stringify(message));
	})
}

process.on("uncaughtException", err => console.log(err));

PEERS.forEach(peer => connect(peer));

setTimeout(() => {
	const transaction = new Transaction(publicKey, "046856ec283a5ecbd040cd71383a5e6f6ed90ed2d7e8e599dbb5891c13dff26f2941229d9b7301edf19c5aec052177fac4231bb2515cb59b1b34aea5c06acdef43", 200, 10 , code = "PUSH10 0x80 PUSH10 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x127 DUP1 PUSH2 0x20 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH1 0xF JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH1 0x28 JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x853255CC EQ PUSH1 0x2D JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x33 PUSH1 0x47 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH1 0x3E SWAP2 SWAP1 PUSH1 0x7C JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x9 SWAP1 POP PUSH1 0x0 PUSH1 0x5 SWAP1 POP DUP1 DUP3 PUSH1 0x5E SWAP2 SWAP1 PUSH1 0xC4 JUMP JUMPDEST SWAP3 POP POP POP SWAP1 JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH1 0x76 DUP2 PUSH1 0x65 JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH1 0x8F PUSH1 0x0 DUP4 ADD DUP5 PUSH1 0x6F JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT JUMPDEST PUSH1 0x0 PUSH1 0xCD DUP3 PUSH1 0x65 JUMP JUMPDEST SWAP2 POP PUSH1 0xD6 DUP4 PUSH1 0x65 JUMP JUMPDEST SWAP3 POP DUP3 DUP3 ADD SWAP1 POP DUP1 DUP3 GT ISZERO PUSH1 0xEB JUMPI PUSH1 0xEA PUSH1 0x95 JUMP JUMPDEST JUMPDEST SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 LOG3 0xF 0xB2 SWAP1 0xE1 SLT 0xB3 PUSH29 0x31DBE54ADF572571A22F70AA62E8078ECED5D325883D9BF864736F6C63 NUMBER STOP ADDMOD GT STOP CALLER ");

	transaction.sign(keyPair);

	sendMessage(produceMessage("TYPE_CREATE_TRANSACTION", transaction));

	hirs.addTransaction(transaction);
    
	


}, 5000);

setTimeout(() => {
	console.log(opened);
	console.log(hirs);
}, 1000);



setTimeout(() => {
	if (hirs.transactions.length !== 0) {
		hirs.mineTransactions(publicKey);

		sendMessage(produceMessage("TYPE_REPLACE_CHAIN", [
			hirs.getLastBlock(),
			
		]))
	}
}, 6500);

setTimeout(() => {
	console.log(opened);
	console.log(hirs);
}, 10000);

/*setTimeout(() => {
	const transaction = new Transaction(publicKey, "046856ec283a5ecbd040cd71383a5e6f6ed90ed2d7e8e599dbb5891c13dff26f2941229d9b7301edf19c5aec052177fac4231bb2515cb59b1b34aea5c06acdef43", 200, 10);

	transaction.sign(keyPair);

	sendMessage(produceMessage("TYPE_CREATE_TRANSACTION", transaction));

	hirs.addTransaction(transaction);

}, 6000);

setTimeout(() => {
	console.log(opened);
	console.log(hirs);
}, 10000);*/

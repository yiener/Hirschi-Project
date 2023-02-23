const { result } = require("lodash");
const { Interpreter } = require("../interpreter");




 
function Excution(instructions  , delay) {
  const noQuotes = instructions.replace(/"/g, "");
  const splitInstructions = noQuotes.split(" ");

  const parsedInstructions = splitInstructions.map(instruction => {
    
    if (instruction.startsWith("0x")) {
      return parseInt(instruction, 16);
    }
    return instruction;
  });
  const length = parsedInstructions.length;
  const mid = Math.ceil(length / 2);
  const firstHalf = parsedInstructions.slice(0, mid);
  const secondHalf = parsedInstructions.slice(mid, length);


 const exc =  new Promise((resolve, reject) => {
    try {
      const inter = new Interpreter()
      let code = [];
      let index = 0;
      for (let i = 0; i < firstHalf.length; i++) {
        code.push(firstHalf[i]);
        index++;
      }
      for (let i = 0; i < secondHalf.length; i++) {
        code.push(secondHalf[i]);
        index++;
      }
      inter.runcode(code);
      setTimeout(() => {
        resolve(inter.state.stack[0]);
      }, delay * 0);
    } catch (error) {
      reject(error);
    }
  });

  return exc.then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  });
}

 

 /*const instructions = "PUSH10 0x80 PUSH10 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x15D DUP1 PUSH2 0x20 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH1 0x4 CALLDATASIZE LT PUSH2 0x2B JUMPI PUSH1 0x0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x853255CC EQ PUSH2 0x30 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH2 0x38 PUSH2 0x4E JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x45 SWAP2 SWAP1 PUSH2 0x7D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH1 0x0 DUP1 PUSH1 0x9 SWAP1 POP PUSH1 0x0 PUSH1 0x5 SWAP1 POP DUP1 DUP3 PUSH2 0x67 SWAP2 SWAP1 PUSH2 0x98 JUMP JUMPDEST SWAP3 POP POP POP SWAP1 JUMP JUMPDEST PUSH2 0x77 DUP2 PUSH2 0xEE JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH1 0x0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x92 PUSH1 0x0 DUP4 ADD DUP5 PUSH2 0x6E JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 PUSH2 0xA3 DUP3 PUSH2 0xEE JUMP JUMPDEST SWAP2 POP PUSH2 0xAE DUP4 PUSH2 0xEE JUMP JUMPDEST SWAP3 POP DUP3 PUSH32 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF SUB DUP3 GT ISZERO PUSH2 0xE3 JUMPI PUSH2 0xE2 PUSH2 0xF8 JUMP JUMPDEST JUMPDEST DUP3 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH1 0x0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH1 0x0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH1 0x0 REVERT INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 CREATE 0x24 0x21 SHL PUSH12 0xBBD3DEC11D80721A4C1D7D49 PUSH3 0xCA3C1A JUMP RETURN PUSH22 0x6241A9957216CFE064736F6C63430008070033000000 "
 console.log(Excution(instructions , 1 ));*/
 

  module.exports={Excution 
  }


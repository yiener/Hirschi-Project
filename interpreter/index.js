

const {keccak256} = require('js-sha3');
const { Account } = require('../account/index.js');
const { countBytes } = require("./bytes.js")
const { storage } = require("./memory.js")
const keyar = []
const valar = []
const STOP = "STOP"
const ADD = "ADD"
const SUB = "SUB"
const MUL = "MUL"
const DIV = "DIV"
const LT = "LT"
const EQ = "EQ"
const GT ="GT"
const AND = "AND";
const OR = "OR"
const JUMP = "JUMP"
const JUMPI = "JUMPI"
const SHL = "SHL"
const SHR = "SHR"
const SAR = "SAR"
const EXECUTION_COMPLETE = "execution complete"
const PUSH1 = "PUSH1"
const PUSH2 = "PUSH2"
const PUSH3 = "PUSH3"
const PUSH4 = "PUSH4"
const PUSH5 = "PUSH5"
const PUSH6 = "PUSH6"
const PUSH7 = "PUSH7"
const PUSH8 = "PUSH8"
const PUSH9 = "PUSH9"
const PUSH10 = "PUSH10"
const PUSH11 = "PUSH11"
const PUSH12= "PUSH12"
const PUSH13= "PUSH13"
const PUSH14 = "PUSH14"
const PUSH15 = "PUSH15"
const PUSH16 = "PUSH16"
const PUSH17= "PUSH17"
const PUSH18 = "PUSH18"
const PUSH19 = "PUSH19"
const PUSH20 = "PUSH20"
const PUSH21 = "PUSH21"
const PUSH22= "PUSH22"
const PUSH23= "PUSH23"
const PUSH24= "PUSH24"
const PUSH25= "PUSH25"
const PUSH26= "PUSH26"
const PUSH27= "PUSH27"
const PUSH28= "PUSH28"
const PUSH29= "PUSH29"
const PUSH30 = "PUSH30"
const PUSH31= "PUSH31"
const PUSH32= "PUSH32"
const SWAP1 = "SWAP1"
const SWAP2 = "SWAP2"
const SWAP3 = "SWAP3"
const SWAP4 = "SWAP4"
const SWAP5 = "SWAP5"
const SWAP6 = "SWAP6"
const SWAP7 = "SWAP7"
const SWAP8 = "SWAP8"
const SWAP9 = "SWAP9"
const SWAP10 = "SWAP10"
const SWAP11 = "SWAP11"
const SWAP12 = "SWAP12"
const SWAP13 = "SWAP13"
const SWAP14 = "SWAP14"
const SWAP15 = "SWAP15"
const SWAP16 = "SWAP16"
const MOD = "MOD"
const ADDMOD = "ADDMOD"
const MULMOD = "MULMOD"
const ISZERO = "ISZERO"
const EXP = "EXP"
const SIGNEXTEND = "SIGNEXTEND"
const SSTORE = "SSTORE"
const SLOAD = "SLOAD"
const  MLOAD = "MLOAD"
const MSTORE = "MSTORE"
const MSIZE = "MSIZE"
const PC = "PC"
const DUP1 = "DUP1"
const DUP2 = "DUP2"
const DUP3 = "DUP3"
const DUP4 = "DUP4"
const DUP5 = "DUP5"
const DUP6 = "DUP6"
const DUP7 = "DUP7"
const DUP8 = "DUP8"
const DUP9 = "DUP9"
const DUP10 = "DUP10"
const DUP11 = "DUP11"
const DUP12 ="DUP12"
const DUP13 = "DUP13"
const DUP14 = "DUP14"
const DUP15 ="DUP15"
const DUP16 = "DUP16"
const REVERT = "REVERT"
const DELEGATECALL = "DELEGATECALL"
const CALLER = "CALLER"
const CALLVALUE = "CALLVALUE"
const CALLDATA = "CALLDATA"
const CALLDATALOAD = "CALLDATALOAD"
const CALLDATASIZE = "CALLDATASIZE"
const CALLDATACOPY = "CALLDATACOPY"
const CALLSIZE = "CALLSIZE"
const CODECOPY = "CODECOPY"
const JUMPDEST = "JUMPDEST"
const POP = "POP"
const LOG0 = "LOG0"
const LOG1 = "LOG1"
const LOG2 = "LOG2"
const LOG3 = "LOG3"
const LOG4 = "LOG4"
const RETURN = "RETURN"
const INVALID = "INVALID"
const SLT = "SLT"
const KECCAK256 = "KECCAK256"
const SGT = "SGT"
const SMOD ="SMOD"
const CREATE = "CREATE"
const EXECUTION_LIMIT=1000
const OPCODE_MAP={
    STOP , ADD  , MUL , SUB , DIV ,  LT , GT ,EQ , AND ,
    OR , JUMP , JUMPI , PUSH10
}


class Interpreter{
   constructor(){
       this.state={
        programcounter:0,
        stack:[],
        code:[],
        executionCode:0,
        contract : {},
        caller:null,
        callValue : 0 ,
        callData:[],
        memory : [],
        


       },
       this.jumpDests = new Set();

   }
   JUMPDEST() {
    // Add the current PC to the set of jump destinations
    this.jumpDests.add(this.pc);
  }
   
   jump(){
    const  destination= this.state.stack.pop()
    if(destination < 0 || destination>this.state.code.length){
        throw new Error(`invalid destination:${destination}`)
    }
    this.state.programcounter = destination
    this.state.programcounter--
    
   }

   takeBytes(b){
    const  value = this.state.code[this.state.programcounter]
    this.state.stack.push(value)
    const a = this.state.stack.pop()
       if(countBytes(a)<=b){
        const  value = this.state.code[this.state.programcounter]
        this.state.stack.push(value)

        }else{
        console.log(`invalid PUSH value in the range bytes: ${a}`);
        
         
       }
     
   }
   getContract(address) {
    // implementar la lógica para obtener el contrato a partir de su dirección
    // puede ser desde un almacén local o desde una llamada a una API remota
    return {
      run: () => {
        console.log("Ejecutando código del contrato en dirección: " + address);
      }
    }};

   runcode(code){
      this.state.code=code 
      while(this.state.programcounter < this.state.code.length ){
        this.state.executionCode++
         const opCode = this.state.code[this.state.programcounter]
         if(this.state.executionCode > EXECUTION_LIMIT){
            throw new Error(`check infinite loop.Execution limit :${EXECUTION_LIMIT}`)
         }


      
      try{
        switch(opCode){
            case STOP:
                throw new Error(EXECUTION_COMPLETE)

            case PUSH1:
            case PUSH2:
            case PUSH3:
            case PUSH4:
            case PUSH5:
            case PUSH6:
            case PUSH7:
            case PUSH8:
            case PUSH9:
            case PUSH10:
            case PUSH12:
            case PUSH13:
            case PUSH14:
            case PUSH15:
            case PUSH16:
            case PUSH17:
            case PUSH18:
            case PUSH19:
            case PUSH20:
            case PUSH21:
            case PUSH22:
            case PUSH23:
            case PUSH24:
            case PUSH25:
            case PUSH26:
            case PUSH27:
            case PUSH28:
            case PUSH29:
            case PUSH30:
            case PUSH31:
            case PUSH32:
            
                this.state.programcounter++
                if(this.state.programcounter === this.state.code.length){
                    console.log(`the push instructions cannot be last`)
                }

            if(opCode===PUSH1) this.takeBytes(1)
            if(opCode===PUSH2) this.takeBytes(2)
            if(opCode===PUSH3) this.takeBytes(3)
            if(opCode===PUSH4) this.takeBytes(4)
            if(opCode===PUSH5) this.takeBytes(5)
            if(opCode===PUSH6) this.takeBytes(6)
            if(opCode===PUSH7) this.takeBytes(7)
            if(opCode===PUSH8) this.takeBytes(8)
            if(opCode===PUSH9) this.takeBytes(9)
            if(opCode===PUSH10) this.takeBytes(10)
            if(opCode===PUSH11) this.takeBytes(11)
            if(opCode===PUSH12) this.takeBytes(12)
            if(opCode===PUSH13) this.takeBytes(13)
            if(opCode===PUSH14) this.takeBytes(14)
            if(opCode===PUSH15) this.takeBytes(15)
            if(opCode===PUSH16) this.takeBytes(16)
            if(opCode===PUSH17) this.takeBytes(17)
            if(opCode===PUSH18) this.takeBytes(18)
            if(opCode===PUSH19) this.takeBytes(19)
            if(opCode===PUSH20) this.takeBytes(20)
            if(opCode===PUSH21) this.takeBytes(21)
            if(opCode===PUSH22) this.takeBytes(22)
            if(opCode===PUSH23) this.takeBytes(23)
            if(opCode===PUSH24) this.takeBytes(24)
            if(opCode===PUSH25) this.takeBytes(25)
            if(opCode===PUSH26) this.takeBytes(26)
            if(opCode===PUSH27) this.takeBytes(27)
            if(opCode===PUSH28) this.takeBytes(28)
            if(opCode===PUSH29) this.takeBytes(29)
            if(opCode===PUSH30) this.takeBytes(30)
            if(opCode===PUSH31) this.takeBytes(31)
            if(opCode===PUSH32) this.takeBytes(32)
            

               

                break
            case ADD:
            case SUB:
            case MUL:
            case DIV:
            case LT:
            case GT:
            case EQ:
            case AND:
            case OR:
            case MOD:
            case ISZERO:
            case EXP:
            case SIGNEXTEND:
            case SLT:
            case SGT:
            case SMOD:
            
                const a = this.state.stack.pop()
                const b = this.state.stack.pop()
                
                
                let result 
                if(opCode=== ADD) result= a + b
                if(opCode===SUB) result=a-b
                if(opCode===MUL) result = a*b
                if(opCode===DIV) result=a/b
                if(opCode===LT) result=a<b ? 1:0
                if(opCode===GT) result=a>b ? 1:0
                if(opCode===EQ) result=a === b ? 1:0
                if(opCode===AND) result= a && b
                if(opCode===OR) result = a || b 
                if(opCode===MOD) result = a % b
                if(opCode===ISZERO) result = a==0 ? 1:0
                if(opCode===EXP) result=a**b
                if(opCode===SLT) result = a < b
                if(opCode===SGT) result = a > b
                if(opCode===SMOD) result = a % b

             this.state.stack.push(result)
            
            
              break

            case ADDMOD:
            case MULMOD:
                const A = this.state.stack.pop()
                const B = this.state.stack.pop()
                const N = this.state.stack.pop()
                if(opCode===ADDMOD) result = (A + B) % N
                if(opCode===MULMOD) result = (A*B)%N
                this.state.stack.push(result)
            break
            case SSTORE:
                const  k = this.state.stack.pop()
                const  v = this.state.stack.pop()
                storage.set(v , k )
                for (let [key, value] of storage) {

 
                    keyar.push(key)
                    valar.push(value)
                 }
                 var g = JSON.stringify(keyar).replace(/[\[\]\,\"]/g,'');
                 var l = JSON.stringify(valar).replace(/[\[\]\,\"]/g,'');
                 if(g.length > 32){
                    storage.clear()
                    throw new Error("the length exceed of byte in the key");

                   
                 }else if(l.length>32){

                    storage.clear()
                    throw new Error("the length exceed of byte in the value")
                 }
                break

            case SLOAD:

                const  load = this.state.stack.pop()
                

                this.state.stack.push(storage.get(load))
                break

            case MSTORE:
                const m1 = this.state.stack.pop()
                const m2 = this.state.stack.pop()
                memory[m2] = m1
                break
            case MLOAD:
                const m3 = this.state.stack.pop()
                this.state.stack.push(memory[m3])
                break
            case MSIZE:
               
                
                var g = JSON.stringify(memory).replace(/[\[\]\,\"]/g,'');
                this.state.stack.push(g.length)
              break
            case PC:
                var pc = this.state.programcounter
                 this.state.stack.push(pc)
                
            
                break
            case JUMP:
                this.jump()
                break
            case JUMPI:
                const condition = this.state.stack.pop()
                if(condition===1){
                    this.jump()


                }
            case DUP1: 
            case DUP2:
            case DUP3:
            case DUP4:  
            case DUP5:
            case DUP6:
            case DUP7:
            case DUP8:
            case DUP9:
            case DUP10:
            case DUP11:
            case DUP12:
            case DUP13:
            case DUP14:
            case DUP15:
            case DUP16:
                if(opCode===DUP1)this.state.stack[1]= this.state.stack[0]
                if(opCode===DUP2)this.state.stack[2]= this.state.stack[0]
                if(opCode===DUP3)this.state.stack[3]= this.state.stack[0]
                if(opCode===DUP4)this.state.stack[4]= this.state.stack[0]
                if(opCode===DUP5)this.state.stack[5]= this.state.stack[0]
                if(opCode===DUP6)this.state.stack[6]= this.state.stack[0]
                if(opCode===DUP7)this.state.stack[7]= this.state.stack[0]
                if(opCode===DUP8)this.state.stack[8]= this.state.stack[0]
                if(opCode===DUP9)this.state.stack[9]= this.state.stack[0]
                if(opCode===DUP10)this.state.stack[10]= this.state.stack[0]
                if(opCode===DUP11)this.state.stack[11]= this.state.stack[0]
                if(opCode===DUP12)this.state.stack[12]= this.state.stack[0]
                if(opCode===DUP13)this.state.stack[13]= this.state.stack[0]
                if(opCode===DUP14)this.state.stack[14]= this.state.stack[0]
                if(opCode===DUP15)this.state.stack[15]= this.state.stack[0]
                if(opCode===DUP16)this.state.stack[16]= this.state.stack[0]
                
                   
                          
                break

            case SWAP1:
            case SWAP2:
            case SWAP3:
            case SWAP4:
            case SWAP5: 
            case SWAP6:
            case SWAP7:
            case SWAP8:
            case SWAP9:
            case SWAP10:
            case SWAP11:
            case SWAP12:
            case SWAP13:
            case SWAP14:
            case SWAP15:
            case SWAP16:  
                 if(opCode===SWAP1)   {const s1 = this.state.stack[0]
                 const s2 = this.state.stack[1]
                 this.state.stack[0]=s2
                 this.state.stack[1]=s1}
                if(opCode===SWAP2) {const s1 = this.state.stack[0]
                 const s2 = this.state.stack[2]
                 this.state.stack[0]=s2
                 this.state.stack[2]=s1}
                if(opCode===SWAP3)   {const s1 = this.state.stack[0]
                 const s2 = this.state.stack[3]
                 this.state.stack[0]=s2
                 this.state.stack[3]=s1}
                if(opCode===SWAP4)   {const s1 = this.state.stack[0]
                    const s2 = this.state.stack[4]
                    this.state.stack[0]=s2
                    this.state.stack[4]=s1}

                if(opCode===SWAP5)   {const s1 = this.state.stack[0]
                        const s2 = this.state.stack[5]
                        this.state.stack[0]=s2
                        this.state.stack[5]=s1}
                if(opCode===SWAP6)   {const s1 = this.state.stack[0]
                            const s2 = this.state.stack[6]
                            this.state.stack[0]=s2
                            this.state.stack[6]=s1}
                if(opCode===SWAP7)   {const s1 = this.state.stack[0]
                                const s2 = this.state.stack[7]
                                this.state.stack[0]=s2
                                this.state.stack[7]=s1}
                if(opCode===SWAP8)   {const s1 = this.state.stack[0]
                                    const s2 = this.state.stack[8]
                                    this.state.stack[0]=s2
                                    this.state.stack[8]=s1}
                if(opCode===SWAP9)   {const s1 = this.state.stack[0]
                                        const s2 = this.state.stack[9]
                                        this.state.stack[0]=s2
                                        this.state.stack[9]=s1}
                if(opCode===SWAP10)   {const s1 = this.state.stack[0]
                                            const s2 = this.state.stack[10]
                                            this.state.stack[0]=s2
                                            this.state.stack[10]=s1}
                if(opCode===SWAP11)   {const s1 = this.state.stack[0]
                                                const s2 = this.state.stack[11]
                                                this.state.stack[0]=s2
                                                this.state.stack[11]=s1}
                if(opCode===SWAP12)   {const s1 = this.state.stack[0]
                                                    const s2 = this.state.stack[12]
                                                    this.state.stack[0]=s2
                                                    this.state.stack[12]=s1}
                if(opCode===SWAP13)   {const s1 = this.state.stack[0]
                                                        const s2 = this.state.stack[13]
                                                        this.state.stack[0]=s2
                                                        this.state.stack[13]=s1}
                if(opCode===SWAP14)   {const s1 = this.state.stack[0]
                                                            const s2 = this.state.stack[14]
                                                            this.state.stack[0]=s2
                                                            this.state.stack[14]=s1}
                if(opCode===SWAP15)   {const s1 = this.state.stack[0]
                                                                const s2 = this.state.stack[15]
                                                                this.state.stack[0]=s2
                                                                this.state.stack[15]=s1}
                if(opCode===SWAP16)   {const s1 = this.state.stack[0]
                                                                    const s2 = this.state.stack[16]
                                                                    this.state.stack[0]=s2
                                                                    this.state.stack[16]=s1}
                
              break
            case SHL:
                let l_ = this.state.stack.pop();
                let a_ = this.state.stack.pop();
                this.state.stack.push(a_ << l_);

              break
            case SHR:
                let shif = this.state.stack.pop();
                let valu = this.state.stack.pop();
                this.state.stack.push(valu >> shif);
              break
            case SAR:
              let shift = this.state.stack.pop();
              let value = this.state.stack.pop();
              this.state.stack.push(value >>> shift);
              break

            case REVERT:
                return
               break 
            case DELEGATECALL:
                this.state.contract = this.getContract(contractAddress);
                this.state.contract.run();
        
             break 
             case CALLER:
                this.state.stack.push(this.state.caller);
                break;
              case CALLVALUE:
                this.state.stack.push(this.state.callValue);
                break;
              case CALLDATALOAD:
                let loadIndex = this.state.stack.pop();
                let valu_ = this.state.callData[loadIndex];
                this.state.stack.push(valu_);
                break;
              case CALLDATASIZE:
                this.state.stack.push(this.state.callData.length);
                break;
              case CALLDATACOPY:
                let destIndex = this.state.stack.pop();
                let sourceIndex = this.state.stack.pop();
                let length = this.state.stack.pop();
        
                for (let i = 0; i < length; i++) {
                  this.state.memory[destIndex + i] = this.state.callData[sourceIndex + i];
                }
                break;
              case CALLSIZE:
                this.state.stack.push(this.state.code.length);
                break;
              case CODECOPY:
                let codeDestIndex = this.state.stack.pop();
                let codeSourceIndex = this.state.stack.pop();
                let codeLength = this.state.stack.pop();
        
                for (let i = 0; i < codeLength; i++) {
                  this.state.memory[codeDestIndex + i] = this.state.code[codeSourceIndex + i];
                }
                break;
                case SIGNEXTEND:
                  let bit = this.state.stack.pop();
                  let value__ = this.state.stack.pop();
                  let signBit = value__ & (1 << (bit * 8 - 1));
                  let extended = signBit ? value__ | (0xffffffff << (32 - bit * 8)) : value__;
                  this.state.stack.push(extended);
                  break;
                  case "JUMPDEST":
                    this.JUMPDEST();
                    break;
                case POP:
                   this.state.stack.pop();
                    break;
                case LOG0 :
                  const Length = this.state.stack.pop();
                  const offset = this.state.stack.pop();
                  const memorySlice = this.state.memory.slice(offset, offset + Length);
                  const event = { data: memorySlice };
                  this.state.contract.emit("LOG0", event);
                     break;
                case LOG1:
                  const topic0 = this.state.stack.pop();
                  const length_ = this.state.stack.pop();
                  const offset_ = this.state.stack.pop();
                  const memorySlice_ = this.state.memory.slice(offset_, offset_ + length_);
                  const event_ = { data: memorySlice_, topics: [topic0] };
                  this.state.contract.emit("LOG1", event_);

                   break;
                 case LOG2:
                  const topic1 = this.state.stack.pop();
                  const topic0_ = this.state.stack.pop();
                  const length__ = this.state.stack.pop();
                  const offset__ = this.state.stack.pop();
                  const memorySlice__ = this.state.memory.slice(offset__, offset__ + length__);
                  const event__ = { data: memorySlice__, topics: [topic0_, topic1] };
                  this.state.contract.emit("LOG2", event__);
                  break; 
                  case LOG3:
                    const topic2___ = this.state.stack.pop();
                    const topic1___ = this.state.stack.pop();
                    const topic0___= this.state.stack.pop();
                    const length___ = this.state.stack.pop();
                    const offset___ = this.state.stack.pop();
                    const memorySlice___ = this.state.memory.slice(offset___, offset___ + length___);
                    const event___ = { data: memorySlice___, topics: [topic0___, topic1___, topic2___] };
                    this.state.contract.emit("LOG3", event___); 
                   break;
                case LOG4:
                  const topic3 = this.state.stack.pop();
                  const topic2 = this.state.stack.pop();
                  const topic1____ = this.state.stack.pop();
                  const topic0____ = this.state.stack.pop();
                  const length____ = this.state.stack.pop();
                  const offset____ = this.state.stack.pop();
                  const memorySlice____ = this.state.memory.slice(offset____, offset____ + length____);
                  const event____ = { data: memorySlice____, topics: [topic0____, topic1____, topic2, topic3] };
                  this.state.contract.emit("LOG4", event____);
                  break;
                case RETURN: 
                  const length_1 = this.state.stack.pop();
                  const offset_1 = this.state.stack.pop();
                  const returnValue = this.state.memory.slice(offset_1, offset_1 + length_1);
                  this.state.executionCode = -1;
                  return returnValue;
                 break; 
                case INVALID:
                  this.state.executionCode = -1;
                  break;
                case KECCAK256:
                    const offset_2 = this.state.stack.pop();
                    const length_2 = this.state.stack.pop();
                    const data = this.state.memory.slice(offset_2, offset_2 + length_2);
                    const hash = keccak256(data);
                    this.state.stack.push(hash);
                    break;
               case CREATE:
                 let value_3 = this.state.stack.pop();
                 let offset_3 = this.state.stack.pop();
                 let size_3 = this.state.stack.pop();
                 let code_3 = this.state.memory.slice(offset_3, offset_3 + size_3);
  
                 let newAccount = new Account({ code_3 });
                 this.state.contract.balance = this.state.contract.balance - value_3;
                 newAccount.balance = newAccount.balance + value_3;
  
                 this.state.stack.push(newAccount.address);
                     break;
  
        }


      }
     catch(error){
         if(error.message === EXECUTION_COMPLETE){
            return this.state.stack[this.state.stack.length-1]
         }
         throw error



     }
     this.state.programcounter++
     
   }
 } 

}

/*const code = [PUSH , 1, PUSH , 0 ,OR, STOP]*/
/*const code = [PUSH , 6  , JUMP , PUSH , 0   , JUMP , PUSH ,"JUMP SUCCESFUL" , STOP ]*/
/*const code = [PUSH , 0 , JUMP , STOP]*/

/*const code =[PUSH , 0 , JUMP , STOP]*/
/*const code = [PUSH1 , 0 , PUSH1 , 10 ,MSTORE  , MSIZE ,  STOP]*/
/*const code = [PUSH7 , 7 ,PUSH10 , 9 ,SWAP1 ,  DIV ,     STOP] */




const code = [  
  PUSH10,128,PUSH10,64,MSTORE,CALLVALUE,DUP1,ISZERO,PUSH2,16,JUMPI,PUSH1,0,DUP1,REVERT,JUMPDEST,POP,PUSH2,349,DUP1,PUSH2,32,PUSH1,0,CODECOPY,PUSH1,0,RETURN,INVALID,PUSH1,128,PUSH1,64,MSTORE,CALLVALUE,DUP1,
  ISZERO,PUSH2,16,JUMPI,PUSH1,0,DUP1,REVERT,JUMPDEST,POP,PUSH1,4,CALLDATASIZE,LT,PUSH2,43,JUMPI,PUSH1,0,CALLDATALOAD,PUSH1,224,SHR,DUP1,PUSH4,2234668492,EQ,PUSH2,48,JUMPI,JUMPDEST,PUSH1,0,DUP1,REVERT,JUMPDEST,PUSH2,56,PUSH2,78,JUMP,JUMPDEST,PUSH1,64,MLOAD,PUSH2,69,SWAP2,SWAP1,PUSH2,125,JUMP,JUMPDEST,PUSH1,64,MLOAD,DUP1,SWAP2,SUB,SWAP1,RETURN,JUMPDEST,PUSH1,0,DUP1,PUSH1,9,SWAP1,POP,PUSH1,0,PUSH1,5,SWAP1,POP,DUP1,DUP3,PUSH2,103,SWAP2,SWAP1,PUSH2,152,JUMP,JUMPDEST,SWAP3,POP,POP,POP,SWAP1,JUMP,JUMPDEST,PUSH2,119,DUP2,PUSH2,238,JUMP,JUMPDEST,DUP3,MSTORE,POP,POP,JUMP,JUMPDEST,PUSH1,0,PUSH1,32,DUP3,ADD,SWAP1,POP,PUSH2,146,PUSH1,0,DUP4,ADD,DUP5,PUSH2,110,JUMP,JUMPDEST,SWAP3,SWAP2,POP,POP,JUMP,JUMPDEST,PUSH1,0,PUSH2,163,DUP3,PUSH2,238,JUMP,JUMPDEST,SWAP2,POP,PUSH2,174,DUP4,PUSH2,238,JUMP,JUMPDEST,SWAP3,POP,DUP3,PUSH32,1.157920892373162e+77,SUB,DUP3,GT,ISZERO,PUSH2,227,JUMPI,PUSH2,226,PUSH2,248,JUMP,JUMPDEST,JUMPDEST,DUP3,DUP3,ADD,SWAP1,POP,SWAP3,SWAP2,POP,POP,JUMP,JUMPDEST,PUSH1,0,DUP2,SWAP1,POP,SWAP2
  ,SWAP1,POP,JUMP,JUMPDEST,PUSH32,3.540846713943345e+76,PUSH1,0,MSTORE,PUSH1,17,PUSH1,4,MSTORE,PUSH1,36,PUSH1,0,REVERT,INVALID,LOG2,PUSH5,452857328472,34,SLT,KECCAK256,CREATE,36,33,SHL,PUSH12,5.812983211223684e+28,PUSH3,13253658,JUMP,RETURN,PUSH22,3.676211883597407e+52,
  
]
try{const interpreter = new Interpreter()
 interpreter.runcode(code)
 console.log(interpreter.state.stack);
}catch(err){
   new Error(err)
}
Interpreter.OPCODE_MAP = OPCODE_MAP
module.exports={Interpreter 
}

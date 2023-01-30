const { Interpreter } = require("../interpreter");

let code = [  "PUSH14",4,"PUSH14" , 9 , "PUSH14" , 8 , "DUP14" , 4,  , "SWAP14" , 2,"ADD" ,"JUMP", "ADD", "JUMP" , "JUMPI"  , "SUB","SUB","MUL","DIV","LT","EQ","GT","AND","OR","MOD","ADDMOD","MULMOD","ISZERO", 
"EXP","SSTORE","SLOAD","MLOAD","MSTORE","MSIZE","PC","STOP"]



const fragmentation = (code) => {
  let last
  const pushValues = [];
  const pushPositions = []
  let originalOrderPush = []
  let originalOrderPushPositions = []
  const dupValues = []
  const dupPositions = []
  let originalOrderDup = []
  let originalOrderDupPositions = []
  const swapValues = []
  const swapPositions = []
  let originalOrderSwap = []
  let originalOrderSwapPositions = []
  const subValues = [];
  const subPositions = [];
  let originalOrderSub = [];
  let originalOrderSubPositions = [];
  const mulValues = [];
  const mulPositions = [];
  let originalOrderMul = [];
  let originalOrderMulPositions = [];
  const divValues = [];
  const divPositions = [];
  let originalOrderDiv = [];
  let originalOrderDivPositions = [];
  const jumpValues = [];
  const jumpPositions = [];
  let originalOrderJump = [];
  let originalOrderJumpPositions = [];
  const jumpiValues = [];
  const jumpiPositions = [];
  let originalOrderJumpi = [];
  let originalOrderJumpiPositions = [];
  const addValues = [];
  const addPositions = [];
  let originalOrderAdd = [];
  let originalOrderAddPositions = [];
  const ltValues = [];
  const ltPositions = [];
  let originalOrderLt = [];
  let originalOrderLtPositions = [];
  const eqValues = [];
  const eqPositions = [];
  let originalOrderEq = [];
  let originalOrderEqPositions = [];
  const gtValues = [];
  const gtPositions = [];
  let originalOrderGt = [];
  let originalOrderGtPositions = [];
  const andValues = [];
  const andPositions = [];
  let originalOrderAnd = [];
  let originalOrderAndPositions = [];
  const orValues = [];
  const orPositions = [];
  let originalOrderOr = [];
  let originalOrderOrPositions = [];
  const modValues = [];
  const modPositions = [];
  let originalOrderMod = [];
  let originalOrderModPositions = [];
  const addmodValues = [];
  const addmodPositions = [];
  let originalOrderAddmod = [];
  let originalOrderAddmodPositions = [];
  const mulmodValues = [];
  const mulmodPositions = [];
  let originalOrderMulmod = [];
  let originalOrderMulmodPositions = [];
  const iszeroValues = [];
  const iszeroPositions = [];
  let originalOrderIszero = [];
  let originalOrderIszeroPositions = [];
  const expValues = [];
  const expPositions = [];
  let originalOrderExp = [];
  let originalOrderExpPositions = [];
  const sstoreValues = [];
  const sstorePositions = [];
  let originalOrderSstore = [];
  let originalOrderSstorePositions = [];
  const sloadValues = [];
  const sloadPositions = [];
  let originalOrderSload = [];
  let originalOrderSloadPositions = [];
  const mloadValues = [];
  const mloadPositions = [];
  let originalOrderMload = [];
  let originalOrderMloadPositions = [];
  const mstoreValues = [];
  const mstorePositions = [];
  let originalOrderMstore = [];
  let originalOrderMstorePositions = [];
  const msizeValues = [];
  const msizePositions = [];
  let originalOrderMsize = [];
  let originalOrderMsizePositions = [];
  const pcValues = [];
  const pcPositions = [];
  let originalOrderPc = [];
  let originalOrderPcPositions = [];
  const stopValues = [];
  const stopPositions = [];
  let originalOrderStop = [];
  let originalOrderStopPositions = [];

  for (let i = 0; i < code.length; i++) {
    if (typeof code[i] === "string" && /^PUSH[1-9]|1[0-16]$/.test(code[i])) {
        pushValues.push(code[i]);
        pushPositions.push(i);
        pushValues.push(code[i + 1]);
        pushPositions.push(i+1);
        i++;
    }
    if (typeof code[i] === "string" && /^DUP[1-9]|1[0-16]$/.test(code[i])) {
        dupValues.push(code[i]);
        dupPositions.push(i);
     
    }
    if (typeof code[i] === "string" && /^SWAP[1-9]|1[0-16]$/.test(code[i])) {
        swapValues.push(code[i]);
        swapPositions.push(i);
       
    }
    if (code[i] === "SUB") {
        subValues.push(code[i]);
        subPositions.push(i);
    }
    if (code[i] === "MUL") {
        mulValues.push(code[i]);
        mulPositions.push(i);
    }
    if (code[i] === "DIV") {
        divValues.push(code[i]);
        divPositions.push(i);
    }
    if (code[i] === "JUMP") {
        jumpValues.push(code[i]);
        jumpPositions.push(i);
    }
    if (code[i] === "JUMPI") {
        jumpiValues.push(code[i]);
        jumpiPositions.push(i);
    }
    if(code[i] === "ADD"){
        addValues.push(code[i]);
        addPositions.push(i)
    }
    if(code[i] === "LT"){
        ltValues.push(code[i]);
        ltPositions.push(i)
    }
    if(code[i] === "EQ"){
        eqValues.push(code[i]);
        eqPositions.push(i)
    }
    if(code[i] === "GT"){
        gtValues.push(code[i]);
        gtPositions.push(i)
    }
    if(code[i] === "AND"){
        andValues.push(code[i]);
        andPositions.push(i)
    }
    if(code[i] === "OR"){
        orValues.push(code[i]);
        orPositions.push(i)
    }
    if(code[i] === "MOD"){
        modValues.push(code[i]);
        modPositions.push(i)
    }
    if(code[i] === "ADDMOD"){
        addmodValues.push(code[i]);
        addmodPositions.push(i)
    }
    if(code[i] === "MULMOD"){
        mulmodValues.push(code[i]);
        mulmodPositions.push(i)
    }
    if(code[i] === "ISZERO"){
        iszeroValues.push(code[i]);
        iszeroPositions.push(i)
    }
    if(code[i] === "EXP"){
        expValues.push(code[i]);
        expPositions.push(i)
    }
    if(code[i] === "SSTORE"){
        sstoreValues.push(code[i]);
        sstorePositions.push(i)
    }
    if(code[i] === "SLOAD"){
        sloadValues.push(code[i]);
        sloadPositions.push(i)
    }
    if(code[i] === "MLOAD"){
        mloadValues.push(code[i]);
        mloadPositions.push(i)
    }
    if(code[i] === "MSTORE"){
        mstoreValues.push(code[i]);
        mstorePositions.push(i)
    }
    if(code[i] === "MSIZE"){
        msizeValues.push(code[i]);
        msizePositions.push(i)
    }
    if(code[i] === "PC"){
        pcValues.push(code[i]);
        pcPositions.push(i)
    }
    if(code[i] === "STOP"){
        stopValues.push(code[i]);
        stopPositions.push(i)
    }
  }
  originalOrderPush= pushValues;
  originalOrderPushPositions= pushPositions;
  originalOrderDup= dupValues;
  originalOrderDupPositions= dupPositions;
  originalOrderSwap = swapValues;
  originalOrderSwapPositions = swapPositions;
  originalOrderSub = subValues;
  originalOrderSubPositions = subPositions;
  originalOrderMul = mulValues;
  originalOrderMulPositions = mulPositions;
  originalOrderDiv = divValues;
  originalOrderDivPositions = divPositions;
  originalOrderJump = jumpValues;
  originalOrderJumpPositions = jumpPositions;
  originalOrderJumpi = jumpiValues;
  originalOrderJumpiPositions = jumpiPositions;
  originalOrderAdd = addValues;
  originalOrderAddPositions = addPositions;
  originalOrderLt = ltValues;
  originalOrderLtPositions = ltPositions;
  originalOrderEq = eqValues;
  originalOrderEqPositions = eqPositions;
  originalOrderGt = gtValues;
  originalOrderGtPositions = gtPositions;
  originalOrderAnd = andValues;
  originalOrderAndPositions = andPositions;
  originalOrderOr = orValues;
  originalOrderOrPositions = orPositions;
  originalOrderMod = modValues;
  originalOrderModPositions = modPositions;
  originalOrderAddmod = addmodValues;
  originalOrderAddmodPositions = addmodPositions;
  originalOrderMulmod = mulmodValues;
  originalOrderMulPositions = mulmodPositions;
  originalOrderIszero = iszeroValues;
  originalOrderIszeroPositions = iszeroPositions;
  originalOrderExp = expValues;
  originalOrderExpPositions = expPositions;
  originalOrderSstore = sstoreValues;
  originalOrderSstorePositions = sstorePositions;
  originalOrderSload = sloadValues;
  originalOrderSloadPositions = sloadPositions;
  originalOrderMload = mloadValues;
  originalOrderMloadPositions = mloadPositions;
  originalOrderMstore = mstoreValues;
  originalOrderMstorePositions = mstorePositions;
  originalOrderMsize = msizeValues;
  originalOrderMsizePositions = msizePositions;
  originalOrderPc = pcValues;
  originalOrderPcPositions = pcPositions;
  originalOrderStop = stopValues;
  originalOrderStopPositions = stopPositions;

  const filteredCode = code.filter((instruction, index) => !originalOrderPushPositions.includes(index) && !originalOrderDupPositions.includes(index) && !originalOrderSwapPositions.includes(index)&& !originalOrderSubPositions.includes(index)
  && !originalOrderMulPositions.includes(index) && !originalOrderDivPositions.includes(index) && !originalOrderJumpPositions.includes(index) && !originalOrderJumpiPositions.includes(index) 
  && !originalOrderAddPositions.includes(index) && !originalOrderLtPositions.includes(index) && !originalOrderEqPositions.includes(index) && !originalOrderGtPositions.includes(index) && !originalOrderAndPositions.includes(index)
  && !originalOrderOrPositions.includes(index) && !originalOrderModPositions.includes(index) && !originalOrderAddmodPositions.includes(index) && !originalOrderMulmodPositions.includes(index) && !originalOrderIszeroPositions.includes(index)
  && !originalOrderExpPositions.includes(index) && !originalOrderSstorePositions.includes(index) && !originalOrderSloadPositions.includes(index) && !originalOrderMloadPositions.includes(index) && !originalOrderMstorePositions.includes(index)
  && !originalOrderMsizePositions.includes(index) && !originalOrderPcPositions.includes(index) && !originalOrderStopPositions.includes(index)
  );
  last = filteredCode

  return [/*last ,*/ originalOrderPush , originalOrderPushPositions, originalOrderDup, originalOrderDupPositions, originalOrderSwap, originalOrderSwapPositions
,originalOrderSub  , originalOrderSubPositions  , originalOrderMul , originalOrderMulPositions , originalOrderDiv , originalOrderDivPositions , originalOrderJump , originalOrderJumpPositions,
 originalOrderJumpi , originalOrderJumpiPositions , originalOrderAdd , originalOrderAddPositions ,originalOrderLt , originalOrderLtPositions ,originalOrderEq , originalOrderEqPositions ,originalOrderGt , originalOrderGtPositions ,
 originalOrderAnd , originalOrderAndPositions ,originalOrderOr , originalOrderOrPositions ,originalOrderMod , originalOrderModPositions , originalOrderAddmod , originalOrderAddmodPositions ,originalOrderMulmod , originalOrderMulmodPositions ,
 originalOrderIszero , originalOrderIszeroPositions ,originalOrderExp , originalOrderExpPositions ,originalOrderSstore , originalOrderSstorePositions ,originalOrderSload , originalOrderSloadPositions ,originalOrderMload , originalOrderMloadPositions , 
 originalOrderMstore , originalOrderMstorePositions ,originalOrderMsize , originalOrderMsizePositions ,originalOrderPc , originalOrderPcPositions ,originalOrderStop  , originalOrderStopPositions]
}




module.exports={ fragmentation}
/*console.log(code);
console.log(originalOrderPush);
console.log(originalOrderPushPositions);*/

console.log(fragmentation(code));



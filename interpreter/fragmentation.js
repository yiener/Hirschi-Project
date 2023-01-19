const { Interpreter } = require(".");

let code = ["PUSH10" , 9 , "PUSH10" , 8 ,"ADD" , "STOP"]

const fragmentation = (code) =>{
  let last
   const pushValues = [];
   const originalOrderPush = []
   const originalOrderPushPositions = []

 for (let i = 0; i < code.length; i++) {
    if (typeof code[i] === "string" && code[i].startsWith("PUSH")) {
        originalOrderPush.push(code[i]);
        originalOrderPush.push(code[i + 1]);
        originalOrderPushPositions.push(i);
        
        originalOrderPushPositions.push(i+1);
        


    }
}

  const second = [0,1,2,3];

  const filteredCode = code.filter((_, index) => !second.includes(index));
  last = filteredCode

  return [last , originalOrderPush , originalOrderPushPositions]
  




}
/*console.log(code);
console.log(originalOrderPush);
console.log(originalOrderPushPositions);*/

console.log(fragmentation(code));



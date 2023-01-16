const { Interpreter } = require(".");

let  code = ["PUSH10" , 9 , "PUSH10" , 9 , "ADD" , "STOP"]


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
code = filteredCode
/*console.log(code);
console.log(originalOrderPush);
console.log(originalOrderPushPositions);*/


const codeExcution = (Array1, Array2, delay) => {
    return new Promise((resolve, reject) => {
      try {
        const inter = new Interpreter();
        let code = [];
        let index = 0;
        for (let i = 0; i < Array1.length; i++) {
          code.push(Array1[i]);
          index++;
        }
        for (let i = 0; i < Array2.length; i++) {
          code.push(Array2[i]);
          index++;
        }
        inter.runcode(code);
        setTimeout(() => {
          resolve(inter.state.stack[0]);
        }, delay * 1000);
      } catch (error) {
        reject(error);
      }
    });
  };
  

codeExcution(originalOrderPush, code, 1)
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });


  module.exports={codeExcution 
  }
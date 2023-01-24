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
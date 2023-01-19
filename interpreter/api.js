const express = require('express');
const bodyParser = require('body-parser');
const {codeExcution} = require('./index');

const app = express();
app.use(bodyParser.json());
app.post('/runcode', (req, res) => {
  if(typeof req.body.code !== "undefined" && Array.isArray(req.body.code)) {
    try {
      const responseVM = codeExcution(req.body.code);
      res.json({ responseVM });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "El código es requerido" });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en el puerto ${PORT}`);
});
/*const code = ["PUSH10" , 9  , "PUSH10" , 8 ,"ADD" , "STOP"]
console.log(codeExcution(code));*/



const express = require("express");
const solc = require("solc");

const app = express();

app.get("/opcodes", (req, res) => {
  const contractSource = req.query.source;
  if (!contractSource) {
    return res.status(400).send({ error: "Contract source is required." });
  }

  try {
    const compiled = solc.compile(contractSource, 1);
    const contract = compiled.contracts[":ContractName"];
    const opcodes = contract.bytecode;
    return res.send({ opcodes });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server is listening on port ${PORT}`);
});


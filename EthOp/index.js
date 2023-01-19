const Web3 = require('web3');
const disasm = require('disasm');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/fba93bd572584af6955b6ca64d915440'));

const contractAddress = '0x00000000006c3852cbEf3e08E8dF289169EdE581'; // Dirección del contrato inteligente

async function getOpcodes() {
    // Obtener el bytecode del contrato
    const byteCode = await web3.eth.getCode(contractAddress);
    console.log(byteCode);
    //Desensamblar bytecode en opcodes
    const opcodes = disasm.code(byteCode);
    console.log(opcodes);
}
getOpcodes();


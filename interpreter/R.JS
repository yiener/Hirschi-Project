function signExtend(num, numBits) {
  let signBit = 1 << (numBits - 1);
  return (num & signBit) ? (num | ~(signBit - 1)) : num;
}

let number = -2;
let numberOfBits = -2;

console.log(signExtend(number, numberOfBits));

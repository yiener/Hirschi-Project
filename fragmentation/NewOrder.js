
function organizeInstructions(array) {
  let instructions = [];
  let positions = [];
  
  array.forEach(subArray => {
    if (typeof subArray[0] === 'string') {
      instructions = instructions.concat(subArray);
    } else {
      positions = positions.concat(subArray);
    }
  });
  const instructionsByPosition = {};
  positions.forEach((position, index) => {
    instructionsByPosition[position] = instructions[index];
  });
  
    return Object.values(instructionsByPosition)
 
}

console.log(organizeInstructions([
  [ 'PUSH10', 14, 'PUSH10', 9 ],
  [ 0, 1, 2, 3 ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [ 'ADD' ],
  [ 4 ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [ 'STOP' ],
  [ 5 ]
]));



module.exports={organizeInstructions}








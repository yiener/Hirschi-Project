
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




module.exports={organizeInstructions}








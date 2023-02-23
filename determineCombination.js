const { cn } = require("./combinations")



var  callCount = 0 
var r = 0


const determineCombination=  ()=>{
    if(callCount  === cn.length-1){
        callCount = 0
        
       
  }else{
     if(callCount === 0 && r === 0){
          r++
     }else{
     callCount += 1;
     }
     
  }

  return callCount
  

}

module.exports={determineCombination}

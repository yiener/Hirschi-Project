const countBytes = b => {var r = JSON.stringify(b).replace(/[\[\]\,\"]/g,'') 
                        return r.length;}







module.exports = {countBytes}
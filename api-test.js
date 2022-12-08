/*const { response } = require("express")
const request = require('request')

const BASE_URL = "http://localhost:3000"

const postTransact = ({to , value}) =>{
    return new Promise((resolve , reject)=> {
        request(`${BASE_URL}/account/transact`, {
            method : "POST" ,
            headers : {"content-Type" : "application/json"},
            body : JSON.stringify({to , value})
        },(error , response , body )=>{
            return resolve(JSON.parse(JSON.stringify(body)))
        })
    })
}
*/
/*postTransact({to : "ihfihfieif" , value: 30 })
    .then(postResponse => {
        console.log("postTransactResponse" , postResponse);
       /* const toAccountData = postResponse.transaction.data.accountData
        return postTransact({to:toAccountData.address , value:20})*/
   /* })*/
   /* .then(postResponse2 => {
        console.log("postTransactResponse" , postResponse2);
    })*/

const { keccakHash } = require("../util")
const _ = require("lodash")

class Node{
    constructor(){
        this.value = null
        this.childMap = {}
    }
}



class Trie {
   constructor(){
      this.head = new  Node()
       this.generateRootHash()
   }
   generateRootHash(){
    this.rootHash = keccakHash(this.head)
   }
   get({key}){
     let node = this.head
     for(let char  of key){
        if(!node.childMap[char]){
             return null
        }else{
            node = node.childMap[char]
        }
        return _.cloneDeep(node.value)
     }

   }
   put({key , value }){
    let  node = this.head
    for(let char of key ){
        if(!node.childMap[char]){
            node.childMap[char] = new Node()
        }
        node = node.childMap[char]
     }
     node.value = value
     this.generateRootHash()

   }

   static buildTrie({ items }){
         const trie =  new this()
         for(let item of items.sort((a , b ) => {keccakHash(a) > keccakHash(b)}) ){
              trie.put({
                 key:keccakHash(item) , value: item
              })

         }

         return trie
   }
}

module.exports={Trie  }

/*const trie = new Trie()*/
/*trie.put({
    key:"hola",
    value:100
})

trie.put({
    key:"holo",
    value:200
})

trie.put({
    key:"halo",
    value:200
})*/
/*console.log(JSON.stringify(trie , null , 3));*/

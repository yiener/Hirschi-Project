/*class TransactionQueue{
    constructor(){
        this.transactioMap = {}
    }
    add(transaction){
        this.transactioMap[transaction.id] = transaction
    }
    getTransactionSeries(){
        return Object.values(this.transactioMap)
    }
    clearBlockTransactions({ transactionSeries }){
        for(let  transaction of transactionSeries){
            delete this.transactioMap(transaction.id)
        }
        t
    }
}

module.exports = {TransactionQueue}*/
class TransactionQueue{
    constructor(){
        this.transactions = [];
    }

    updateOrAddTransaction(transaction){
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);   // Revisamos que la transaccion que llega no esta ya en el pool
        if (transactionWithId){
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;   // Si lo esta la actualizamos
        } else {
            this.transactions.push(transaction);    // Si no lo esta, la introducimos
        }
    }

    existingTransaction(address){
        return this.transactions.find(transaccion => transaccion.input.address === address); 
    }

    ViewPool(){
        /*for (let i = 0; i <= this.transactions.length; i++){*/
           
           return this.transactions
        /*}*/
    }

   /* validTransactions(){
        return this.transactions.filter(transaccion => {
            const outputTotal = transaccion.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            if (transaccion.input.amount !== outputTotal){
                console.log(`Invalid transaction fron ${transaccion.input.address}`);
                return;
            }
            if (!Transaction.verifyTransaction(transaccion)){
                console.log(`Invalid signature fron ${transaccion.input.address}`);
                return;
            }
            return transaccion;
        });
    }*/

    clearTransactionPool(){
        this.transactions = [];
    }
}

module.exports = {TransactionQueue};

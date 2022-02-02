class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddtransaction(transaction) {
    let transactionWithId = this.transactions.find(
      (t) => t.id === transaction.id
    );

    if (!transactionWithId) {
      this.transactions.push(transaction);
      return;
    }

    this.transactions[this.transactions.indexOf(transactionWithId)] =
      transaction;
  }

  existingTransaction(address) {
    return this.transactions.find((t) => t.input.address === address);
  }
}

module.exports = TransactionPool;

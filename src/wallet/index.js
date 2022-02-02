const { INITIAL_BALANCE } = require("../config");
const Hashs = require("../utils/hashs");
const Transaction = require("./transaction");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = Hashs.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, transactionPool) {
    if (amount > this.balance) {
      console.info(`Amount: ${amount} exceeds balance`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddtransaction(transaction);
    }

    return transaction;
  }
}

module.exports = Wallet;

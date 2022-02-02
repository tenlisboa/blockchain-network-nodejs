const Hashs = require("../utils/hashs");

class Transaction {
  constructor() {
    this.id = Hashs.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      (output) => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.info(`Amount: ${amount} exceeds balance`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static newTransaction(senderWallet, recipient, amount) {
    const transaction = new Transaction();

    if (amount > senderWallet.balance) {
      console.info(`Amount: ${amount} exceeds balance`);
      return;
    }

    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey,
        },
        {
          amount,
          address: recipient,
        },
      ]
    );

    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(Hashs.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction) {
    return Hashs.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      Hashs.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;

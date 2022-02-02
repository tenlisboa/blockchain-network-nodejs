const Wallet = require("../../wallet");
const Transaction = require("../../wallet/transaction");
const TransactionPool = require("../../wallet/transaction-pool");

describe("TransactionPool", () => {
  let tp, wallet, transaction;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, "r4nd0m4ddr3ss", 30);
    tp.updateOrAddtransaction(transaction);
  });

  it("should add a transaction to the pool", () => {
    expect(tp.transactions.find((t) => t.id === transaction.id)).toEqual(
      transaction
    );
  });

  it("should update a transaction from the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "n3xt-recipent", 50);
    tp.updateOrAddtransaction(newTransaction);

    expect(
      JSON.stringify(tp.transactions.find((t) => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });
});

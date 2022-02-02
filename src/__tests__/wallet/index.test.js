const Wallet = require("../../wallet");
const Transaction = require("../../wallet/transaction");
const TransactionPool = require("../../wallet/transaction-pool");

describe("Wallet", () => {
  let wallet, tp;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe("creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = "R4andom-address";
      transaction = wallet.createTransaction(recipient, sendAmount, tp);
    });

    describe("And doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it("should check if it the sendAmount was subtracted twice from the wallet", () => {
        expect(
          transaction.outputs.find(
            (output) => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it("should check it clones the sendAmount for the recipient", () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipient)
            .map((output) => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});

const Transaction = require("../../wallet/transaction");
const Wallet = require("../../wallet");

describe("Transaction", () => {
  let transaction, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    recipient = "Block1recp";
    amount = 50;
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  });

  it("should check if the output 'amount' was subtracted from the wallet", () => {
    expect(
      transaction.outputs.find((output) => output.address === wallet.publicKey)
        .amount
    ).toEqual(wallet.balance - amount);
  });

  it("should check if the output 'amount' has been passed to the recipient", () => {
    expect(
      transaction.outputs.find((output) => output.address === recipient).amount
    ).toEqual(amount);
  });

  it("should check if the input amount is the same of wallet's balance", () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it("should check if the signature is correct", () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true);

    transaction.outputs[0].amount = 5000;

    expect(Transaction.verifyTransaction(transaction)).toBe(false);
  });

  describe("transacting an exceeding amount", () => {
    beforeEach(() => {
      amount = 50000;
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it("shouldn't create the transaction", () => {
      expect(transaction).toEqual(undefined);
    });
  });

  describe("updating transaction", () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 10;
      nextRecipient = "Xamana8492a";
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it("should check it the amount it's being subtracted", () => {
      expect(
        transaction.outputs.find(
          (output) => output.address === wallet.publicKey
        ).amount
      ).toEqual(wallet.balance - amount - nextAmount);
    });

    it("should check if the output amount is in the outputs list", () => {
      expect(
        transaction.outputs.find((output) => output.address === nextRecipient)
          .amount
      ).toEqual(nextAmount);
    });
  });
});

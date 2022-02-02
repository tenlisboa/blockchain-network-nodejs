const Blockchain = require("../../blockchain");
const Block = require("../../blockchain/block");

describe("Blockchain", () => {
  let bc;
  let bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  it("should have a genesis block as the first block", () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it("should add a new block", () => {
    const data = { amount: 123 };
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  });

  it("should be a valid chain", () => {
    bc2.addBlock({ amount: 50 });

    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it("should be invalid if a block genesis is corrupted", () => {
    bc2.chain[0].data = { amount: 0 };

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it("should be invalid if a chain is corrupted", () => {
    bc2.addBlock({ amount: 50 });
    bc2.chain[1].data = { amount: 51 };

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it("should replace the chain with a new chain", () => {
    bc2.addBlock({ amount: 50 });
    bc.replaceChain(bc2.chain);

    expect(JSON.stringify(bc.chain)).toEqual(JSON.stringify(bc2.chain));
  });

  it("should not replace the chain if it is not longer than the current chain", () => {
    bc2.addBlock({ amount: 50 });
    bc.addBlock({ amount: 50 });
    bc.addBlock({ amount: 500 });

    bc.replaceChain(bc2.chain);

    expect(JSON.stringify(bc.chain)).not.toEqual(JSON.stringify(bc2.chain));
  });

  it("should not replace the chain if it is equals to the current chain", () => {
    bc2.addBlock({ amount: 50 });
    bc.addBlock({ amount: 51 });

    bc.replaceChain(bc2.chain);

    expect(JSON.stringify(bc.chain)).not.toEqual(JSON.stringify(bc2.chain));
  });
});

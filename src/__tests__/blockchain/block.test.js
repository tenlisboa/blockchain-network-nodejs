const Block = require("../../blockchain/block");

describe("Block", () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = {
      amount: 150.0,
    };
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it("should set the `data` to match the input", () => {
    expect(block.data).toEqual(data);
  });

  it("should set the `lastHash` to match the last block hash", () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it("should generate a hash that matches the difficulty", () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      "0".repeat(block.difficulty)
    );
  });

  it("should decrement the difficulty for a slow block generation", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(
      block.difficulty - 1
    );
  });

  it("should increase the difficulty for a fast block generation", () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 100)).toEqual(
      block.difficulty + 1
    );
  });
});

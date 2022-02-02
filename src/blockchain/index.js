const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);

    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !==
          Block.hash(
            block.timestamp,
            block.lastHash,
            block.data,
            block.nonce,
            block.difficulty
          )
      ) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.info("This chain is not longer than the actual chain.");
      return;
    }
    if (!this.isValidChain(newChain)) {
      console.info("This chain is not valid.");
      return;
    }

    this.chain = newChain;
  }
}

module.exports = BlockChain;

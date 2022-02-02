const { DIFFICULTY, MINE_RATE } = require("../config");
const Hashs = require("../utils/hashs");

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  static genesis() {
    return new this(
      "Genesis Time",
      null,
      "hash",
      { genesis: true },
      0,
      DIFFICULTY
    );
  }

  static adjustDifficulty(lastBlock, currentTimestamp) {
    let { difficulty } = lastBlock;
    difficulty =
      lastBlock.timestamp + MINE_RATE > currentTimestamp
        ? difficulty + 1
        : difficulty - 1;

    return difficulty;
  }

  static mineBlock(lastBlock, data) {
    let nonce = 0;
    let hash, timestamp;
    let { difficulty, hash: lastHash } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return Hashs.hash(
      timestamp + lastHash + JSON.stringify(data) + nonce + difficulty
    );
  }
}

module.exports = Block;

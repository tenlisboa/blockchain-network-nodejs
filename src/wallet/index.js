const { INITIAL_BALANCE } = require("../config");
const Hashs = require("../utils/hashs");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = Hashs.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
}

module.exports = Wallet;

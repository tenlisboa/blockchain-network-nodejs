require("dotenv").config();

const P2PServer = require("./p2p-server");

const express = require("express");
const Blockchain = require("./blockchain");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const tp = new TransactionPool();
const wallet = new Wallet();

const p2pServer = new P2PServer(bc);

app.use(express.json());

app.get("/blocks", (request, response) => {
  return response.json(bc.chain);
});

app.post("/mine", (request, response) => {
  bc.addBlock(request.body);

  p2pServer.syncChain();

  return response.json(bc.chain);
});

app.get("/transactions", (request, response) => {
  return response.json(tp.transactions);
});

app.post("/transact", (request, response) => {
  const { recipient, amount } = request.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);

  return response.json(tp.transactions);
});

app.listen(HTTP_PORT, () => console.log(`Server lintening on: ${HTTP_PORT}`));
p2pServer.listen();

require("dotenv").config();

const P2PServer = require("./p2p-server");

const express = require("express");
const Blockchain = require("./blockchain");
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();

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

app.listen(HTTP_PORT, () => console.log(`Server lintening on: ${HTTP_PORT}`));
p2pServer.listen();

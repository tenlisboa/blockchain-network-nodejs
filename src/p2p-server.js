const WebSocket = require("ws");
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

// Conexão automatica de peers

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.socket = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on("connection", (socket) => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Socket server for peer-to-peer connection on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.socket.push(socket);
    console.info("Socket Connected");

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  connectToPeers() {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on("open", (data) => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on("message", (message) => {
      const data = JSON.parse(message);

      this.blockchain.replaceChain(data);
    });
  }

  syncChain() {
    this.socket.forEach((socket) => this.sendChain(socket));
  }
}

module.exports = P2PServer;

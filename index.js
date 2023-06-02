const express = require('express');
const cors = require('cors');
const app = express();
const Blockchain = require('./blockchain.js');

const PORT = process.env.PORT || 5500;
const blockchain = new Blockchain();

app.use(express.json());
app.use(cors());

app.post('/add-block', (req, res) => {
  const data = req.body.data;
  blockchain.addBlock(data);
  console.log('New block added:', JSON.stringify(blockchain.chain[blockchain.chain.length - 1]));
  res.send(blockchain.chain[blockchain.chain.length - 1]);
});

app.get('/get-block', (req, res) => {
  res.json(blockchain.getBlock());
});

app.post('/mine-block', (req, res) => {
    const data = req.body.block;
    
    blockchain.mineBlock(data);
    res.send(blockchain.chain[blockchain.chain.length - 1]);
  });
  app.post('/not-valid', (req, res) => {
    const data = req.body.block;
    blockchain.notValid(data);
    res.send(blockchain.chain[blockchain.chain.length - 1]);
  });

// Serve static files (including index.html)
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Listening for HTTP requests on port ${PORT}`);
});

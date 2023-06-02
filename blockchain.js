const Block = require('./block');
const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    const timestamp = new Date().toISOString();
    return new Block(0, timestamp, 'Genesis Block', '0', this.calculateHash(0, timestamp, 'Genesis Block', '0', 0), 0,true);
  }

  calculateHash(index, timestamp, data, previousHash, nonce) {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash + nonce)
      .digest('hex');
  }

  mineBlock(block) {
   
    while (!block.hash.startsWith('0'.repeat(this.difficulty))) {
      block.nonce++;
     
      block.hash = this.calculateHash(block.index, block.timestamp, block.data, block.previousHash, block.nonce,true);
    }
    block.valid=true
  this.chain[block.index]=block


   // return block;
  }

  addBlock(data) {
    const previousBlock = this.chain[this.chain.length - 1];
    const index = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    const nonce = 0;
    const hash = this.calculateHash(index, timestamp, data, previousBlock.hash, nonce);
    const newBlock = new Block(index, timestamp, data, previousBlock.hash, hash, nonce,true);
     this.mineBlock(newBlock);
    
   // this.chain.push(minedBlock);
  }
  getBlock(){
    return this.chain;
  }
  notValid(block){
    this.chain[block.index].data=block.data
    for(var i=block.index;i<this.chain.length;i++)
    this.chain[i].valid=false;

  }
}

module.exports = Blockchain;
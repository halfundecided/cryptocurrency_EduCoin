//javascript library that provides SHA256 security
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
//import methods from p2p
import {broadcastLatest, broadCastTransactionPool} from './p2p';
//import methods from transaction
import {
    getCoinbaseTransaction, isValidAddress, processTransactions, Transaction, UnspentTxOut
} from './transaction';
//import methods from transaction pool
import {addToTransactionPool, getTransactionPool, updateTransactionPool} from './transactionPool';
//import methods from util
import {hexToBinary} from './util';
//import methods from wallet
import {createTransaction, findUnspentTxOuts, getBalance, getPrivateFromWallet, getPublicFromWallet} from './wallet';
//Block class that has the most basic data needed for a block in the blockchain
class Block {

    public index: number; //height of block in the chain
    public hash: string; //hash taken from the content of the block
    public previousHash: string; //reference to the previous block's hash
    public timestamp: number; // a literal timestamp
    public data: Transaction[]; //data that is stored in the blockchain
    public difficulty: number; //difficulty for mining this block
    public nonce: number; //nonce is.a RNG for authenticating
    //constructors for previous variables
    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: Transaction[], difficulty: number, nonce: number) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}

const mysql = require('mysql');

//mysql connection parameters
var connection = mysql.createConnection({
    host: "polomoto.com",
    user: "wordpress",
    password: "WordPressUserPassword",
    database: "wordpress"
});



//This is to setup the first transaction. It uses a default address and amount
const genesisTransaction = {
    'txIns': [{'signature': '', 'txOutId': '', 'txOutIndex': 0}],
    'txOuts': [{
        'address': '04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a',
        'amount': 50
    }],
    'id': 'e655f6a5f26dc9b4cac6e46f52336428287759cf81ef5ff10854f69d68f43fa3'
};

//The way a blockchain works is by linking each block to the hash of the previous block
//however, there must be a hardcoded 0th block-- called the genesis block
//this has a index of 0 (obviously), a hash, no previous block, the current Unix timestamp, and a name
const genesisBlock: Block = new Block(
    0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', '', 1521580268, [genesisTransaction], 0, 0
);



//this is just an array of blocks that currently only contains the genesis block
let blockchain: Block[] = [genesisBlock];
//this is just a constant variable that points to the blockchain array
const getBlockchain = (): Block[] => blockchain;
//this is a constant variable that points to the most recent block (-1)
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

//unspent transaction outputs of genesis block is set to this on start
let unspentTxOuts: UnspentTxOut[] = processTransactions(blockchain[0].data, [], 0);

//get the unspent transaction outputs from unspentTxOuts
const getUnspentTxOuts = (): UnspentTxOut[] => _.cloneDeep(unspentTxOuts);

//setUnspentTxOuts updates txPool and should be only updated at the same time
const setUnspentTxOuts = (newUnspentTxOut: UnspentTxOut[]) => {
    console.log('replacing unspentTxouts with: %s', newUnspentTxOut);
    unspentTxOuts = newUnspentTxOut;
};

//generate blocks at this interval in seconds
const BLOCK_GENERATION_INTERVAL: number = 10;
//every x blocks increase the mining difficulty
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;
//get current time
const getCurrentTimestamp = (): number => Math.round(new Date().getTime() / 1000);

//getDifficult method to adjust the difficulty of the current block / the block difficulty
//does computation in getAdjustedDifficulty
const getDifficulty = (aBlockchain: Block[]): number => {
    //get newest block
    const latestBlock: Block = aBlockchain[blockchain.length - 1];
    if (latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
        return getAdjustedDifficulty(latestBlock, aBlockchain);
    } else {
        return latestBlock.difficulty;
    }
};

//getAdjustedDifficulty
const getAdjustedDifficulty = (latestBlock: Block, aBlockchain: Block[]) => {
    //get the last adjusted block
    const prevAdjustmentBlock: Block = aBlockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    //get time expected to mine
    const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    //current time taken since last block
    const timeTaken: number = latestBlock.timestamp - prevAdjustmentBlock.timestamp;
    //if theres less time then increase difficulty 
    if (timeTaken < timeExpected / 2) {
        return prevAdjustmentBlock.difficulty + 1;
    //else decrease difficulty
    } else if (timeTaken > timeExpected * 2) {
        if(prevAdjustmentBlock.difficulty > 0) {
            return prevAdjustmentBlock.difficulty - 1;
        } else {
            return 0;
        }
    //else nothing
    } else {
        return prevAdjustmentBlock.difficulty;
    }
};

//generate a raw block actual does things
const generateRawNextBlock = (blockData: Transaction[]) => {
    //getLatestblock
    const previousBlock: Block = getLatestBlock();
    //getDifficulty with above method
    const difficulty: number = getDifficulty(getBlockchain());
    //increment index
    const nextIndex: number = previousBlock.index + 1;
    //just get current time
    const nextTimestamp: number = getCurrentTimestamp();
    //create a new block, if its unique add to blockchain else return error
    const newBlock: Block = findBlock(nextIndex, previousBlock.hash, nextTimestamp, blockData, difficulty);
    if (addBlockToChain(newBlock)) {
        broadcastLatest();
        return newBlock;
    } else {
        return null;
    }
};



//MICHAEL DINEEN
//Generates next block. uses hash from previous block to create the rest of required content
//index,hash,data,timestamp
const generateNextBlock = () => {
    //get transaction and block data and actually do everything in generateRawNextBlock
    const coinbaseTx: Transaction = getCoinbaseTransaction(getPublicFromWallet(), getLatestBlock().index + 1);
    const blockData: Transaction[] = [coinbaseTx].concat(getTransactionPool());
    return generateRawNextBlock(blockData);
};


const calculateHashForBlock = (block: Block): string => //Calculates hash code for the block in type string
    calculateHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce); //takes in all of the parameters for the block in order to calculate
    //a formal unique hash code for a new block

    //Calculates a unique hash code, takes in index, previoushash, timestamp,data, and returns a type string
const calculateHash = (index: number, previousHash: string, timestamp: number, data: Transaction[], difficulty: number, nonce: number): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data + difficulty + nonce).toString(); //CryptoKS.SHA256 <--- Library function that calculates hash for user
    //toString converts hash to type string which is the type returned by this function

const addBlock = (newBlock: Block) => { //Creates a new block of type block
    if (isValidNewBlock(newBlock, getLatestBlock())) { //tests to see that new block is valid, also gets latest block (most recent)
        blockchain.push(newBlock); //Most recent block will allow for previous hash to create new hash code
    } //Blockchain.push(newblock) <--- Pushes the new block onto block chain stack
};
//Michael Dineen 2nd commit 
//Adds the created block to the overall blockchain
const addBlockToChain = (newBlock: Block): boolean => {
    if (isValidNewBlock(newBlock, getLatestBlock())) { //Tests to see if new block is valid, also gets most recent block (previous)
        const retVal: UnspentTxOut[] = processTransactions(newBlock.data, getUnspentTxOuts(), newBlock.index); //checks to see if transactions are valid
        if (retVal === null) {  //If return value of transaction is null, return false
            console.log('block is not valid in terms of transactions'); //Returns invalid message to log
            return false;
        } else { //If transaction is valid
            blockchain.push(newBlock); //Push new block onto the block chain 
            setUnspentTxOuts(retVal); //sets unspenttxouts to the retval if that return value has been determined not to be null
            updateTransactionPool(unspentTxOuts); //Updates the transaction pool with the value of the unspent transaction outputs
            return true; //Returns true since the transaction is valid 
        }
    }
    return false; //Return false otherwise
};


const hashMatchesDifficulty = (hash: string, difficulty: number): boolean => { //Function that increases hash difficulty for mining 
    const hashInBinary: string = hexToBinary(hash); //converts hexidecimal to binary in string
    const requiredPrefix: string = '0'.repeat(difficulty); //Checks to see if the string contains required prefic
    return hashInBinary.startsWith(requiredPrefix); //Determines that hash code starts with proper binary prefix 
};

//Mitchell Brooks
//isValidBlockStructure validates that a newly submitted block matches the correct types specified by the following variables:
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number' //block.index === ensures the type of index is a number
        && typeof block.hash === 'string' //block.hash === ensures that the hash type is a string
        && typeof block.previousHash === 'string' //block.previousHash === ensures that the previous hash of the block is of type string
        && typeof block.timestamp === 'number' //block.timestamp === ensures that the timestamp of the block is a number
        && typeof block.data === 'object'; //block.data === ensures that the data of the block is of type string (i.e "block2data")
};
const isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    //checks to see if the block is valid
    if (!isValidBlockStructure(newBlock)) {
        console.log('Block has invalid structure');
        return false;
    }
    //makes sure the blocks are not the same
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('Blocks are the same');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        //Hashes the previous block and compares it to the newBlock to see if they are the same, fails if they are different
        console.log('Hashes are not the same');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        //Determines it is an invalid hash if the newBlock.hash does not equal the calculated hash for the newBlock
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('Invalid Hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

//Helper for replaceChain, returns if an inputted blockchain is a valid one
const isValidChain = (blockchainToValidate: Block[]): boolean => {
    //checks if the genesis block is valid if so return the JSON version of it
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchainToValidate[0])) {
        return false; //If the first block is invalid, the blockchain cannt be valid
    }
    //Loops through each remaining block to see if it is a valid addition to the blockchain so far
    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};



//Replaces current blockchain with inputted blockchain
const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        //Checks to make sure the inputted blockchain is a valid one
        console.log('New Blockchain is valid, replacing old Blockchain with new one.');
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        //Rejects the invalid blockchain
        console.log('New Blockchain is invalid, cannot replace it.');
    }
};
const generatenextBlockWithTransaction = (receiverAddress: string, amount: number) => {
    //Takes in a string and an amount and generates the amount of new blocks in the recievers address
    if (!isValidAddress(receiverAddress)) {
        //Checks to make sure there is a valid receiving address 
        throw Error('invalid address');
    }
    if (typeof amount !== 'number') {
        //Checks to make sure "amount" is a number
        throw Error('invalid amount');
    }
    const coinbaseTx: Transaction = getCoinbaseTransaction(getPublicFromWallet(), getLatestBlock().index + 1);
    //Adds the transaction to the Public Wallet
    const tx: Transaction = createTransaction(receiverAddress, amount, getPrivateFromWallet(), getUnspentTxOuts(), getTransactionPool());
    //Creates the transaction from the receivers end 
    const blockData: Transaction[] = [coinbaseTx, tx];
    //Generates the next block 
    return generateRawNextBlock(blockData);
};

const findBlock = (index: number, previousHash: string, timestamp: number, data: Transaction[], difficulty: number): Block => {
    //Takes the information of a block and finds it
    let nonce = 0;
    while (true) {
    //Permanent for loop 
        const hash: string = calculateHash(index, previousHash, timestamp, data, difficulty, nonce);
        //Goes through the hashes 
        if (hashMatchesDifficulty(hash, difficulty)) {
            //Returns the block when the block is found
            return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
        }
        //Simple counter
        nonce++;
    }
};

//send transaction method
const sendTransaction = (address: string, amount: number): Transaction => {
    //makes transaction
    const tx: Transaction = createTransaction(address, amount, getPrivateFromWallet(), getUnspentTxOuts(), getTransactionPool());
    //add to pool
    addToTransactionPool(tx, getUnspentTxOuts());
    //broadcast
    broadCastTransactionPool();
    return tx;
};


const simpleSend = (name: string, send: string, amount: string): string => {

    var sql =  "SELECT name, balance from accounts where name='" + name + "'";
    var sql2 = "SELECT publickey, balance from accounts where name='" + send + "'";   

    var result;
    var sendPublic;
    var sendAmount;
    var recievePublic;
    var recieveAmount;
    var amt = Number(amount);

    connection.query(sql, (err, res) => {

        if(err) {
            connection.end();
            return "FAILURE";
        } else {

        console.log('>> results: ', res );
        var string=JSON.stringify(res);
        console.log('>> string: ', string );
        var json =  JSON.parse(string);
        console.log('>> json: ', json);
        console.log('>> Send publickey: ', json[0].publickey);
        console.log('>> Send balance: ', json[0].balance);
        sendPublic = json[0].name;
        sendAmount = Number(json[0].balance);
        var x = sendAmount - amt;
        updateSend(sendPublic, x);

   
        }
                
    });


    // connection.query(sql2, (err, res) => {

    //     if(err) {
    //         connection.end();
    //         return "FAILURE";
    //     }
    //     console.log('>> results: ', res );
    //     var string=JSON.stringify(res);
    //     console.log('>> string: ', string );
    //     var json =  JSON.parse(string);
    //     console.log('>> json: ', json);
    //     console.log('>> Recieve publickey: ', json[0].publickey);
    //     console.log('>> Recieve balance: ', json[0].balance);
    //     recievePublic = json[0].name;
    //     recieveAmount = Number(json[0].balance);
    //     var pay = recieveAmount + amt;


    // });

     var sendSQL = "UPDATE accounts set balance = " + amount + " where name='" + send + "'";
    // var sendSQL2 = "UPDATE accounts set balance = " + 0 + " where name='" + name + "'";

    //     connection.query(sendSQL, (err, res) => {

    //         if(err) {
    //             return "FAILURE";
    //         }
    //         console.log("UPDATE:"+JSON.stringify(res));

    //     });

    //     connection.end();

        // connection.query(sendSQL2, (err, res) => {

        //     if(err) {
        //         return "FAILURE";
        //     }
        //     console.log("UPDATE2:"+JSON.stringify(res));

        // });

    // connection.end();



    return "Success";

}


const mine = (name: string):string => {
    console.log("Starting Mine");
    var sql = "select balance from accounts where name='MiningLimit'";
    connection.query(sql, (err, res) => {

        if(err) {
            connection.end();
            return "FAILURE";
        } else {
            var string = JSON.stringify(res);
            var json = JSON.parse(string);
            var limit = json[0].balance;
            doMine(name, limit);
            doUpdate(name, limit);
        }

    });

};

const doMine = (name: string, limit: string) => {
    console.log("Updating Limit:"+limit+"Name:"+name);
    var l = Number(limit);
    var MINEAMT = 50;
    if(l > 0 && name == 'DD') {

     var sql = "update accounts set balance = " + (l - MINEAMT) + " where name='MiningLimit'"; 
     connection.query(sql, (err, res) => {
        if (err) {
            connection.end();
            return "FAILURE";
        } else {
            console.log(res);
        }
     });
 }
};

const doUpdate = (name: string, limit: string) => {
    console.log("Getting Account Balance");
    var l = Number(limit);
    var MINEAMT = 50;
    var sql2 = "select balance from accounts where name='" + name + "'";
     connection.query(sql2, (err, res) => {
        if (err) {
            connection.end();
            return "FAILURE";
        } else {
            var string = JSON.stringify(res);
            var json = JSON.parse(string);
            var amt = json[0].balance;
            var a = Number(amt);
            var x = a + MINEAMT;
            updateSend(name, x);
        }
     });
    
};


 const simpleRecieve = (name: string, send: string, amount: string): string => {
    var sql2 = "SELECT name, balance from accounts where name='" + send + "'";   
  var recievePublic;
    var recieveAmount;

    connection.query(sql2, (err, res) => {

        if(err) {
            connection.end();
            return "FAILURE";
        }
        //console.log('>> results: ', res );
        var string=JSON.stringify(res);
        //console.log('>> string: ', string );
        var json =  JSON.parse(string);
        //console.log('>> json: ', json);
        console.log('>> Recieve publickey: ', json[0].publickey);
        console.log('>> Recieve balance: ', json[0].balance);
        recievePublic = json[0].name;
        recieveAmount = Number(json[0].balance);
        var amt = Number(amount);
        var x = recieveAmount+amt;
        updateSend(recievePublic, x);

    });

    return "Rec";
};

const updateSend = (name: string, amt: number) => {
    console.log("DOING UPDATE");
     var sendSQL = "UPDATE accounts set balance = " + amt + " where name='" + name + "'";


        connection.query(sendSQL, (err, res) => {

            if(err) {
                    connection.end();

                return "FAILURE";
            }
            console.log("Updated Balance"));

        });
     return "UPDATE";

};

//deal with transaction by adding to pool
const handleReceivedTransaction = (transaction: Transaction) => {
    addToTransactionPool(transaction, getUnspentTxOuts());
};

// gets the unspent transaction outputs owned by the wallet
const getMyUnspentTransactionOutputs = () => {
    return findUnspentTxOuts(getPublicFromWallet(), getUnspentTxOuts());
};

//get account balance
const getAccountBalance = (): number => {
    return getBalance(getPublicFromWallet(), getUnspentTxOuts());
};

//checks to see if block has a valid hash
const hasValidHash = (block: Block): boolean => {
    //checks for valid hash if not then returns false
    if (!hashMatchesBlockContent(block)) {
        console.log('invalid hash, got:' + block.hash);
        return false;
    }
    //makes sure that the block difficulty is correct 
    if (!hashMatchesDifficulty(block.hash, block.difficulty)) {
        console.log('block difficulty not satisfied. Expected: ' + block.difficulty + 'got: ' + block.hash);
    }
    return true;
};
//checks to make sure hash matches block content via calculating the hash for the block
const hashMatchesBlockContent = (block: Block): boolean => {
    const blockHash: string = calculateHashForBlock(block);
    return blockHash === block.hash;
};

//TODO
//export for use with the rest of the crypto
export {
    Block, getBlockchain, getUnspentTxOuts, getLatestBlock, sendTransaction, mine,
    generateRawNextBlock, generateNextBlock, generatenextBlockWithTransaction,
    handleReceivedTransaction, getMyUnspentTransactionOutputs, simpleSend, simpleRecieve,
    getAccountBalance, isValidBlockStructure, replaceChain, addBlockToChain
};
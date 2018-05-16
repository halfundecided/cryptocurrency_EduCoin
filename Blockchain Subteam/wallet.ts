
//import statements 
import {ec} from 'elliptic';
import {existsSync, readFileSync, unlinkSync, writeFileSync} from 'fs';
import * as _ from 'lodash';
import {getPublicKey, getTransactionId, signTxIn, Transaction, TxIn, TxOut, UnspentTxOut} from './transaction';

const EC = new ec('secp256k1');
const privateKeyLocation = process.env.PRIVATE_KEY || 'node/wallet/private_key';

const mysql = require('mysql');

//mysql connection parameters
var connection = mysql.createConnection({
    host: "polomoto.com",
    user: "wordpress",
    password: "WordPressUserPassword",
    database: "wordpress"
});



const setupAccount = (name: string): string => {

    const newPrivateKey = generatePrivateKey();
    const publickey: string = getPublicKey(newPrivateKey);
    console.log(name);
    const root = name == "daddyd" ? 1 : 0;

    var sql = "INSERT INTO accounts (name, root, privatekey, publickey, address, balance) VALUES('" + name + "', '" + root + "', '" + newPrivateKey + "', '" + publickey + "', '" + "null" + "', '" + "0" + "')";
 
    connection.query(sql, function(err, result) {
        if(err) {
            connection.end();
            return "FAILURE";
        }
        console.log("inserted");
    });

    



    // return "success";
    return name;

}




//returns the private key from the wallet
const getPrivateFromWallet = (): string => {
    const buffer = readFileSync(privateKeyLocation, 'utf8');
    return buffer.toString();
};
//returns the public key for wallet
const getPublicFromWallet = (): string => {
    const privateKey = getPrivateFromWallet();
    const key = EC.keyFromPrivate(privateKey, 'hex');
    return key.getPublic().encode('hex');
};
//generates a new private key for a wallet
const generatePrivateKey = (): string => {
    const keyPair = EC.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};
//
const initWallet = () => {
    // do not override existing private keys
    // if (existsSync(privateKeyLocation)) {
    //     return;
    // }

    //basic sql implementation

    const newPrivateKey = generatePrivateKey();
    const publickey: string = getPublicKey(newPrivateKey);

    var sql = "INSERT INTO accounts (name, root, privatekey, publickey, address, balance) VALUES('" + "name1" + "', '" + "1" + "', '" + newPrivateKey + "', '" + publickey + "', '" + "null" + "', '" + "0" + "')";

    // connection.query(sql);

    // connection.end();



    //writeFileSync(privateKeyLocation, newPrivateKey);
    //console.log('new wallet with private key created to : %s', privateKeyLocation);
};
//deletes wallet and unlinks keys
const deleteWallet = () => {
    if (existsSync(privateKeyLocation)) {
        unlinkSync(privateKeyLocation);
    }
};
//returns balance 
const getBalance = (address: string, unspentTxOuts: UnspentTxOut[]): number => {
    return _(findUnspentTxOuts(address, unspentTxOuts))
        .map((uTxO: UnspentTxOut) => uTxO.amount)
        .sum();
};
//calculates/finds unspent amounts on accounts
const findUnspentTxOuts = (ownerAddress: string, unspentTxOuts: UnspentTxOut[]) => {
    return _.filter(unspentTxOuts, (uTxO: UnspentTxOut) => uTxO.address === ownerAddress);
};
//finds if the user has enough for the text 
const findTxOutsForAmount = (amount: number, myUnspentTxOuts: UnspentTxOut[]) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return {includedUnspentTxOuts, leftOverAmount};
        }
    }

    const eMsg = 'Cannot create transaction from the available unspent transaction outputs.' +
        ' Required amount:' + amount + '. Available unspentTxOuts:' + JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
};
//creates outputs
const createTxOuts = (receiverAddress: string, myAddress: string, amount, leftOverAmount: number) => {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    //no left over money calls for a 0
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

const filterTxPoolTxs = (unspentTxOuts: UnspentTxOut[], transactionPool: Transaction[]): UnspentTxOut[] => {
    const txIns: TxIn[] = _(transactionPool)
        .map((tx: Transaction) => tx.txIns)
        .flatten()
        .value();
    const removable: UnspentTxOut[] = [];
    for (const unspentTxOut of unspentTxOuts) {
        const txIn = _.find(txIns, (aTxIn: TxIn) => {
            return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
        });

        if (txIn === undefined) {

        } else {
            removable.push(unspentTxOut);
        }
    }

    return _.without(unspentTxOuts, ...removable);
};
//creates transaction between two users
const createTransaction = (receiverAddress: string, amount: number, privateKey: string,
                           unspentTxOuts: UnspentTxOut[], txPool: Transaction[]): Transaction => {

    console.log('txPool: %s', JSON.stringify(txPool));
    const myAddress: string = getPublicKey(privateKey);
    const myUnspentTxOutsA = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);

    // filter from unspentOutputs such inputs that are referenced in pool
    const {includedUnspentTxOuts, leftOverAmount} = findTxOutsForAmount(amount, myUnspentTxOuts);
    //returns the text in for a user
    const toUnsignedTxIn = (unspentTxOut: UnspentTxOut) => {
        const txIn: TxIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(toUnsignedTxIn);

    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });

    return tx;
};

export {createTransaction, getPublicFromWallet, setupAccount,
    getPrivateFromWallet, getBalance, generatePrivateKey, initWallet, deleteWallet, findUnspentTxOuts};
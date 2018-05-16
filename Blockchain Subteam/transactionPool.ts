import * as _ from 'lodash';
import {Transaction, TxIn, UnspentTxOut, validateTransaction} from './transaction';

let transactionPool: Transaction[] = [];

const getTransactionPool = () => {
    //Getter
    return _.cloneDeep(transactionPool);
};

const addToTransactionPool = (tx: Transaction, unspentTxOuts: UnspentTxOut[]) => {

    if (!validateTransaction(tx, unspentTxOuts)) {
        //Checks to make sure it is a valid transaction
        throw Error('Trying to add invalid tx to pool');
    }

    if (!isValidTxForPool(tx, transactionPool)) {
        //Checks to make sure the validated transaction is valid for the pool
        throw Error('Trying to add invalid tx to pool');
    }
    console.log('adding to txPool: %s', JSON.stringify(tx));
    //Only occurs if transaction and pool are both validated
    transactionPool.push(tx);
};

const hasTxIn = (txIn: TxIn, unspentTxOuts: UnspentTxOut[]): boolean => {
    //Returns true or false if the transaction is found in UpspentTxOut
    const foundTxIn = unspentTxOuts.find((uTxO: UnspentTxOut) => {
        return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
    });
    return foundTxIn !== undefined;
};

const updateTransactionPool = (unspentTxOuts: UnspentTxOut[]) => {
    const invalidTxs = [];
    for (const tx of transactionPool) {
        for (const txIn of tx.txIns) {
            //Nested for loops, checks to see if the transactions
            //is in the upspentTxOut, if not, it pushes it onto
            //invalidTxs
            if (!hasTxIn(txIn, unspentTxOuts)) {
                invalidTxs.push(tx);
                break;
            }
        }
    }
    if (invalidTxs.length > 0) {
        //Removes the invalid transactions from the transaction pool
        console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
        transactionPool = _.without(transactionPool, ...invalidTxs);
    }
};

const getTxPoolIns = (aTransactionPool: Transaction[]): TxIn[] => {
    //Gets the transaction goin into a specific pool
    return _(aTransactionPool)
        //maps out the transactions
        .map((tx) => tx.txIns)
        .flatten()
        .value();
};

const isValidTxForPool = (tx: Transaction, aTtransactionPool: Transaction[]): boolean => {
    //Returns true if the transaction is valid for our pool, false otherwise
    const txPoolIns: TxIn[] = getTxPoolIns(aTtransactionPool);

    const containsTxIn = (txIns: TxIn[], txIn: TxIn) => {
        //Makes sure the records txIn and txPoolIn match, if they are, return true
        //If there are any discrepencies, return false
        return _.find(txPoolIns, ((txPoolIn) => {
            return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
        }));
    };

    for (const txIn of tx.txIns) {
        if (containsTxIn(txPoolIns, txIn)) {
            //Returns false if the transaction is already in the pool
            console.log('txIn already found in the txPool');
            return false;
        }
    }
    //Returns true if no errors have been found
    return true;
};

export {addToTransactionPool, getTransactionPool, updateTransactionPool};

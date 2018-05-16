//to parse the server requests
import * as  bodyParser from 'body-parser';
//web framework
import * as express from 'express';
//js util
import * as _ from 'lodash';
//import methods from blockchain file
import {
    Block, generateNextBlock, generatenextBlockWithTransaction, generateRawNextBlock, getAccountBalance, mine,
    getBlockchain, getMyUnspentTransactionOutputs, getUnspentTxOuts, sendTransaction, simpleSend, simpleRecieve
} from './blockchain';
//import p2p methods
import {connectToPeers, getSockets, initP2PServer} from './p2p';
//import transaction methods
import {UnspentTxOut} from './transaction';
//import transaction pool methods
import {getTransactionPool} from './transactionPool';
//import wallet methods
import {getPublicFromWallet, initWallet, setupAccount} from './wallet';

//setup the http port to 3001
const httpPort: number = parseInt(process.env.HTTP_PORT) || 3001;
//setup the p2p port 6001
const p2pPort: number = parseInt(process.env.P2P_PORT) || 6001;

//init the http server with port 3001
const initHttpServer = (myHttpPort: number) => {
    //usee express as a web framework
    const app = express();
    //with json
    app.use(bodyParser.json());

    //use req and result
    app.use((err, req, res, next) => {
        //if theres an error return 400
        if (err) {
            res.status(400).send(err.message);
        }
    });


    //***
    // /setupAccoun?name=myName&root=0
    app.get('/mine/:name', (req,res) => {

        var name = req.params.name;
        const r = mine(name);
        res.send({'MinePoolLeft': r});
    });


    app.get('/setupAccount/:name', (req, res) =>  {

        var name = req.params.name;
        const r = setupAccount(name);
        res.send({'Account': r});
    });


    app.get('/sendTransaction/:name/:send/:amount', (req, res) => {

        var name = req.params.name;
        var send = req.params.send;
        var amount = req.params.amount;
        var r = simpleSend(name, send, amount);
        var s = simpleRecieve(name, send, amount);
        res.send({'Transaction': r});
    });

    //if /blocks then return the blockchain 
    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });

    //if /block:hash find the block with the designated hash
    app.get('/block/:hash', (req, res) => {
        const block = _.find(getBlockchain(), {'hash' : req.params.hash});
        res.send(block);
    });

    //if /transaction/:id find the transaction with the specified id
    app.get('/transaction/:id', (req, res) => {
        //convert blockchain into map so we can search by id
        const tx = _(getBlockchain())
            .map((blocks) => blocks.data)
            .flatten()
            .find({'id': req.params.id});
        res.send(tx);
    });

    //if /address/:address find the transactions associated with this address
    app.get('/address/:address', (req, res) => {
        const unspentTxOuts: UnspentTxOut[] =
            _.filter(getUnspentTxOuts(), (uTxO) => uTxO.address === req.params.address);
        res.send({'unspentTxOuts': unspentTxOuts});
    });

    //if /unspentTransactionOutputs then just return getUnspentTxOuts
    app.get('/unspentTransactionOutputs', (req, res) => {
        res.send(getUnspentTxOuts());
    });

    //if /unspentTransactionOutputs then get own transaction unspent outputs
    app.get('/myUnspentTransactionOutputs', (req, res) => {
        res.send(getMyUnspentTransactionOutputs());
    });

    //NEEDED permissions

    //if /mineRawBlock then try to mine a new raw block
    app.post('/mineRawBlock', (req, res) => {
        if (req.body.data == null) {
            res.send('data parameter is missing');
            return;
        }
        //generates next raw block and as long as not null send it
        const newBlock: Block = generateRawNextBlock(req.body.data);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        } else {
            res.send(newBlock);
        }
    });

    //if /mineBlock mines next block
    app.post('/mineBlock', (req, res) => {
        const newBlock: Block = generateNextBlock();
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        } else {
            res.send(newBlock);
        }
    });

    //if /balance return account balance
    app.get('/balance', (req, res) => {
        const balance: number = getAccountBalance();
        res.send({'balance': balance});
    });

    //if /address then return account address
    app.get('/address', (req, res) => {
        const address: string = getPublicFromWallet();
        res.send({'address': address});
    });

    //if /mineTransaction then generate new block with transaction and return it
    app.post('/mineTransaction', (req, res) => {
        const address = req.body.address;
        const amount = req.body.amount;
        try {
            //generate block with your address and the amount
            const resp = generatenextBlockWithTransaction(address, amount);
            res.send(resp);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });

    //if /sendTransaction then send transaction and return the proof
    app.post('/sendTransaction', (req, res) => {
        try {
            const address = req.body.address;
            const amount = req.body.amount;

            if (address === undefined || amount === undefined) {
                throw Error('invalid address or amount');
            }
            const resp = sendTransaction(address, amount);
            res.send(resp);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    });

    //if /transactionPool just return the transaction pool
    app.get('/transactionPool', (req, res) => {
        res.send(getTransactionPool());
    });

    //if /peers find all connected peers and return it
    app.get('/peers', (req, res) => {
        res.send(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    //if addPeers connects a new pper
    app.post('/addPeer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    //if /stop stops the server
    app.post('/stop', (req, res) => {
        res.send({'msg' : 'stopping server'});
        process.exit();
    });

    //setup the server and prints to console thats its working
    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};

//init the servers
initHttpServer(httpPort);
initP2PServer(p2pPort);
//init the wallet
initWallet();
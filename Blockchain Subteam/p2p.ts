import * as WebSocket from 'ws';
import {Server} from 'ws';
import { addBlockToChain, Block, getBlockchain, getLatestBlock, handleReceivedTransaction, isValidBlockStructure,
    replaceChain } from './blockchain';
import {Transaction} from './transaction';
import {getTransactionPool} from './transactionPool';

const sockets: WebSocket[] = [];
//Creates new empty websocket array named 'sockets'
//5 main message types used for the websocket
enum MessageType {
    QUERY_LATEST = 0,
    QUERY_ALL = 1,
    RESPONSE_BLOCKCHAIN = 2, // <--- Number used for enumeration of sockets array
    QUERY_TRANSACTION_POOL = 3, //Query transaction pool message
    RESPONSE_TRANSACTION_POOL = 4
}

class Message {
    public type: MessageType; //Declares public variable for message type
    public data: any; //Declares public variable any
}

const initP2PServer = (p2pPort: number) => { //Initializing p2p server
    const server: Server = new WebSocket.Server({port: p2pPort}); //Creates server 'WebSocket.server' and initializes p2p port
    server.on('connection', (ws: WebSocket) => {
        initConnection(ws); //Initializes connection for p2p server to websocket
    });
    console.log('listening websocket p2p port on: ' + p2pPort);
};

const getSockets = () => sockets;

const initConnection = (ws: WebSocket) => { //initializes connection to web socket
    sockets.push(ws);  //pushes web socket to sockets variable. Web Socket will allow for p2p transactions
    initMessageHandler(ws);//initialize message handler to web socket
    initErrorHandler(ws); //initialize error handler to web socket
    write(ws, queryChainLengthMsg());

    // query transactions pool only some time after chain query
    setTimeout(() => {
        broadcast(queryTransactionPoolMsg()); //broadcasts the transaction query pool message with timeout of 500
    }, 500);
};
//JavaScript Object Notation to transmit data objects
const JSONToObject = <T>(data: string): T => {
    try {
        return JSON.parse(data); //Return JSON transmit on parse of data objects
    } catch (e) {
        console.log(e); //outputs error code e to console log
        return null; //Return NULL if error is caught
    }
};
//Initializes message handler
//Tests for parse of JSON message
const initMessageHandler = (ws: WebSocket) => {
    ws.on('message', (data: string) => {

        try {
            const message: Message = JSONToObject<Message>(data);
            if (message === null) { //If JSON transmition of message data ==NULL
                console.log('could not parse received JSON message: ' + data);
                return; //Message could not be received, so return
            }
            //Converts error message from JSON to string, returns message to console log
            /*Creates transaction pool messages 'type' for the type of error, and stringify to Converts
            JSON data to string for second part of message.
            */
            console.log('Received message: %s', JSON.stringify(message));
            switch (message.type) {
                case MessageType.QUERY_LATEST: //Query the latest transaction
                    write(ws, responseLatestMsg()); //Corresponding error message, write to WebSocket (ws)
                    break;
                case MessageType.QUERY_ALL: //Message type query all
                    write(ws, responseChainMsg()); //Write reponse message to the WebScoket and chain
                    break;
                case MessageType.RESPONSE_BLOCKCHAIN: //Message type Block Chain
                    const receivedBlocks: Block[] = JSONToObject<Block[]>(message.data); //converts data of recieved blocks to JSON string of message.data
                    if (receivedBlocks === null) { //If received blocks are NULL
                        console.log('invalid blocks received: %s', JSON.stringify(message.data)); //Message outputs invalid number of blocks, uses JSON to stringify
                        break; //Breaks
                    }
                    handleBlockchainResponse(receivedBlocks); //Function call to handle blockchain response IF number of blocks received is valid
                    break;
                case MessageType.QUERY_TRANSACTION_POOL: //Message type QUERY Transaction Pool
                    write(ws, responseTransactionPoolMsg()); //Response for transaction pool message
                    break;
                case MessageType.RESPONSE_TRANSACTION_POOL:
                    const receivedTransactions: Transaction[] = JSONToObject<Transaction[]>(message.data); //Converts transactions to JSON object
                    if (receivedTransactions === null) { //No transactions received
                        console.log('invalid transaction received: %s', JSON.stringify(message.data)); //Reports invalid transactions
                        break;
                    }
                    //Function that handles each transaction made, if transaction can be handled, it is then broadcasted
                    receivedTransactions.forEach((transaction: Transaction) => {
                        try {
                            handleReceivedTransaction(transaction);
                            // if no error is thrown, transaction was indeed added to the pool
                            // let's broadcast transaction pool
                            broadCastTransactionPool(); //broadcasts transaction pool
                        } catch (e) { //Error catch for received transactions
                            console.log(e.message); //Report error message to the console log
                        }
                    });
                    break;
            }
        } catch (e) { //Error catch
            console.log(e); //Reports error to console log
        }
    });
};

//Function write, that allows data to be written to Web Socket using JSON stringify of message which is can also be data
const write = (ws: WebSocket, message: Message): void => ws.send(JSON.stringify(message));

//Broadcast function, broadcasts message for each socket within the previously instantiated 'sockets' WebSocket array
const broadcast = (message: Message): void => sockets.forEach((socket) => write(socket, message));

//QueryChain message length function, assigns message type and data value
const queryChainLengthMsg = (): Message => ({'type': MessageType.QUERY_LATEST, 'data': null});

//Query all message function that assigns message type and data value
const queryAllMsg = (): Message => ({'type': MessageType.QUERY_ALL, 'data': null});

//ReponseChainMsg provides message type and data type which is the JSON stringify transmition of getBlockChain
const responseChainMsg = (): Message => ({ 'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(getBlockchain())});

//Assigns type and JSON string transmition of get Lastest Block to the reponseLatestMessage
//Message reponse should be that of the latest block added to the chain
const responseLatestMsg = (): Message => ({'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify([getLatestBlock()])});

//Query Transaction pool message, assigns message type of query transaction enum, data type is null
const queryTransactionPoolMsg = (): Message => ({'type': MessageType.QUERY_TRANSACTION_POOL, 'data': null });

//Reponse transaction pool message, assigns message type responseTransactionPool, uses JSON to stringify the data value returned by getTransactionPool
const responseTransactionPoolMsg = (): Message => ({
    'type': MessageType.RESPONSE_TRANSACTION_POOL,
    'data': JSON.stringify(getTransactionPool())
});

//Initializes error handler to Websocket
const initErrorHandler = (ws: WebSocket) => {
    const closeConnection = (myWs: WebSocket) => { //closes connection to websocket if an error is detected
        console.log('connection failed to peer: ' + myWs.url); //Connection failed message sent to the log and websocket URL console
        sockets.splice(sockets.indexOf(myWs), 1); //Splices sockets, removes socket with faulty/error in connect from peer
    };
    ws.on('close', () => closeConnection(ws)); //Prints close message to close connection
    ws.on('error', () => closeConnection(ws)); //Prints error message to close connection
};

//Handles Blockchain response 
const handleBlockchainResponse = (receivedBlocks: Block[]) => {
    if (receivedBlocks.length === 0) { //if length of blocks equal zero
        console.log('received block chain size of 0'); //return that the block chain size is of zero
        return; //return since transaction can no longer be carried out 
    }
    //Latest block received function
    const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length - 1];
    if (!isValidBlockStructure(latestBlockReceived)) { //checks to see if received blocks are a valid block structure 
        console.log('block structuture not valid'); //returns block structure invalid message to the console log
        return;
    }
    const latestBlockHeld: Block = getLatestBlock(); //Determines what the latest block held is
    if (latestBlockReceived.index > latestBlockHeld.index) {
        console.log('blockchain possibly behind. We got: '
            + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index); //Determines if there is a discrepancy between blocks sent/received during 
            //transaction 
        if (latestBlockHeld.hash === latestBlockReceived.previousHash) { //Recent hash is equal to last received hash, confirms successful transaction
            if (addBlockToChain(latestBlockReceived)) { //If addition of latest block is successful
                broadcast(responseLatestMsg()); //Broadcast reponse message for successful transaction
            }
        } else if (receivedBlocks.length === 1) {  //Length of block chain is only 1
            console.log('We have to query the chain from our peer');  //Chain must be queried, so message is sent to console
            broadcast(queryAllMsg()); //Broadcasts the query message to user
        } else {
            console.log('Received blockchain is longer than current blockchain'); //Received block chain is longer
            replaceChain(receivedBlocks); //Replace the original chain with the received blocks 
        }
    } else { //Otherwise, chain is not longer than the received chain, so do nothing to prevent invalid transaction
        console.log('received blockchain is not longer than received blockchain. Do nothing'); //Prints message to console log
    }
};
//Broadcasts the latest query message to to the getSockets
const broadcastLatest = (): void => {
    broadcast(responseLatestMsg());
};
//Connect to peers, opens new websocket connection, initializes the connection to peer
const connectToPeers = (newPeer: string): void => {
    const ws: WebSocket = new WebSocket(newPeer); //New websocket with newPeer to complete transaction with 
    ws.on('open', () => { //Prints open to console, and initializes connection 
        initConnection(ws);
    });
    ws.on('error', () => { //Error connection failed
        console.log('connection failed'); //Prints connection failed message to the console 
    });
};
//Broadcasts transaction pool query to the broadcast function, response transaction pool message results 
const broadCastTransactionPool = () => {
    broadcast(responseTransactionPoolMsg());
};

export {connectToPeers, broadcastLatest, broadCastTransactionPool, initP2PServer, getSockets};

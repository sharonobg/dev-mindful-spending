import {MongoClient}from 'mongodb';
declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI){
    throw new Error(
        'Invalid/Missing env variable:"MONGODB_URI"'
    );
}
const uri = MONGODB_URI;
const options = {};

let client : MongoClient;
let clientPromise: Promise<MongoClient>;
const environment = process.env.ENVIRONMENT;
if (environment === 'development') {
    //dev mode use a global variable so val is preserved caused by HMR(Hot Module Replacement)
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    //produciton - dont use global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}
//export module-scoped MongoClient promise/ can be share across functions
export default clientPromise;
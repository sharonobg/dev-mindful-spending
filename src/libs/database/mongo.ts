import mongoose from "mongoose";

async function connect() {
const MONGODB_URI = process.env.MONGODB_URI;
//const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI){throw new Error('Please define a MONGODB_URI')}
let cached = (global as any)._prommongoClientPromise;
if(!cached){
    cached = (global as any).mongoose = {conn:null, promise: null};
}
    if(cached.conn){return cached.conn;}
    if(!cached.promise){
        const opts = {bufferCommands: false,};
        cached.promise = (mongoose as any).connect(MONGODB_URI,opts).then(
(mongoose:any) => {
     mongoose
});
    }
    cached.conn = await cached.promise;
    console.log('cached.conn',cached.conn)
    return (await cached).conn;
}
export default connect;

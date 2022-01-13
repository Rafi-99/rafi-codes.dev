import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let connected = false;

export const getConnection = async () => {
    if (process.env.NODE_ENV === 'development') {
        if (!global.cached_connection) {
            global.cached_connection = await client.connect();
        }
        return global.cached_connection;
    }
    else {
        if (!connected) {
            await client.connect();
            connected = true;
        }
        return client;
    }
};
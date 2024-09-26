const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const dbName = 'stepInstyle';

async function connectDb() {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Kết nối thành công');
    return client.db(dbName);
}

module.exports = connectDb;
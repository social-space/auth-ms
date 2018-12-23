const MongoClient = require('mongodb').MongoClient;
const config = require('config');

const client = new MongoClient(config.get('db.uri'));

let db = null;

module.exports = {
    connect: async function () {
        if(!db) {
            return new Promise((resolve, reject) => {
                client.connect(function(err) {
                    if(err) { reject(err); }
                    console.log("Connected successfully to server");

                    db = client.db();
                    resolve(db);
                });
            })
        } else {
            return db
        }
    }
}
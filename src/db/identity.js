const UUID = require('uuid/v4');

module.exports = {
    lookupIdentityById: async function (id) {
        const db = await require('../components/db').connect();

        return await db.collection('identity').findOne({
            id: id
        });
    },
    lookupIdentityByExternalId: async function (id) {
        const db = await require('../components/db').connect();
        let externalAuth = await db.collection('external_auths').findOne({
            id: id
        });
        console.log(externalAuth)
        if(!externalAuth) { return null; }
        return this.lookupIdentityById(externalAuth.identity_id);
    },
    createIdentityByExternalId: async function (id) {
        const db = await require('../components/db').connect();
        let identity;
        let newId;
        do {
            newId = UUID();
            identity = await this.lookupIdentityById(newId)
        } while (identity);

        // TODO: Probably should use this - rushing right now. http://mongodb.github.io/node-mongodb-native/3.1/tutorials/aggregation/
        console.log("Inserting identity")
        await db.collection('identity').insertOne({
            id: newId
        });
        console.log("Inserting external auth")
        await db.collection('external_auths').insertOne({
            identity_id: newId,
            id: id
        })

        return await this.lookupIdentityById(newId)
    }
}
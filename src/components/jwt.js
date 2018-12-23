const jwt = require('jsonwebtoken');
const config = require('config');
const algorithm = 'ES512';
const fs = require('fs');
const privateKey = config.get('keys.jwt.private');
const publicKey = config.get('keys.jwt.public');

module.exports = {
    privateKey: privateKey,
    publicKey: publicKey,

    algorithm: algorithm,
    verify: function (payload) {
        return new Promise((resolve, reject) => {
            jwt.verify(payload, publicKey, {
                algorithms:[algorithm]
            }, function (err, decoded) {
                if(err) {reject(err); return;}
                resolve(decoded)
            })
        })
    },
    encode: function (payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, privateKey, {
                algorithm,
                expiresIn: '1d'
            }, function (err, token) {
                if(err) {reject(err); return;}
                resolve(token)
            })
        })
    }
}
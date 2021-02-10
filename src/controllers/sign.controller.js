const signCtrl = {};

// Models
const crypto = require('crypto');
const fs = require('fs');



signCtrl.createKey = crypto.generateKeyPair('rsa',
  {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'top secret'
    }
  },
  (error, publicKey, privateKey) => {
    if (error) {
      throw error;
    }
    console.log("PublicKey  : " + publicKey);
    console.log("PrivateKey  : " + privateKey);
  });

module.exports = tagsCtrl;

const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

//Generates a new random private key each time
const privateKey = secp.utils.randomPrivateKey();

console.log('Private Key: ', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('PUblic Key: ', toHex(publicKey));

const keccakKey = keccak256(publicKey.slice(1));

console.log('Keccak Hash Public Key: ', toHex(keccakKey.slice(12)));

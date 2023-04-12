const secp = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

function getAddress(publicKey) {
  const pubKey = publicKey.slice(1);
  const hash = keccak256(pubKey);
  const address = hash.slice(-20);

  return address;
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

async function recoverKey(msgHash, signature, recoveryBit) {
  const publicKey = await secp.recoverPublicKey(msgHash, signature, recoveryBit);
  return publicKey;
}

//Generates a new random private key each time
(async () => {
  const privateKey = secp.utils.randomPrivateKey();

  console.log('Private Key:', toHex(privateKey));

  const publicKey = secp.getPublicKey(privateKey);

  console.log('Public Key:', toHex(publicKey));

  const address = getAddress(publicKey);

  console.log('Address:', toHex(address));

  const message = "I have no idea what I'm doing";

  const msgHash = hashMessage(message);

  const [signature, recoveryBit] = await secp.sign(msgHash, privateKey, { recovered: true });

  console.log('Hex Signature', toHex(signature));

  console.log('Byte Signature', signature);

  const isSigned = secp.verify(signature, msgHash, publicKey);

  console.log('isSigned:', isSigned);

  const recoveredKey = await recoverKey(msgHash, signature, recoveryBit);

  console.log('Recovered Public Key:', toHex(recoveredKey));

  console.log('Matching Public Keys:', toHex(publicKey) === toHex(recoveredKey));
})();

module.exports = { getAddress, hashMessage, recoverKey };

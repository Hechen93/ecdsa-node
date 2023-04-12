import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes, hexToBytes, bytesToHex, toHex } from 'ethereum-cryptography/utils';

export const addressToPrivateKey = {
  cd69181f0367794ed5ccd1fa6e3e762910a3c0b2: 'cba4eebbf2827b0816286b4ab0bf279894f59b7885252b738e6972a6048d0391',
  '9eb11dc561824b234c2b38b67b89b95aba5edb1d': 'ada9de4583a8d3aa45e1110ef3c35244c3156bff9c5e855fe1d0d2d6306d5eff',
  '003eec340a976332a81b4320b5c651a8e08dee5e': '3144db60c4df8831cad725a5e9e89f3d6d011e68c6aca59ca6fda22b5c89d879',
};

export function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

export async function signTx(hashMsg, address) {
  if (!addressToPrivateKey[address]) {
    throw new Error('Private key not found');
  }
  const privateKey = addressToPrivateKey[address];

  try {
    const [signature, recoveryBit] = await secp.sign(hashMsg, hexToBytes(privateKey), { recovered: true });
    return [bytesToHex(signature), recoveryBit, bytesToHex(hashMsg)];
  } catch (ex) {
    throw new Error('Failed to sign transaction');
  }
}

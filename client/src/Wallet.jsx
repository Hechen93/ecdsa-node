import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import * as keccak256 from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    //const publicKey = secp.getPublicKey(privateKey);
    //const keccakKey = keccak256(publicKey.slice(1));
    const address = toHex(secp.getPublicKey(privateKey));
    setAddress(address);
    //const address = toHex(keccak256(secp.getPublicKey(privateKey).slice(1)).slice(12));
    console.log(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address - will use to look up private key client side
        <input placeholder="Enter Address: " value={privateKey} onChange={onChange}></input>
      </label>
      <div>Public Key: {address.slice(0, 10)}...</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

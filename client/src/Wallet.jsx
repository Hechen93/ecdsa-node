import server from './server';
import { useEffect } from 'react';
import * as secp from 'ethereum-cryptography/secp256k1';
import * as keccak256 from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance }) {
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function fetchBalance() {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  useEffect(() => {
    if (address) {
      fetchBalance();
    }
  }, [address]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address - Enter an address
        <input placeholder="Enter Address: " value={address} onChange={setValue(setAddress)}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

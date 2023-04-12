import { useState } from 'react';
import server from './server';
import { hashMessage, signTx } from './util';

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!sendAmount || !recipient) return;

    try {
      const transaction = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      };

      const hashMsg = hashMessage(JSON.stringify(transaction));
      const [signature, recoveryBit, hashMsgString] = await signTx(hashMsg, address);

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        recoveryBit,
        msgHash: hashMsgString,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)}></input>
      </label>

      <label>
        Recipient's Address
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { getAddress } = require('./scripts/generate'); //generates new private key and signatures each time
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex, hexToBytes, utf8ToBytes } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

//These are now addresses
const balances = {
  cd69181f0367794ed5ccd1fa6e3e762910a3c0b2: 100,
  '9eb11dc561824b234c2b38b67b89b95aba5edb1d': 50,
  '003eec340a976332a81b4320b5c651a8e08dee5e': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

/*TODO: Get a signature from the client-side application
 Recover the public address from the signature*/

app.post('/send', (req, res) => {
  const { sender, recipient, amount, signature, msgHash, recoveryBit } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  //Server generated signature, looking for address
  const publicKey = secp.recoverPublicKey(hexToBytes(msgHash), signature, recoveryBit);

  const address = getAddress(publicKey);

  const validPublicKey = toHex(address) === sender;

  if (!validPublicKey) {
    return res.status(400).send({ message: 'Sender and signature do not match.' });
  }

  const verifiedSig = secp.verify(signature, hexToBytes(msgHash), publicKey);

  if (!verifiedSig) {
    return res.status.send(400).send({ message: 'Signature not valid' });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

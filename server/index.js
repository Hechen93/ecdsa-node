const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

//These need to be addresses
//How to generate addresses:
// 1. Slice off first byte of public key
// 2. Hash result of step 1 using keccak256
// 3. slice off the first 12 bytes of the keccak key hash == ethereum address
const balances = {
  '040a6b4d495c905d464383cbb3291d624185528667d53390c2ef63b82d6e30d47ab9fe542b23516a30af4a4093cdadad36a41a6108c14776d67c991d784b42a8e5': 100,
  '0de43f0fa1bb045434df4408522daae4d716f896': 50,
  '0183d2de422100fb08015c018d55fc0c14420b7e': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

/*TODO: Get a signature from the client-side application
 Recover the public address from the signature*/

app.post('/send', (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

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

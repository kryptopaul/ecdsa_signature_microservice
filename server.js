import Web3 from "web3";
import express from "express";
const app = express();
import { Network, Alchemy } from "alchemy-sdk";
import "dotenv/config";

const web3 = new Web3();

const port = 80;

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const milady = "0x5af0d9827e0c53e4799bb226655a1de152a425a5";
const thePolacy = "0x99903e8ec87b9987bd6289df8eff178d6e533561";

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

app.use(express.json());

async function generateSig(address) {
  const hasThePolacy = await alchemy.nft.verifyNftOwnership(address, thePolacy);
  const hasMilady = await alchemy.nft.verifyNftOwnership(address, milady);

  console.log(hasThePolacy);
  console.log(hasMilady);

  if (!hasThePolacy && !hasMilady) {
    return "Not a fren";
  }

  const a = web3.eth.abi.encodeParameter("address", address);

  const b = web3.utils.keccak256(a);

  const c = web3.eth.accounts.sign(b, PRIVATE_KEY);
  console.log(c.signature);
  return c.signature;
}

app.listen(port, () => {
  console.log(`Gówno listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("dupa");
});

app.get("/sig", async (req, res) => {
  try {
    const { address } = req.body;
    const sig = await generateSig(address);
    res.send({ sig });
  } catch (error) {
    res.status(500).send({ error: "something went wrong xD" });
  }
});

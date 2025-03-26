const { ethers } = require("hardhat");
const fs = require("fs");

const example1 = {
  id: "example-1",
  name: "Guy 1",
  description: "Description of guy 1",
  imageURI: "/characters/example-1.png",
  maxSupply: 101,
};

const example2 = {
  id: "example-2",
  name: "Girl 2",
  description: "Description of girl 2",
  imageURI: "/characters/example-2.png",
  maxSupply: 20,
};

const example3 = {
  id: "example-3",
  name: "Guy 3",
  description: "Description of guy 3",
  imageURI: "/characters/example-3.png",
  maxSupply: 10,
};

const example4 = {
  id: "example-4",
  name: "Legendary Guy 4",
  description: "Description of the legendary guy 4",
  imageURI: "/characters/example-4.png",
  maxSupply: 1,
};

async function craftCard(tradingCardNFT, payload) {
  const tx = await tradingCardNFT.registerCard(
    payload.id,
    payload.name,
    payload.description,
    payload.imageURI,
    payload.maxSupply
  );
  await tx.wait();
}

async function main() {
  const TradingCardNFT = await ethers.getContractFactory("TradingCardNFT");
  const tradingCardNFT = await TradingCardNFT.deploy("HockerCollection");

  await tradingCardNFT.waitForDeployment();

  await craftCard(tradingCardNFT, example1);
  await craftCard(tradingCardNFT, example2);
  await craftCard(tradingCardNFT, example3);
  await craftCard(tradingCardNFT, example4);

  console.log("Deployed to: ", tradingCardNFT.target);

  const contractAddress = tradingCardNFT.target;
  const contractABI = JSON.parse(
    fs.readFileSync(
      "./artifacts/contracts/tradingCardNFT.sol/TradingCardNFT.json",
      "utf8"
    )
  ).abi;

  fs.writeFileSync(
    "../frontend/config.json",
    JSON.stringify({ contractAddress, contractABI }, null, 2)
  );
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

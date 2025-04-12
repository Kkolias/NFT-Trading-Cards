const { ethers } = require("hardhat");
const fs = require("fs");

const example1 = {
  id: "burbaloni-luliloli",
  name: "Burbaloni Luliloli",
  description: "Burr baloni luli loli, capibarello cocossini, it is very rarely seen on the coasts of Bali, a unique coconut of its kind, which contains a capybara inside, it is such a rare event, that the locals gather around a bonfire, to celebrate the arrival of the capybara-coconut god",
  imageURI: "/characters/burbaloni.png",
  maxSupply: 101,
};

const example2 = {
  id: "bombardino-crocodillo",
  name: "Bombardino Crocodillo",
  description: "Bombardillo Crocodile, a fucking flying alligator, who flies and bombs children in Gaza, and Palestine. He doesn’t believe in Allah and he loves bombs. He feeds on the spirit of your mother.",
  imageURI: "/characters/bombardirocrocodilo.png",
  maxSupply: 20,
};

const example3 = {
  id: "lirili-larila",
  name: "Lirilì Larilà",
  description: "Lirilí Larilà, an elephant in the desert, who walks here and there with his shell and his ticking clock, cactus' spines give me a flashback.",
  imageURI: "/characters/lirilirilirali.png",
  maxSupply: 10,
};

const example4 = {
  id: "tralalero-tralala",
  name: "Tralalero Tralala",
  description: "Tralalelo Tralala is a one-of-a-kind shark with three legs—two replacing its side fins and a third at the end of its tail.",
  imageURI: "/characters/tralalerotralala.png",
  maxSupply: 1,
};

const example5 = {
  id: "cocosatic-bungus",
  name: "Cocosatic Bungus",
  description: "Cocosatic Bungus is an exotic creature that inhabits tropical forests and beaches. At first glance, it resembles a mix between a cheerful parrot and a fluffy bear, but its most outstanding feature is the giant coconut attached to its back, which serves as its home.",
  imageURI: "/characters/cocosaticbungus.png",
  maxSupply: 101,
};

const example6 = {
  id: "bri-bri-bicus-dicus",
  name: "Bri Bri Bicus Dicus",
  description: "Bri Bri Bricus Dicus is a grumpy Roman centurion... who just so happens to be a bird.",
  imageURI: "/characters/bribribricusdicus.png",
  maxSupply: 101,
};

const example7 = {
  id: "tung-tung-tung-sahur",
  name: "Tung tung tung sahur",
  description: "Tung Tung Tung Sahur is a terrifying anomaly in the form of a night patrol drum. Legend has it that if you call its name three times and it doesn’t respond, it will appear and haunt you.",
  imageURI: "/characters/tungtungtungsahur.png",
  maxSupply: 10,
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
  await craftCard(tradingCardNFT, example5);
  await craftCard(tradingCardNFT, example6);
  await craftCard(tradingCardNFT, example7);

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

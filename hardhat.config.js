/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./src/artifacts"
  }
};

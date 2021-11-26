const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

require("dotenv").config();

const infuraKey = process.env.INFURA_API_KEY || "";
const mnemonic = process.env.mnemonic || "";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: `https://rinkeby.infura.io/v3/${infuraKey}`,
          addressIndex: 0,
          numberOfAddresses: 50,
        }),
      network_id: 4, // Rinkeby's id
    }
  },
  compilers: {
    solc: {
      version: "0.8.9",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  mocha: {
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency : "USD"
    }
  }
};

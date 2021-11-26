var CommonStructs = artifacts.require("./CommonStructs.sol");
var Instructions = artifacts.require("./Instructions.sol");
var InstructionsProvider = artifacts.require("./InstructionsProvider.sol");
var Deals = artifacts.require("./Deals.sol");
var Interpreter = artifacts.require("./Interpreter.sol");
var Proxy = artifacts.require("./Proxy.sol");

module.exports = async function(deployer) {

  // Deploy contracts
  await deployer.deploy(CommonStructs);
  await deployer.deploy(Interpreter);
  await deployer.deploy(Instructions);
  await deployer.deploy(InstructionsProvider,"0x0000000000000000000000000000000000000000");
  await deployer.deploy(Deals);
  await deployer.deploy(Proxy,25, 25, 100, 50, 1, 230000000000000);

  // Get an instance to the deployed contracts
  const instructions = await Instructions.deployed();
  const instructionsProvider = await InstructionsProvider.deployed();
  const deals = await Deals.deployed();
  const interpreter = await Interpreter.deployed();
  const proxy = await Proxy.deployed();

  // Set links between contracts
  await deals.setProxyContractAddress(proxy.address);
  await instructionsProvider.setInterpreterContractRef(interpreter.address);
  await instructionsProvider.setProxyInstanceRef(proxy.address);
  await interpreter.setInstructionsInstance(instructions.address);
  await interpreter.setInstructionsProviderInstance(instructionsProvider.address);
  await interpreter.setDealsInstance(deals.address);
  await interpreter.setProxyContractAddress(proxy.address);
  await proxy.pause();
  await proxy.setInstructionsContractRef(instructions.address);
  await proxy.setInstructionsProviderContractRef(instructionsProvider.address);
  await proxy.setDealsContractRef(deals.address);
  await proxy.setInterpreterContractRef(interpreter.address);
  await proxy.unpause();

  // Load instructions
  await instructions.addInstruction("IF-ADDR", "1", "_ifAddress(address,address)");
  await instructions.addInstruction("TRANSFER", "2", "_transfer(address)");

  // Set ChainLink ETH/USD price feed aggregator address
  await proxy.setPriceFeedRefAggregatorAddress("0x8A753747A1Fa494EC906cE90E9f37563A8AF630e");
};

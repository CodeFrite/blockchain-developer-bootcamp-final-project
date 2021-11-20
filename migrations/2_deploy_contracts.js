var CommonStructs = artifacts.require("./CommonStructs.sol");
var Instructions = artifacts.require("./Instructions.sol");
var InstructionsProvider = artifacts.require("./InstructionsProvider.sol");
var Deals = artifacts.require("./Deals.sol");
var Interpreter = artifacts.require("./Interpreter.sol");
//var Proxy = artifacts.require("./Proxy.sol");

module.exports = async function(deployer) {
  // Deploy contracts
  await deployer.deploy(CommonStructs);
  await deployer.deploy(Interpreter);
  await deployer.deploy(Instructions);
  await deployer.deploy(InstructionsProvider, Interpreter.address);
  await deployer.deploy(Deals);
//  await deployer.deploy(Proxy);
  
  // Get an instance to the deployed contracts
  const instanceInstructions = await Instructions.deployed();
  const instanceInstructionsProvider = await InstructionsProvider.deployed();
  const deals = await Deals.deployed();
  const interpreter = await Interpreter.deployed();
//  const proxy = await Proxy.deployed();
  
  // Set references between contracts
  await interpreter.setInstructionsInstance(instanceInstructions.address);
  await interpreter.setInstructionsProviderInstance(instanceInstructionsProvider.address);
  await interpreter.setDealsInstance(deals.address);
//  await proxy.setClausesContract(clauses.address);
//  await proxy.setDealsContract(deals.address);
//  await proxy.setInterpreterContract(interpreter.address);

};

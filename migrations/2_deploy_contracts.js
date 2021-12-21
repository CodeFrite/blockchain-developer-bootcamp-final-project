var CommonStructs = artifacts.require("./CommonStructs.sol");
var Instructions = artifacts.require("./Instructions.sol");
var InstructionsProvider = artifacts.require("./InstructionsProvider.sol");
var Deals = artifacts.require("./Deals.sol");
var Interpreter = artifacts.require("./Interpreter.sol");
var Proxy = artifacts.require("./Proxy.sol");

// Get parameters from the Truffle cmd line
const argv = require('minimist')(process.argv.slice(2), {string: ['upgrade']});

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

module.exports = async function(deployer) {
  
  // Are we upgrading the DApp ?

  // No argument given in truffle migrate command: undefined => deploy & link all
  if (argv['upgrade']===undefined) {
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
    await proxy.setPriceFeedRefAggregatorAddress("0x8A753747A1Fa494EC906cE90E9f37563A8AF630e");
    await proxy.unpause();
  
    // Load instructions
    await instructions.addInstruction("IF-ADDR", "1", "_ifAddress(address,address)");
    await instructions.addInstruction("TRANSFER", "2", "_transfer(address)");

  // ... upgrade 'minor' = redeploy InstructionsProvider
  } else if (argv['upgrade']==="minor") {

    const interpreter = await Interpreter.deployed();
    const proxy = await Proxy.deployed();

    // Step 1: Get the old InstructionsProvider instance
    const old_instructionsProvider = await InstructionsProvider.deployed();
    console.log("Getting old InstructionsProvider instance:", old_instructionsProvider.address);

    // Step 2: Deploy the new InstructionsProvider contract
    await deployer.deploy(InstructionsProvider,"0x0000000000000000000000000000000000000000");
    const new_instructionsProvider = await InstructionsProvider.deployed();
    console.log("Deploying new InstructionsProvider instance:", new_instructionsProvider.address);

    // Step 3: Pause DApp
    console.log("Pausing DApp ...")
    try {
      await proxy.pause();
    } catch {
      console.log("... DApp already paused");
    }

    // Step 4: Get Escrow address 
    const escrowAddress = await old_instructionsProvider.escrowInstance();
    console.log("Escrow address:", escrowAddress);

    // Step 5: Transfer Escrow ownership
    console.log("Transfering Escrow ownership from", old_instructionsProvider.address, "to", new_instructionsProvider.address);
    old_instructionsProvider.transferEscrow(new_instructionsProvider.address);

    // Step 6: Link contracts
    console.log("Linking", new_instructionsProvider.address, "(new InstructionsProvider) =>", interpreter.address, "(Interpreter)");
    await new_instructionsProvider.setInterpreterContractRef(interpreter.address);
    console.log("Linking", new_instructionsProvider.address, "(new InstructionsProvider) =>", proxy.address, "(Proxy)");
    await new_instructionsProvider.setProxyInstanceRef(proxy.address);
    console.log("Linking", new_instructionsProvider.address, "(new InstructionsProvider) =>", escrowAddress, "(Escrow)");
    await new_instructionsProvider.setEscrowContractRef(escrowAddress);
    console.log("Linking", interpreter.address, "(Interpreter) =>", new_instructionsProvider.address, "(new InstructionsProvider)");
    await interpreter.setInstructionsProviderInstance(new_instructionsProvider.address);
    console.log("Linking", proxy.address, "(Proxy) =>", new_instructionsProvider.address, "(new InstructionsProvider)");
    await proxy.setInstructionsProviderContractRef(new_instructionsProvider.address);

    // Step 7: Unpause contract
    console.log("... Unpausing DApp")
    await proxy.unpause();

    console.log("> InstructionsProvider upgrade ok");

  // ... upgrade 'major' = redeploy InstructionsProvider & Interpreter
  } else if (argv['upgrade']==="major") {

    const deals = await Deals.deployed();
    const instructions = await Instructions.deployed();
    const interpreter = await Interpreter.deployed();
    const proxy = await Proxy.deployed();

    // Step 1: Get the old InstructionsProvider instance
    const old_instructionsProvider = await InstructionsProvider.deployed();
    console.log("Getting old InstructionsProvider instance:", old_instructionsProvider.address);

    // Step 2: Deploy the new InstructionsProvider contract
    await deployer.deploy(InstructionsProvider,"0x0000000000000000000000000000000000000000");
    const new_instructionsProvider = await InstructionsProvider.deployed();
    console.log("Deploying new InstructionsProvider instance:", new_instructionsProvider.address);

    // Step 3: Deploy the new Interpreter contract
    await deployer.deploy(Interpreter);
    const new_interpreter = await Interpreter.deployed();
    console.log("Deploying new Interpreter instance:", new_interpreter.address);

    // Step 4: Pause DApp
    console.log("Pausing DApp ...")
    try {
        await proxy.pause();
    } catch {
      console.log("... DApp already paused");
    }

    // Step 5: Get Escrow address 
    const escrowAddress = await old_instructionsProvider.escrowInstance();
    console.log("Escrow address:", escrowAddress);

    // Step 6: Transfer Escrow ownership
    console.log("Transfering Escrow ownership from", old_instructionsProvider.address, "to", new_instructionsProvider.address);
    old_instructionsProvider.transferEscrow(new_instructionsProvider.address);

    // Step 7: Link contracts
    console.log("Linking", new_interpreter.address, "(new Interpreter) =>", deals.address, "(Deals)");
    await new_interpreter.setDealsInstance(deals.address);
    console.log("Linking", new_interpreter.address, "(new Interpreter) =>", instructions.address, "(Instructions)");
    await new_interpreter.setInstructionsInstance(instructions.address);
    console.log("Linking", new_interpreter.address, "(new Interpreter) =>", new_instructionsProvider.address, "(new InstructionsProvider)");
    await new_interpreter.setInstructionsProviderInstance(new_instructionsProvider.address);
    console.log("Linking", new_interpreter.address, "(new Interpreter) =>", proxy.address, "(Proxy)");
    await new_interpreter.setProxyContractAddress(proxy.address);

    console.log("Linking", new_instructionsProvider.address, "(new InstructionsProvider) =>", new_interpreter.address, "(new Interpreter)");
    await new_instructionsProvider.setInterpreterContractRef(new_interpreter.address);
    console.log("Linking", new_instructionsProvider.address, "(new InstructionsProvider) =>", proxy.address, "(Proxy)");
    await new_instructionsProvider.setProxyInstanceRef(proxy.address);
    console.log("Linking", new_instructionsProvider.address, "(new InstructionsProvider) =>", escrowAddress, "(Escrow)");
    await new_instructionsProvider.setEscrowContractRef(escrowAddress);

    console.log("Linking", proxy.address, "(Proxy) =>", new_interpreter.address, "(new Interpreter)");
    await proxy.setInterpreterContractRef(new_interpreter.address);
    console.log("Linking", proxy.address, "(Proxy) =>", new_instructionsProvider.address, "(new InstructionsProvider)");
    await proxy.setInstructionsProviderContractRef(new_instructionsProvider.address);

    // Step 7: Unpause contract
    console.log("... Unpausing DApp")
    await proxy.unpause();

    console.log("> Interpreter update successfull");
  }
};

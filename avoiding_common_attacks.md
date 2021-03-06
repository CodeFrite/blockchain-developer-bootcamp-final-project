# Avoiding common attacks

## SWC-101 - Integer Overflow and Underflow [link](https://swcregistry.io/docs/SWC-101)

All the contracts are compiled with solidity compiler version '0.8.9'. No need to take special measures like using safemath.
[link](https://docs.soliditylang.org/en/v0.8.9/080-breaking-changes.html?highlight=underflow)

## SWC-103 - Floating Pragma [link](https://swcregistry.io/docs/SWC-103)

All the contracts are compiled with solidity compiler version '0.8.9' exact version.

```
pragma solidity 0.8.9;
```

## SWC-104 - Unchecked Call Return Value [link](https://swcregistry.io/docs/SWC-104)

I make an extensive use of low level calls. Whenever I do, I make sure to check the result of the call.

```
function depositsOf() public returns (uint) {
  // Upgrability: Low level call to InstructionsProvider
  (bool success, bytes memory _result) = instructionsProviderContractRef.call(
    abi.encodeWithSignature(
    "depositsOf(address)",
    msg.sender)
  );
  require(success,"Proxy: Unable to get the deposit of caller!");
}
```

## SWC-111 Use of Deprecated Solidity Functions [link](https://swcregistry.io/docs/SWC-111)

In my code, I use revert instead of throw.

```
/**
* @dev Block OpenZeppelin Ownable.renounceOwnership
*/ 
function renounceOwnership() public pure override {
  revert('Contract cannot be revoked');
}
````

## SWC-115 - Authorization through tx.origin [link](https://swcregistry.io/docs/SWC-115)

msg.sender is always used in place of tx.origin through the code. For example, when withdrawing ETH from Escrow:

```
/**
* @dev Withdraw all deposit from escrow for msg.sender
*/
function withdraw() external whenNotPaused returns(bool) {
  (bool success,) = instructionsProviderContractRef.call(
    abi.encodeWithSignature(
      "withdraw(address)",
      msg.sender
    )
  );
  return success;
}
```
## SWC-119 - Shadowing State Variables [link](https://swcregistry.io/docs/SWC-119)

In order to avoid shadowing state variable, I always prepend my functions parameters and (when needed) my local variables with an underscore:

```
contract Deals is Ownable {
...
  uint dealId = 0;
...
  function getAccountsCount(uint _dealId) public view returns(uint) {
    return accountsCount[_dealId];
  }
...
}
```

let BN = web3.utils.BN;
let CommonStructs = artifacts.require("CommonStructs");
const { getStruct, isDefined, isType } = require("./ast-helper");

contract("CommonStructs", function (accounts) {

  let instance;

  beforeEach(async () => {
    instance = await CommonStructs.new();
  });

  describe("Variables", () => {
    
    describe("enum InstructionTypes", () => {
      
      let enumState;

      before(() => {
        enumState = CommonStructs.enums.InstructionTypes;
        assert(
          enumState,
          "The contract should define an Enum called InstructionTypes"
        );
      });

      it("should define `VOID`", () => {
        assert(
          enumState.hasOwnProperty('VOID'),
          "The enum does not have a `VOID` value"
        );
      });

      it("should define `ADDRESS_ADDRESS_R_BOOL`", () => {
        assert(
          enumState.hasOwnProperty('ADDRESS_ADDRESS_R_BOOL'),
          "The enum does not have a `ADDRESS_ADDRESS_R_BOOL` value"
        );
      });

      it("should define `ADDRESS_PAYABLE`", () => {
        assert(
          enumState.hasOwnProperty('ADDRESS_PAYABLE'),
          "The enum does not have a `ADDRESS_PAYABLE` value"
        );
      });
    })

    describe("struct Article", () => {
      
      let articleStruct;

      before(() => {
        articleStruct = getStruct(CommonStructs, "CommonStructs", "Article");
        assert(
          articleStruct !== null, 
          "The contract should define an `Article` struct"
        );
      });

      it("should have a `instructionName` of type `string`", () => {
        assert(
          isDefined(articleStruct)("instructionName"), 
          "should have an `instructionName` member"
        );
        assert(
          isType(articleStruct)("instructionName")("string"), 
          "`instructionName` should be of type `string`"
        );
      });

      it("should have a `paramStr` of type `string`", () => {
        assert(
          isDefined(articleStruct)("paramStr"), 
          "should have a `paramStr` member"
        );
        assert(
          isType(articleStruct)("paramStr")("string"), 
          "`paramStr` should be of type `string`"
        );
      });

      it("should have a `paramUInt` of type `uint`", () => {
        assert(
          isDefined(articleStruct)("paramUInt"), 
          "should have a `paramUInt` member"
        );
        assert(
          isType(articleStruct)("paramUInt")("uint"), 
          "`paramUInt` should be of type `uint`"
        );
      });

      it("should have a `paramAddress` of type `address`", () => {
        assert(
          isDefined(articleStruct)("paramAddress"), 
          "should have a `paramAddress` member"
        );
        assert(
          isType(articleStruct)("paramAddress")("address"), 
          "`paramAddress` should be of type `address`"
        );
      });
    });
  });

});
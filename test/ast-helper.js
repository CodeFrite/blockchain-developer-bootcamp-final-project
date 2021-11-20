// Common ast-helper exports
// Contains the Article ABI definition export of the library CommonStructs
const CDTYPE = "ContractDefinition";

const contractDefn = (abi, _contractName) => abi.ast.nodes.find(n => n.nodeType === CDTYPE && n.name === _contractName);

const getStruct = (abi, _contractName,_structName) => {
  const item = contractDefn(abi,_contractName).nodes.find((n) => n.name === _structName);
  if (!item) return null;

  return item
    .members
    .map((t) => ({
    name: t.name,
    nodeType: t.nodeType,
    stateVariable: t.stateVariable,
    type: t.typeName.name,
    mutability: t.typeName.stateMutability,
  }));
};

const getMapping = (abi, _contractName, _mappingName) => {
  const item = contractDefn(abi, _contractName).nodes.find((n, _name) => n.name === _mappingName);
  if (!item) return null;
  return {
    name: item.name,
    type: item.typeDescriptions.typeString,
  };
};

const isDefined = members => variableName => {
  return members 
    ? members.find((item) => item.name === variableName) 
    : null;
};

const isPayable = members => variableName => {
  if (members === undefined) return false;
  const definition = members.find((item) => item.name === variableName);
  return definition && definition.mutability === "payable";
};

const isType = members => variableName => type => {
  if (members === undefined) return false;
  const definition = members.find((item) => item.name === variableName);
  return definition && definition.type === type;
};

module.exports = {
  getStruct,
  getMapping,
  isDefined,
  isPayable,
  isType,
};
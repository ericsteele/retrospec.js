/*
 * misc/ast-helper.js
 * https://github.com/ericsteele/retrospec.js
 *
 * Copyright (c) 2014 Eric Steele
 * Licensed under the MIT license.
 * https://github.com/ericsteele/retrospec.js/blob/master/LICENSE
 */
'use strict';

// export the ast-helper module
module.exports = {
  getCallExpressionArguments: getCallExpressionArguments,
  getNodeValue:               getNodeValue
};

/**
 * Extracts all arguments provided to the specified call expression node.
 * 
 * @param  {Object} node - the call expression node
 * 
 * @return {Array} An array containing the call expression's arguments.
 */
function getCallExpressionArguments(node) {
  var args = [];

  node.arguments.forEach(function(argNode) {
    args.push(getNodeValue(argNode));
  });

  return args;
}

/**
 * Extracts the underlying value of the provided node. If the node does not represent
 * an Array or Literal value, then returned value will be the node itself.
 * 
 * @param  {Object} node - the node to extract a value from
 * 
 * @return {Var} The underlying value of the provided node.
 */
function getNodeValue(node) {
  // validate arguments
  if(!node) throw new Error('invalid argument "node" = ' + node);

  // extract the node's value
  var value;
  switch(node.type) {
    case 'Literal': 
      value = node.value;
      break;
    case 'ArrayExpression':
      value = [];
      node.elements.forEach(function(elementNode) {
        var nodeValueRet = getNodeValue(elementNode);
        if (nodeValueRet)
          value.push(getNodeValue(elementNode));
      });
      break;
    case 'FunctionExpression':
      break;
    default:
      console.log('[warn] unexpected node type: ' + node.type);
      value = node;
  }

  return value;
}
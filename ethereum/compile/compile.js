const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

const buildPath = path.resolve(__dirname, '../build');
fs.removeSync(buildPath);

const sourcePath = path.resolve(__dirname, '../contract', 'CrowdFunding.sol');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiledSource = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in compiledSource) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        compiledSource[contract]
    );
}
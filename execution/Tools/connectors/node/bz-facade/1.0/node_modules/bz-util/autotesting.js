var fs = require('fs');
var path = require('path');

function isAutotestingEnable() {
    return fs.existsSync(path.join(__dirname, '../../../../autotesting/inputData.json')) &&
           fs.existsSync(path.join(__dirname, '../../../../autotesting/outputData.json')) &&
           fs.existsSync(path.join(__dirname, '../../../../autotesting/errorData.json'));
}

function getInputData() {
    var data = fs.readFileSync(path.join(__dirname, '../../../../autotesting/inputData.json'), 'utf8');
    return JSON.parse(data.toString('utf-8'));
}

function getOutputData() {
    var data = fs.readFileSync(path.join(__dirname, '../../../../autotesting/outputData.json'), 'utf8');
    return JSON.parse(data.toString('utf-8'));
}

function getErrorData() {
    var data = fs.readFileSync(path.join(__dirname, '../../../../autotesting/errorData.json'), 'utf8');
    return JSON.parse(data.toString('utf-8'));
}

exports.isAutotestingEnable = isAutotestingEnable;
exports.getInputData = getInputData;
exports.getOutputData = getOutputData;
exports.getErrorData = getErrorData;
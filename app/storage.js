"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

const _electron = require("electron");
const _path = require("path");
const _fs = require("fs");

const saveFileName = "state.dat";
const encData = false;

exports.getState = getState;
exports.saveState = saveState;
exports.appendState = appendState;

function getState(sessionID) {
    let encState = _fs.readFileSync(_path.join(__dirname, sessionID));
    let stateString = "";
    if(encData){
        stateString = _electron.safeStorage.decryptString(encState);
    }else{
        stateString = encState;
    }
    let stateObject;
    try{
        stateObject = JSON.parse(stateString);
    }catch(e){
        console.log(e);
        return {};
    };
    return stateObject;
}

function saveState(newState, sessionID) {
    if (typeof newState !== 'object' || newState === null) {
        return false;
    };

    let stateString = JSON.stringify(newState);
    let dataToSave;
    if(encData){
        let encAvailable = _electron.safeStorage.isEncryptionAvailable();
        if (encAvailable){
            dataToSave = _electron.safeStorage.encryptString(stateString);
        }else{
            console.log("encryption unavailable");
            //ToDo: Handle unsafe state storage
        };
    }else{
        dataToSave = stateString;
    };

    _fs.writeFile(_path.join(__dirname, sessionID), dataToSave, function (err, data) {
        if (err) {
            console.error(err);
            return;
        };
    });
};

function appendState(appendData, sessionID) {
    data = getState(sessionID);
    let parsed = null;
    try{
        parsed = JSON.parse(data);
    }catch(e){
        console.log("Failed to parse state");
        return;
    };
    parsed.push(appendData);
    saveState(parsed);
}
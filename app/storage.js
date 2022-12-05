"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

const _electron = require("electron");
const _path = require("path");
const _fs = require("fs");


class Storage{
    
    constructor(rootPath="storage", encryptData=false){
        this.rootPath = _path.join(__dirname+"/"+rootPath);
        this.encryptData = encryptData;
        this.sessionID = null;
        this.storageInit();
    }

    /**
     * Check if the root storage dir exists and create
     */
    storageInit(){
        if(!_fs.existsSync(this.rootPath)){
            console.log("[*][Storage] Root storage no exist, creating...");
            this.createDirectory(this.rootPath);
        }else{
            console.log("[*][Storage] Root storage path found"); 
        }
    }

    setSessionId(sessionID){
        if (sessionID === null){
            return;
        };
        this.sessionID = sessionID;
        if(!this.sessionExists()){
            this.createDirectory(this.rootPath+"/"+this.sessionID);
        };
    }

    /**
     * Create given directory path recursively
     */
    createDirectory(path){
        return _fs.mkdirSync(path, {recursive: true});
    }

    fileExists(filePath){
        return _fs.existsSync(filePath);
    }

    getPacketPath(packetId){
        return this.rootPath+"/"+this.sessionID+"/data_"+packetId+".data";
    }

    stringifyJson(data) {
        return JSON.stringify(data, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        );
    }

    appendData(data){
        let session = data.m_header.m_sessionUID;
        if(!this.sessionIsSet() || session !== this.sessionID){
            this.setSessionId(session);
        };
        let packetId = data.m_header.m_packetId;
        let packetFilePath = this.getPacketPath(packetId);
        let dataToWrite = null;
        if(typeof data === "object"){
            dataToWrite = this.stringifyJson(data);
        }else{
            dataToWrite = data;
        };
        if(dataToWrite !== null){
            //_fs.appendFileSync(packetFilePath, dataToWrite+"\n");
        };
    }

    saveData(data){
        let session = data.m_header.m_sessionUID;
        if(!this.sessionIsSet() || session !== this.sessionID){
            this.setSessionId(session);
        };
        let packetId = data.m_header.m_packetId;
        let packetFilePath = this.getPacketPath(packetId);
        let dataToWrite = null;
        if(typeof data === "object"){
            dataToWrite = this.stringifyJson(data);
        }else{
            dataToWrite = data;
        };
        if (dataToWrite !== null){
            _fs.writeFileSync(packetFilePath, dataToWrite);
        }
    }

    getMeta(){
        let metaPath = this.rootPath+"/meta.data";
        if(!this.fileExists(metaPath)){
            return {};
        };
        let data = {};
        let content = _fs.readFileSync(metaPath); 
        try{
            data = JSON.parse(content);
        }catch(e){
            console.error(e);
        };
        return data;
    }

    saveMeta(metaData){
        let metaPath = this.rootPath+"/meta.data";
        if(typeof metaData !== "object" || metaData === null){
            return;
        }
        let dataToWrite = this.stringifyJson(metaData);
        _fs.writeFileSync(metaPath, dataToWrite); 
    }

    sessionIsSet(){
        if(this.sessionID === null){
            return false
        }
        return true;
    }

    /**
     * Check if session directory exists
     */
    sessionExists(){
        if(this.sessionIsSet()){
            let path = this.rootPath+"/"+this.sessionID;
            return _fs.existsSync(path);
        }else{
            return false;
        };
    }
}

module.exports.Storage = Storage;
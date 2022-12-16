"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.init = init;
exports.setWindowVisible = setWindowVisible;

const _electron = require("electron");
const _path = require("path");
const f1_2021_udp_1 = require("f1-2021-udp");
var client = new f1_2021_udp_1.F1TelemetryClient();

const DEFAULT_WIDTH = 1070;
const DEFAULT_HEIGHT = 690;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const ENABLE_DEVTOOLS = true;

const Storage = require("./storage").Storage;
let stateMachine = new Storage("sessions", false);
let sessionID = null;
let meta = {};

let mainWindow = null;
let mainWindowIsVisible = false;

function setWindowVisible(isVisible, andUnminimize) {
    if (mainWindow == null) {
        return;
    };

    if (isVisible) {
        if (andUnminimize || !mainWindow.isMinimized()) {
            mainWindow.show();
            webContentsSend('MAIN_WINDOW_FOCUS');
        };
    } else {
        webContentsSend('MAIN_WINDOW_BLUR');
        mainWindow.hide();

        if (systemTray.hasInit) {
            systemTray.displayHowToCloseHint();
        };
    };
    mainWindow.setSkipTaskbar(!isVisible);
    mainWindowIsVisible = isVisible;
};

function launchMainAppWindow(isVisible) {
    if (mainWindow) {
        mainWindow.destroy();
    };

    const mainWindowOptions = {
        title: 'fov2',
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        transparent: false,
        frame: false,
        resizable: true,
        show: isVisible,
        webPreferences: {
            nodeIntegration: false,
            nativeWindowOpen: true,
            enableRemoteModule: false,
            spellcheck: true,
            contextIsolation: true,
            additionalArguments: ['--enable-node-leakage-in-renderers'],
            devTools: ENABLE_DEVTOOLS,
            preload: _path.join(__dirname, "preload.js"),
        }
    };

    if (process.platform === 'linux') {
        mainWindowOptions.icon = _path.default.join(
            _path.default.dirname(_electron.app.getPath('exe')), 'discord.png');
        mainWindowOptions.frame = true;
    };

    if (process.platform === 'darwin') {
        mainWindowOptions.titleBarStyle = 'hidden';
        mainWindowOptions.trafficLightPosition = {
            x: 10,
            y: 10
        };
    };

    mainWindow = new _electron.BrowserWindow(mainWindowOptions);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setMenu(null);
    mainWindow.loadFile("./app/index.html");

    mainWindow.webContents.openDevTools();

};

function init() {
    _electron.app.on('window-all-closed', () => {
        _electron.app.quit();
    });

    _electron.app.on('before-quit', () => {
        mainWindow = null;
    });

    _electron.app.on('gpu-process-crashed', (e, killed) => {
        if (killed) {
            _electron.app.quit();
        };
    });

    setupClientListeners();
    setupApi();

    _electron.app.on('second-instance', (_event, args) => {
        if (process.argv != null && process.argv.slice(1).includes('--multi-instance')) {
            return;
        };

        if (mainWindow == null) {
            return;
        };

        setWindowVisible(true, false);
        mainWindow.focus();
    });

    _electron.app.whenReady().then(() => {
        launchMainAppWindow(true);
        meta = stateMachine.getMeta();
        _electron.app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                launchMainAppWindow(true);
            };
        });
    });
    client.start();
};

let liveData = {};

function setupApi() {
    console.log("test");
    // Frame methods
    _electron.ipcMain.handle('close', async () => {
        _electron.app.quit();
    });
    _electron.ipcMain.handle('minimize', async () => {
        mainWindow.minimize();
    });
    _electron.ipcMain.handle('expand', async () => {
        mainWindow.maximize();
    });
    
    _electron.ipcMain.handle("getLiveData", async (event, args) =>{
        let data = {};
        for(let i = 0; i < args.length; i++){
            let packetId = args[i];
            let packetData = {live:false};
            if(liveData.hasOwnProperty(packetId)){
                packetData = liveData[packetId];
                packetData.live = true;
            };
            data[packetId] = packetData;
        } 
        return data;
    });

    _electron.ipcMain.handle("getMeta", async (event, args)=>{
        if(args){
            let trackid = args[0];
            if(meta.hasOwnProperty(trackid)){
                return meta[trackid];
            }else{
                meta[trackid] = {
                    lapRecord: 0,
                    sector1: 0,
                    sector2: 0,
                    sector3: 0
                };
                stateMachine.saveMeta(meta);
                return meta[trackid];
            }
        }else{
            return meta;
        }
    })
    _electron.ipcMain.handle("newMeta", async  (event, args)=>{
        let trackId = args[0];
        let newMeta = args[1];
        meta[trackId] = newMeta;
        stateMachine.saveMeta(meta);
    }) 
}


function setupClientListeners(){
    // motion 0
    client.on('motion',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // session 1
    client.on('session',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.saveData(data);
    })

    // lap data 2
    client.on('lapData',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // event 3
    // client.on('event',function(data) {
    //     let packetId = data.m_header.m_packetId;
    //     liveData[packetId] = data;
    //     stateMachine.appendData(data);
    // })

    // participants 4
    client.on('participants',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // car setup 5
    client.on('carSetups',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // car telemetry 6
    client.on('carTelemetry',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // car status 7
    client.on('carStatus',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // final classification 8
    client.on('finalClassification',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // lobby info 9
    client.on('lobbyInfo',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // car damage 10
    client.on('carDamage',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        stateMachine.appendData(data);
    })

    // session history 11
    client.on('sessionHistory',function(data) {
        let packetId = data.m_header.m_packetId;
        liveData[packetId] = data;
        
        let playerIndex = data.m_header.m_playerCarIndex;
        if(data.m_carIdx === playerIndex){
            stateMachine.saveData(data);
        };
    })
}
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

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 600;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const ENABLE_DEVTOOLS = true;

let stateMachine = require("./storage");
let state;
let sessionID = null;

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
        state = stateMachine.getState();
        _electron.app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                launchMainAppWindow(true);
            };
        });
    });
    client.start();
};
let liveData = false;

let currentTelem   = {};
let currentLap     = {};
let sessionHistory = {}

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
    
    client.on('carTelemetry', function (data) {
        // console.log(data);
        currentTelem = data;
        if(!liveData){
            liveData = true;
        }
    });
    client.on('lapData', function(data){
        currentLap = data;
        if (!liveData){
            liveData = true;
        }
    })

    _electron.ipcMain.handle("getTelem", async () =>{
        if(!liveData){
            return {live: false};
        };
        let index = currentTelem.m_header.m_playerCarIndex;
        let currentGear = "error"; 
        if(currentTelem.m_carTelemetryData.length > 0){
            currentGear = currentTelem.m_carTelemetryData[0].m_gear;
        };
        let ourData = {
            live: true,
            sessionTime: currentTelem.m_header.m_sessionTime,
            currentGear: currentGear
        }
        return ourData;
    })
    _electron.ipcMain.handle("getLap", async() => {
        if(!liveData){
            return {live: false};
        };
        let index = currentLap.m_header.m_playerCarIndex;
        let ourData;
        if(currentLap.m_lapData.length > 0){
            let ourCarData = currentLap.m_lapData[index];
            ourData = {
                live: true,
                currentLapTime: ourCarData.m_currentLapTimeInMS,
                sectors: {
                    "1": ourCarData.m_sector1TimeInMS,
                    "2": ourCarData.m_sector2TimeInMS
                },
                lastLapTime: ourCarData.m_lastLapTimeInMS,
                invalidated: ourCarData.m_currentLapInvalid
            }
        }
        return ourData;
    })
}
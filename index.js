const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow;

mainWindow = require("./app/mainWindow");
mainWindow.init();

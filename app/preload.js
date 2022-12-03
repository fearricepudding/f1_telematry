const { contextBridge, ipcRenderer } = require("electron")

window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector("#app_minimize").addEventListener("click", function(){
        ipcRenderer.invoke("minimize");
    })
    document.querySelector("#app_expand").addEventListener("click", function(){
        ipcRenderer.invoke("expand");
    })
    document.querySelector("#app_quit").addEventListener("click", function(){
        ipcRenderer.invoke("close");
    })

    // ipcRenderer.on('telem', function (data) {
    //     console.log(data);
    // });
});

console.log("preload");

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, args) => {
            let validChannels = [];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, args);
            }
        },
        receive: (channel, listener) => {
            let validChannels = [];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, args) => listener(args));
            } 
        },
        invoke: (channel, args) => {
            let validChannels = ["getTelem", "getLap"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
            }
        }
    }
);
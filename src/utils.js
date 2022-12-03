"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.sessionTimeFormat = sessionTimeFormat;
exports.msFormat = msFormat;

function sessionTimeFormat(SECONDS){
    return new Date(SECONDS * 1000).toISOString().substr(11, 8);
}

function msFormat(duration){
    var milliseconds = parseInt((duration%1000))
         , seconds = parseInt((duration/1000)%60)
         , minutes = parseInt((duration/(1000*60))%60)

     minutes = (minutes < 10) ? "0" + minutes : minutes;
     seconds = (seconds < 10) ? "0" + seconds : seconds;

     return minutes + ":" + seconds + ":" + milliseconds; 
 }
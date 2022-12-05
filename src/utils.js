"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.sessionTimeFormat = sessionTimeFormat;
exports.msFormat = msFormat;
exports.getTrackName = getTrackName;

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

function getTrackName(id){
    let tracks = {
        "0":"Melbourne",
        "1":"Paul Ricard",
        "2":"Shanghai",
        "3":"Sakhir (Bahrain)",
        "4":"Catalunya",
        "5":"Monaco",
        "6":"Montreal",
        "7":"Silverstone",
        "8":"Hockenheim",
        "9":"Hungaroring",
        "10":"Spa",
        "11":"Monza",
        "12":"Singapore",
        "13":"Suzuka",
        "14":"Abu Dhabi",
        "15":"Texas",
        "16":"Brazil",
        "17":"Austria",
        "18":"Sochi",
        "19":"Mexico",
        "20":"Baku (Azerbaijan)",
        "21":"Sakhir Short",
        "22":"Silverstone Short",
        "23":"Texas Short",
        "24":"Suzuka Short",
        "25":"Hanoi",
        "26":"Zandvoort",
        "27":"Imola",
        "28":"Portimão",
        "29":"Jeddah",
    };
    return tracks[id];
} 
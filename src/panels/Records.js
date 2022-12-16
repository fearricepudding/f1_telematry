import React, { Component } from "react";
import {msFormat} from "../utils.js";

export default class Panel_Records extends Component {
    constructor(props){
        super(props);
        this.state = {
            meta: null
        };
        
        this.tracks = {
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

    }

    componentDidMount(){
        this.getMeta();
    }

    getMeta(){
        window.api.invoke("getMeta")
            .then((data)=>{
                this.setState({meta: data});
            });
    };

    render() {
        let trackWidgets = [];
        for(let i = 0; i < Object.keys(this.tracks).length; i++){
            let trackID = Object.keys(this.tracks)[i];
            let trackName = this.tracks[trackID];
            let record = "--:--:---";
            let isSet = false;
            if(this.state.meta !== null && this.state.meta.hasOwnProperty(trackID)){
                record = this.state.meta[trackID].lapRecord;
                isSet = true;
            };
            trackWidgets.push(
                <div className={`col-4 mt-3`} key={i}>
                    <div className={`data-container-single ${isSet?"green":""}`}>
                        <div className="data-title">
                            {trackName} 
                        </div>
                        <div className="data-content">
                            {(typeof record === "number")?msFormat(record):record}
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <div className="h3">
                    Your Track Records
                </div>
                <div className="row">
                    {trackWidgets}
                </div>
            </div>
        );
    }
}
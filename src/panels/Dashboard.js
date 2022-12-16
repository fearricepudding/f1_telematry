import React, { Component } from "react";
import { sessionTimeFormat, msFormat, getTrackName } from "../utils.js";

export default class Panel_Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
                        
        };

        this.packetsRequired = ["1", "2", "6", "11"];
        this.getData = null;
        this.update = this.update.bind(this);
        this.logState = this.logState.bind(this);
        this.lapHistoryTable = [];
        this.trackID = null;
        this.thisSessionBest = 0;
    };

    componentDidMount(){
        for(let i  = 0; i < this.packetsRequired.length; i++){
            let packetId = this.packetsRequired[i];
            this.setState({[packetId]: {live:false}});
        };
        this.getData = window.setInterval(this.update, 100);
    }

    componentWillUnmount(){
        clearInterval(this.getData);
    }

    update(){
        window.api.invoke("getLiveData", this.packetsRequired)
            .then((data)=>{
                this.setState(data);
                if(this.state.hasOwnProperty("meta") && this.packetReady("11")){
                    let carIndex = this.state["11"].m_header.m_playerCarIndex;
                    if(this.state["11"].m_carIdx === carIndex){
                        for(let i = 0; i < this.state["11"].m_lapHistoryData.length; i++){
                            let item = this.state["11"].m_lapHistoryData[i];
                            if(item.m_lapTimeInMS === 0){
                                break;
                            }

                            if(item.m_lapValidBitFlags === 15 && (item.m_lapTimeInMS < this.state.meta.lapRecord || this.state.meta.lapRecord === 0)){
                                let newMeta = {
                                    lapRecord: item.m_lapTimeInMS,
                                    sector1: item.m_secor1TimeInMS,
                                    sector2: item.m_sector2TimeInMS,
                                    sector3: item.m_sector3TimeInMS
                                }
                                this.setState({meta: newMeta});
                                window.api.invoke("newMeta", [this.trackID, newMeta]);
                            };
                        };
                    };
                };
            });
    }

    packetReady(packetId){
        return (this.state.hasOwnProperty(packetId) && this.state[packetId].live);
    }

    logState(){
        console.log(this.state);
    }

    getMeta(){
        window.api.invoke("getMeta", [this.trackID])
            .then((data)=>{
                this.setState({meta: data});
                console.log(data);
            });
    };
        
    render() {

        let sessiontime = "--:--:--";
        let trackName = "No Track data";
        let trackRecord = "--:--:---";

        if(this.packetReady("1")){
            sessiontime = sessionTimeFormat(parseInt(this.state["1"].m_header.m_sessionTime));
            if(this.trackID === null || this.trackID !== this.state["1"].m_trackId){
                this.trackID = this.state["1"].m_trackId;
                this.thisSessionBest = 0;
                this.lapHistoryTable = [];
                this.getMeta();
            };
            if(this.state.hasOwnProperty("meta")){
                if(this.state.meta.hasOwnProperty("lapRecord")){
                    trackRecord = (this.state.meta.lapRecord ===  0)?"--:--:---":msFormat(this.state.meta.lapRecord);
                };
            };
                
            trackName = getTrackName(this.trackID);
        };

        let currentLapTime = "--:--:---";
        let sectorOne = "--";
        let sectorTwo = "--";
        let invalidLap = "No";
        let lapValidBool = false;

        if(this.packetReady("2")){
            let carIndex = this.state["2"].m_header.m_playerCarIndex;
            currentLapTime = msFormat(this.state["2"].m_lapData[carIndex].m_currentLapTimeInMS);
            let isLapValid = this.state["2"].m_lapData[carIndex].m_currentLapInvalid;
            invalidLap = (isLapValid === 0)?"Yes":"No";
            lapValidBool = (isLapValid === 0);
        };

        

        if(this.packetReady("11")){
            let carIndex = this.state["11"].m_header.m_playerCarIndex;
            if(this.state["11"].m_carIdx === carIndex){
                this.lapHistoryTable = [];
                for(let i = 0; i < this.state["11"].m_lapHistoryData.length; i++){
                    let item = this.state["11"].m_lapHistoryData[i];
                    if(item.m_lapTimeInMS === 0){
                        break;
                    }

                    if(item.m_lapValidBitFlags === 15 && (item.m_lapTimeInMS < this.thisSessionBest || this.thisSessionBest === 0)){
                        this.thisSessionBest = item.m_lapTimeInMS;
                        console.log(this.thisSessionBest);
                    }

                    this.lapHistoryTable.unshift(
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{msFormat(item.m_lapTimeInMS)}</td>
                            <td>{msFormat(item.m_sector1TimeInMS)}</td>
                            <td>{msFormat(item.m_sector2TimeInMS)}</td>
                            <td>{msFormat(item.m_sector3TimeInMS)}</td>
                            <td>{(item.m_lapValidBitFlags===15)?"Valid":"Invalid"}</td>
                        </tr>
                    );
                };
                
            }
        };

        let bestLapThisSession = (this.thisSessionBest===0)?"--:--:---":msFormat(this.thisSessionBest);
        return (
            <div>
                <div className="h3">
                    Current session 
                </div>
                <div className="row equal">
                    <div className="col-4">
                        <div className="data-container-single">
                            <div className="data-title">
                                Current session time
                            </div>
                             <div className="data-content">
                                {sessiontime}
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="data-container-single">
                            <div className="data-title">
                               Track Name 
                            </div>
                            <div className="data-content">
                                {trackName}
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="data-container-single">
                            <div className="data-title">
                                Your track record 
                            </div>
                            <div className="data-content">
                                {trackRecord}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-6">
                        <div className="row">
                            <div className="col-12">
                                <div className="data-container-single">
                                    <div className="data-title">
                                        Best lap this session 
                                    </div>
                                    <div className="data-content">
                                        {bestLapThisSession}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <div className="data-container-single">
                                    <div className="data-title">
                                        Current lap time 
                                    </div>
                                    <div className="data-content">
                                        {currentLapTime}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <div className={`data-container-single ${lapValidBool?"green":"red"}`}>
                                    <div className="data-title">
                                        Current lap valid
                                    </div>
                                    <div className="data-content">
                                        {invalidLap}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-12">
                                <div className="data-container-fullwidth">
                                    <img src="./trackmaps/1.svg" style={{"width":"100%"}} /> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="data-container-fullwidth">
                            <div className="data-title">
                                Session  laps 
                            </div>
                            <div className="data-content mt-2">
                                <table className="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                #
                                            </th>
                                            <th scope="col">
                                                Lap time
                                            </th>
                                            <th scope="col">
                                                Sector One
                                            </th>
                                            <th scope="col">
                                                Sector Two
                                            </th>
                                            <th scope="col">
                                                Sector Three
                                            </th>
                                            <th scope="col">
                                                Lap valid
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.lapHistoryTable}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}
import React, { Component } from "react";
import { sessionTimeFormat, msFormat } from "../utils.js";

export default class Panel_Dashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            telem:{},
            lap: {}
        };

        this.getData = null;

        this.update = this.update.bind(this);
    };

    componentDidMount(){
        this.getData = window.setInterval(this.update, 100);
    }

    componentWillUnmount(){
        clearInterval(this.getData);
    }

    update(){
        window.api.invoke("getTelem")
            .then((data)=>{
                this.setState({telem: data});
            });
        window.api.invoke("getLap")
            .then((data)=>{
                this.setState({lap: data});
            })
    }
        
    render() {
        let sessiontime = "0";
        let gear = "0";
        if(this.state.telem.live){
            sessiontime = sessionTimeFormat(parseInt(this.state.telem.sessionTime));
        }

        let lastLapTime = "--.--.--";
        let currentLapTime = "--.--.--";
        let invalidLap = "False";
        let sectorOne = "--";
        let sectorTwo = "--";
        if(this.state.lap.live){
            let lastLapTimeMS = parseInt(this.state.lap.lastLapTime);

             
            lastLapTime = msFormat(lastLapTimeMS);
            let currentLapTimeMS = parseInt(this.state.lap.currentLapTime);
            currentLapTime = msFormat(currentLapTimeMS);

            invalidLap = (this.state.lap.invalidated === "1")?"Yes":"No";

            sectorOne = msFormat(parseInt(this.state.lap.sectors["1"]));
            sectorTwo = msFormat(parseInt(this.state.lap.sectors["2"]));
        }
        return (
            <div>
                <div className="row">
                    <div className="col">
                        <div className="data-container-single">
                            Current session time: {sessiontime}
                        </div>
                    </div>
                    <div className="col">
                        <div className="data-container-single">
                            Current gear: {gear}
                        </div>
                    </div>
                    <div className="col">
                        <div className="data-container-single">
                            Last valid lap time: {lastLapTime}
                        </div>
                    </div>
                </div>
                <div>Current lap time: {currentLapTime}</div>
                <div>Current lap valid: {invalidLap}</div>
                <div>Sectors: {sectorOne} / {sectorTwo}</div>
            </div> 
        );
    }
}
import React, { Component } from "react";
import { Outlet, HashRouter, Routes, Route } from "react-router-dom";

import SideBar from "./SideBar";
import Panel_Dashboard from "./panels/Dashboard";

export default class Frame extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    response(data) {
        console.log(data);
    }

    getStatements() {
        window.api.invoke("getState")
            .then(data=>console.log(data));
    }

    render(){
        return(
            <div>
                <div id="content">
                    <HashRouter>
                        <SideBar />
                        <div id="panel">
                            <Routes>
                                <Route index path="/" element={<Panel_Dashboard />} />
                            </Routes>
                        </div>
                    </HashRouter>
                </div>
            </div>
        )
    }
}
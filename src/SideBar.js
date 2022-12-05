import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class SideBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="sidebar">
                <nav>
                    <Link to="/">
                        <div className="nav-item">
                            <div className="home-icon">
                            </div>
                        </div>
                    </Link>
                    <Link to="/sessions">
                        <div className="nav-item">
                            <div className="history-icon">
                            </div>
                        </div>
                    </Link>
                </nav>
            </div>
        );
    }
}
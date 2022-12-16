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
                    <div className="sep"></div>
                    <Link to="/sessions">
                        <div className="nav-item">
                            <div className="history-icon">
                            </div>
                        </div>
                    </Link>
                    <div className="sep"></div>
                    <Link to="/records">
                        <div className="nav-item">
                            <div className="records-icon">
                            </div>
                        </div>
                    </Link>
                    <div className="sep"></div>
                    <Link to="/leaderboard">
                        <div className="nav-item">
                            <div className="leaderboard-icon">
                            </div>
                        </div>
                    </Link>
                    <div className="sep"></div>
                    <Link to="/profile">
                        <div className="nav-item">
                            <div className="profile-icon">
                            </div>
                        </div>
                    </Link>
                    <div className="sep"></div>
                    <Link to="/settings">
                        <div className="nav-item">
                            <div className="settings-icon">
                            </div>
                        </div>
                    </Link>
                </nav>
            </div>
            
        );
    }
}
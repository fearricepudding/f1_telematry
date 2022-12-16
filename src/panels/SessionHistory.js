import React, { Component } from "react";

export default class Panel_SessionHistory extends Component {
    constructor(props){
        super(props);
        this.state = {

        };

    }

    componentDidMount(){

    }

    componentWillUnmount(){

    }

    update(){
        window.api.invoke ("getSessions", [0, 5])
            .then((data)=>{
                this.setState({sessions: data});
            });
    }

    render() {
        return (
            <div>
                <div className="h3">
                    Session History
                </div>
            </div>
        );
    }
}
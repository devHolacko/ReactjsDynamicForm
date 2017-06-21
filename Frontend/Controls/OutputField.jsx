import React from 'react';

export default class OutputField extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        var element = null;
        switch (this.props.type) {
            case "title":
                    element = <h1 key={this.props.controlId}>{this.props.label}</h1>
                break;

                case "subtitle" :
                    element = <h3 key={this.props.controlId}>{this.props.label}</h3>
                break;

                case "label":
                    element = <label key={this.props.controlId}> {this.props.label}</label>
                break;
        }
        return(element);
    }
}
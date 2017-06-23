import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField'

export default class TextInput extends React.Component {
	
	constructor(props){
		super(props);
		this.state={
				controlValue : this.props.controlValue
			}
		}

	render(){
		return(
			<MuiThemeProvider>
				 <TextField
				 key={this.props.controlId}
				 id={this.props.controlId}
				 floatingLabelText={this.props.controlLabel} 
				 defaultValue={this.props.controlDefault}
				 value={this.state.controlValue}
				 style={this.props.style}
				 onChange={this.props.handleOnChange} />
			</MuiThemeProvider>
		);
	}
} 
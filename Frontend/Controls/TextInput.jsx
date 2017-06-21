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

	// handleOnChange(e){
	// 	this.setState({
	// 		controlValue : e.target.value
	// 	})
	// }

	render(){
		return(
			<MuiThemeProvider>
				{/*<label> {this.props.controlLabel} </label>
				<input type="text" value={this.props.controlDefault} id={this.props.controlId} 
				min={this.props.controlMin} max={this.props.controlMax}
				 />*/}
				 <TextField
				 key={this.props.controlId}
				 id={this.props.controlId}
				 floatingLabelText={this.props.controlLabel} 
				 defaultValue={this.props.controlDefault}
				 value={this.state.controlValue}
				 onChange={this.props.handleOnChange} />
			</MuiThemeProvider>
		);
	}
} 
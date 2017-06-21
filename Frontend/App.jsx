import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Next from 'material-ui/svg-icons/navigation/chevron-right';
import Back from 'material-ui/svg-icons/navigation/chevron-left';
import Done from 'material-ui/svg-icons/action/done';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ControlHandler from './Controls/ControlHandler.jsx';
import axios from 'axios'

class App extends React.Component {
	
	constructor(props){
		super(props);

		this.state = {
		arrDivItems : [],
		requestResult : null, // this.getInputGroup(),
		isDataReturned : false,
		handler : new ControlHandler(this.getInputGroup()),
		step : 0,
		showBack : false,
		nextText : "Next",
		buttonStyle:{
				marginRight:20
			},
		paperStyle:{
				marginLeft:40,
				marginRight:40
			},
		containerStyle:{
				marginLeft:100,
				marginRight:30,
				marginTop:100,
				marginBottom:100,
				"padding-bottom" : "30px",
				"padding-top":"30px",
				width:"70%"
			}
		}


		this.setStateHandler = this.setStateHandler.bind(this);

		//this.state.handler.setRequestResult(this.state.requestResult);
		this.getInputs();
	}

	nextStep(){
		if(this.state.nextText == "Submit"){
			this.postInputs();
			alert("Submit");
		}else{
			if(this.state.step + 1 < this.state.handler.getRequestResult().inputGroups.length -1)
			{
				this.setState({
				step: this.state.step+1 ,
				showBack : (this.state.step + 1 > 0 && this.state.step + 1 < this.state.handler.getRequestResult().inputGroups.length) ? true : false,
				nextText : "Next" 
				});
			}
			else if(this.state.step + 1 == this.state.handler.getRequestResult().inputGroups.length-1){
				this.setState({
				step: this.state.step+1 ,
				showBack : (this.state.step + 1 > 0 && this.state.step + 1 < this.state.handler.getRequestResult().inputGroups.length) ? true : false,
				nextText : "Submit" 
				});
			}
			else{
				this.setState({
				nextText : "Submit" 
				});
			}
		}
	}

	backStep(){
		if(this.state.step - 1 >= 0)
		{
			this.setState({
			step: this.state.step-1 ,
			showBack : (this.state.step + 1 > 0 && this.state.step + 1 < this.state.handler.getRequestResult().inputGroups.length) ? true : false,
			nextText : "Next" 
			});
		}
	}

	showStep(){
		var requestResult = this.state.handler.getRequestResult();
		for(var i = 0; i < requestResult.InputGroups.length; i++){
			if(this.state.step == i+1){
				var stepElementsToRender  = requestResult.InputGroups[i].elements;
				for(var j = 0; j < stepElementsToRender.length;j++){
					return this.createItem(stepElementsToRender[j]);
				}
			}
		}
	}
	
	setStateHandler (){
		
	}

	
	getInputGroup (){
		var group = {
	"InputGroups":[
				{
					"name" : "",
					"subtitle" : "",
					"elements" : [
								]
				}
				
			],
			"Calculations":[
			]
		}

		return group;
	}

	getInputs(){
		var self = this;
		axios.get('http://localhost:9415/api/Controls')
      .then( (response) => {
		self.state.handler.setRequestResult(response.data);

		this.setState({
			isDataReturned : true
		})
        // this.setState({
        //   fetchUser: response.data
        // });
        // console.log("fetchUser", this.state.fetchUser);
      })
      .catch( (error) => {
        console.log(error);
      });  
	}

	postInputs(){
		var self = this;
		var data = self.state.handler.getRequestResult();
		console.log(data);
		 axios.post('http://localhost:9415/api/Controls', data)

            .then((response) => {
                //dispatch({type: FOUND_USER, data: response.data[0]})
				console.log(response);
            })
            .catch((error) => {
				console.log(error);
            })
	}

	createItem(item){
		
		return (<div> {item} </div>);
	}

	handleClick(){
		this.nextStep();
	}

	handleBackClick(){
		this.backStep();
	}

	render(){
		if(this.state.isDataReturned){
		
		var itemsToRender = this.state.handler.getRequestResult().inputGroups[this.state.step]; // TO DO : 0 should be replace with current step index

		var data = this.state.handler.renderStep(itemsToRender).arrInputs;
		var self = this;
		
		return (
			<MuiThemeProvider>
			<Paper style={this.state.paperStyle} zDepth={5}>
				<div style={this.state.containerStyle}>
					{
						data.map(function(item,index){
							return (self.createItem(item));
						})
					}

					<br/>
					<div>
						<MuiThemeProvider>
							{
								this.state.showBack ?
								<FloatingActionButton style={this.state.buttonStyle} onClick={this.handleBackClick.bind(self)}>
									<Back />
								</FloatingActionButton> 
								: null
							}	
						</MuiThemeProvider>

						<MuiThemeProvider>
							<FloatingActionButton style={this.state.buttonStyle} onClick={this.handleClick.bind(self)}>
								{this.state.nextText == "Next" ? <Next /> : <Done />}
							</FloatingActionButton>
						</MuiThemeProvider>
						{/*{this.state.showBack ? <button onClick={this.handleBackClick.bind(self)} >back</button> : null}
						<button onClick={this.handleClick.bind(self)} >{this.state.nextText}</button>*/}
					</div>
				</div>
			</Paper>
			</MuiThemeProvider>
	      );
		}
		else{
			return(<MuiThemeProvider><Paper style={this.state.paperStyle} zDepth={5}><div>Please wait ...</div></Paper></MuiThemeProvider>);
		}
	}



}
export default App;

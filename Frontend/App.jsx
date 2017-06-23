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
		requestResult : null,
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

		
		this.getInputs();
	}

	getHandler(){
		return this.state.handler;
	}

	nextStep(){
		var handler = this.getHandler();
		var state = this.state;
		var currentStep = state.step;
		var nextStep = currentStep + 1;

		if(state.nextText == "Submit"){
			this.postInputs();
			alert("Submit");
		}else{
			var inputGroups = handler.getRequestResult().inputGroups;

			if(nextStep < inputGroups.length -1)
			{
				handler.updateStepIndex(this.state.step + 1);

				this.setState({
					step: nextStep ,
					showBack : (nextStep > 0 && nextStep < inputGroups.length) ? true : false,
					nextText : "Next" 
				});
			}
			else if(nextStep == inputGroups.length-1){
				handler.updateStepIndex(this.state.step + 1);
				this.setState({
					step: nextStep ,
					showBack : (nextStep > 0 && nextStep < inputGroups.length) ? true : false,
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
		var handler = this.getHandler();
		var inputGroups = handler.getRequestResult().inputGroups;
		var state = this.state;
		var currentStep = state.step;
		var nextStep = currentStep + 1;
		var backStep = currentStep - 1;
		if(backStep >= 0)
		{
			handler.updateStepIndex(backStep);
			this.setState({
				step: backStep ,
				showBack : (nextStep > 0 && nextStep < inputGroups.length) ? true : false,
				nextText : "Next" 
			});
		}
	}

	showStep(){
		var handler = this.getHandler();
		var inputGroups = handler.inputGroups;
		var state = this.state;
		var currentStep = state.step;
		var nextStep = currentStep + 1;
		var backStep = currentStep - 1;

		var inputGroups = handler.getRequestResult().inputGroups;
		for(var i = 0; i < inputGroups.length; i++){
			if(currentStep == i+1){
				var stepElementsToRender  = inputGroups[i].elements;
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
		  console.log("response",response);
		self.state.handler.setRequestResult(response.data);
		self.state.requestResult = response.data;

		this.setState({
			isDataReturned : true
		})
      })
      .catch( (error) => {
        
      });  
	}

	postInputs(){
		var self = this;
		var data = self.state.handler.getItemsToPost();
		var items ={
			items:data
		}
		

		 axios.post('http://localhost:9415/api/Controls', items)

            .then((response) => {
            })
            .catch((error) => {
				
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
			var handler = this.state.handler;
		var itemsToRender = handler.getRequestResult().inputGroups[this.state.step];
		
		var data = handler.renderStep(itemsToRender).arrInputs;
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

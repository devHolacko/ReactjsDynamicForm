import React from 'react';
import Slider from 'material-ui/Slider';
import OutputField from './OutputField.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/**
 * By default, the slider is continuous.
 * The `step` property causes the slider to move in discrete increments.
 */
export default class SliderControl extends React.Component{
  constructor(props){
    super(props);
    this.state={
      controlValue : this.props.controlDefault,
      style:{
        "float":"right"
      },
      sliderValuesDiv:{
        width:500
      }
    }
  }

  render(){
    return(
      <div style={this.state.sliderValuesDiv}>
          <OutputField controlId={Math.random()} type="label" label={this.props.controlLabel} />
          <br/>
          <br/>
          <div style={this.state.sliderValuesDiv}>
              <OutputField controlId={Math.random()} type="label" label={this.props.controlMin} />
              <OutputField controlId={Math.random()} type="label" className="align-right margin-bottom" label={this.props.controlMax} />
            </div>
          <MuiThemeProvider>
            <Slider
              key={this.props.controlId}
              id={this.props.controlId}
              min={this.props.controlMin}
              max={this.props.controlMax}
              step={1}
              
              value={this.props.controlDefault}
              onChange={this.props.handleSliderOnChange.bind(null,this.props.controlId)} />
              
          </MuiThemeProvider>
      </div>
          );
  }
}
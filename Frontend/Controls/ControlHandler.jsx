import React from 'react';
import OutputField from './OutputField.jsx';
import TextInput from './TextInput.jsx';
import SliderControl from './SliderControl.jsx';
import math from 'mathjs';

export default class ControlHandler{

    constructor(requestResult){
        this.state={
            textInputOnChange : this.handleTextInputOnChange,
            sliderOnChange : this.handleSliderOnChange,
            stepIndex : 0,
            maxStepIndex : 0,
            requestResult : null,
            getNumericInputs : this.getElementsWithNumericValues.bind(this),
            getEquations : this.getResultEquations.bind(this)
        }
    }

    getResultEquations(){
        var equations = {
        }

        var arrCalculations = this.state.requestResult.calculations;

        for (var index = 0; index < arrCalculations.length; index++) {
            var element = arrCalculations[index];
            equations[element.id] = element.id;
            equations[element.equation] = element.equation;
        }

        return equations;
    }

    getElementsWithNumericValues(){
        var self = this;
        var scope ={
        }
        var inputGroups = this.state.requestResult.inputGroups;

        for (var index = 0; index < inputGroups.length; index++) {
            var elements = inputGroups[index].elements;
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                if(!isNaN(parseFloat(element.default)) && isFinite(element.default)){
                    scope[element.id] = element.default;
                }
            }
        }

        return scope;   
    }

    getAllElements(){
        var self = this;
        var scope ={
        }
        var inputGroups = this.state.requestResult.inputGroups;

        for (var index = 0; index < inputGroups.length; index++) {
            var elements = inputGroups[index].elements;
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                scope[element.id] = element.default;
            }
        }

        return scope;   
    }

    handleTextInputOnChange(event){
        var element = event.target;
        var elementId = element.id;
        var elementValue = element.value;

        var requestResult = this.state.requestResult;

        this.updateControlValue(elementId,elementValue);
    }

    handleSliderOnChange(id,event,value){
        var sliderValue = value;
        var elementId = id;

        
        var requestResult = this.state.requestResult;

        
        this.updateControlValue(elementId,sliderValue);
    }

    updateControlValue(id,value){
        var requestResult = this.state.requestResult;
        for(var i = 0;i < requestResult.inputGroups.length;i++){
            var elements = requestResult.inputGroups[i].elements;
            
            for(var j = 0;j < elements.length;j++ ){
                var itemId = elements[j].id;
                if(id == itemId){
                    elements[j].default = value;
                }
            }

            requestResult.inputGroups[i].elements = elements;
        }

        this.state.requestResult = requestResult;
    }

    setRequestResult(result){
        this.state.requestResult = result;
        this.initSteps();
    }

    getRequestResult(){
        return this.state.requestResult;
    }
    initSteps(){
        console.log("RequestResult inputGroups Length",this.state.requestResult.inputGroups);
        if(this.state.requestResult != null){
            this.state.maxStepIndex = this.state.requestResult.inputGroups.length;
        }
    }

    nextStep(){
        if(this.state.stepIndex >= 0 && this.state.maxStepIndex - this.state.stepIndex > 0 ){
            this.state.previousStepIndex = this.state.stepIndex;
            this.state.stepIndex = this.state.stepIndex + 1;
        }
    }

    backStep(){
        if(this.state.stepIndex > 0){
            this.state.stepIndex = this.state.previousStepIndex;
            this.state.previousStepIndex = this.state.previousStepIndex - 1;
        }
    }

    evaluateEquation(equation){
        
        var arrElements = [];
        
        
        var scope = this.state.getNumericInputs();


        return math.eval(equation,scope);
    }

    renderStep(stepInputGroup){
        var name = stepInputGroup.name;
        var subtitle = stepInputGroup.subtitle;
        var elements = stepInputGroup.elements;

        //this.evaluateEquation("my_second_text * my_second_text");

        var arrInputs = [];

        var self = this;

        arrInputs.push(self.renderOutput({id:Math.random(),label:name,type:"title"}));
        arrInputs.push(self.renderOutput({id:Math.random(),label : subtitle,type:"subtitle"}));

        for(var i = 0; i < elements.length; i++){
             var item = elements[i];
            if(item.type === "slider"){
                arrInputs.push(self.renderSlider(item));
            }
            else if(item.type === "input"){
                arrInputs.push(self.renderTextInput(item));
            }
            else if(item.type === "output"){
                var valueId = item.valueId;
                var numericInputs = this.state.getNumericInputs();
                var arrEquations = this.state.getEquations();
                var arrElements = this.getAllElements();

                if(numericInputs[valueId] != null){
                    var itemValue = numericInputs[valueId];
                    arrInputs.push(self.renderOutput({id:item.id,label : itemValue,type:"label"}));
                    break;
                }
                else if(arrEquations[valueId] != null){
                    var itemValue = arrEquations[valueId];
                    var result = this.evaluateEquation(itemValue);
                    arrInputs.push(self.renderOutput({id:item.id,label : result,type:"label"}));
                }
                else{
                    var itemValue = arrElements[valueId];
                    arrInputs.push(self.renderOutput({id:item.id,label : itemValue,type:"label"}));
                }
            }
        }

        return({arrInputs});

    }

    renderTextInput(values){
        return(
                <TextInput
                    controlId={values.id}
                    controlLabel={values.label}
                    controlDefault={values.default}
                    handleOnChange={this.state.textInputOnChange.bind(this)}
                />
            );
    }

    renderSlider(values){
        return(
            <SliderControl
                controlId={values.id}
                controlMin={values.min}
                controlMax={values.max}
                controlDefault={values.default}
                controlValue={values.default}
                handleSliderOnChange = {this.state.sliderOnChange.bind(this)}
                controlLabel={values.label}
             />
        );
    }

    renderOutput(values){
        return(
            <OutputField 
                type={values.type}
                controlId={values.id}
                label={values.label}
            />
        );
    }

}
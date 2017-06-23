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
            getEquations : this.getResultEquations.bind(this),
            sliderValue : -1,
            sliderValuesDiv:{
                width:500
            }
        }
    }

    updateStepIndex(newStep){
        this.state.stepIndex = newStep;
    }

    getResultEquations(){
        var equations = [];

        var arrCalculations = this.state.requestResult.calculations;

        arrCalculations.forEach(function(element,index){
            var item = {};
            item.id = element.id;
            item.calculation = element.equation;
            equations.push(item);
        });

        return equations;
    }

    getElementsWithNumericValues(){
        var self = this;
        var scope ={
        }
        var inputGroups = this.state.requestResult.inputGroups;

        inputGroups.forEach(function(item,index){
            var elements = item.elements;
            elements.forEach(function(el,j){
                var element = elements[j];
                if(!isNaN(parseFloat(element.default)) && isFinite(element.default)){
                    scope[element.id] = element.default;
                }
            });
        });

        return scope;   
    }

    getAllElements(){
        var self = this;
        var scope ={
        }
        var inputGroups = this.state.requestResult.inputGroups;

        inputGroups.forEach(function(item,index){
            var elements = item.elements;
            elements.forEach(function(subItem,j){
                var element = subItem
                scope[element.id] = element.default;
            });
        });

        return scope;   
    }

    getSliderValue(){
        return this.state.sliderValue;
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

        this.state.sliderValue = sliderValue;

        document.getElementById(id+"_label").innerHTML = sliderValue;
        
        this.updateControlValue(elementId,sliderValue);
    }

    updateOutputs(){
        var stepIndex = this.state.stepIndex;
        console.log(this.getRequestResult());
        var currentStep = this.getRequestResult().inputGroups[stepIndex].elements;
        
        currentStep.forEach(function(item,index) {
            if(item.type == "output" && item.valueId != null){
                var valueId = item.valueId;
                var numericInputs = this.state.getNumericInputs();
                var arrEquations = this.state.getEquations();
                var arrElements = this.getAllElements();

                var isEquation = false;
                arrEquations.forEach(function(item,index){
                    if(item.id == valueId){
                        isEquation = true;
                    }
                });
               if(numericInputs[valueId] != null){
                    var itemValue = numericInputs[valueId];
                    document.getElementById(item.id).value = itemValue;
                }
                else if(isEquation){
                    var itemValue = {};
                    arrEquations.find(function(e){
                        if(e.id == valueId){
                            itemValue[e.id] = e.calculation;
                        }
                    });
                    var result = this.evaluateEquation(itemValue);
                    document.getElementById(item.id).innerHTML = result;
                }
                else{
                    var itemValue = arrElements[valueId];
                    document.getElementById(item.id).innerHTML = itemValue;
                }
            }
        }, this);
    }

    updateControlValue(id,value){
        var requestResult = this.state.requestResult.inputGroups;
        
        requestResult.forEach(function(item,i){
            var elements = item.elements;
            
            elements.forEach(function(subItem,j){
                var itemId = subItem.id;
                if(id == itemId){
                    subItem.default = value;
                }
            });

            requestResult[i].elements = elements;
        });

        this.state.requestResult.inputGroups = requestResult;

        this.updateOutputs();
        
    }

    setRequestResult(result){
        this.state.requestResult = result;
        this.initSteps();
    }

    getRequestResult(){
        return this.state.requestResult;
    }
    initSteps(){
        
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

    getItemsToPost(){
        var arrElements = [];
        var arrEquationIds = [];
        var scope = this.state.getNumericInputs();
        var equations = this.state.getEquations();
        var self = this;

        equations.forEach(function(eq,eIndex){
            var arrItemToAdd = [];
            var equationId = eq.id;
            var equationValue = eq.calculation;
            var scopeKeys = Object.keys(scope);

            scopeKeys.forEach(function(item,index){
                
                var key = scopeKeys[index];
                
                if(equationValue.includes(key)){
                    var itemToAdd = {};
                    itemToAdd[key] = scope[key];
                    
                    arrItemToAdd.push(itemToAdd);
                    
                }
            });
            
            
            var itemToAdd = {};
            itemToAdd[equationId] = math.eval(equationValue,scope);
            arrItemToAdd.push(itemToAdd);

            arrEquationIds.push(arrItemToAdd);
        });

        return arrEquationIds;

    }

    evaluateEquation(equation){
        var equationId = Object.keys(equation)[0]
        var equationValue = equation[equationId];
        
        
        var scope = this.state.getNumericInputs();
        
        var result = math.eval(equationValue,scope);
        return result;
    }

    renderStep(stepInputGroup){
        var name = stepInputGroup.name;
        var subtitle = stepInputGroup.subtitle;
        var elements = stepInputGroup.elements;
        
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

                var isEquation = false;
                arrEquations.forEach(function(item,index){
                    if(item.id == valueId){
                        isEquation = true;
                    }
                });

                if(numericInputs[valueId] != null){
                    var itemValue = numericInputs[valueId];
                    arrInputs.push(self.renderOutput({id:item.id,label : itemValue,type:"label"}));
                    break;
                }
                else if(isEquation){
                    var itemValue = {};
                    arrEquations.find(function(e){
                        if(e.id == valueId){
                            itemValue[e.id] = e.calculation;
                        }
                    });
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
            <div>
                <br/>
                <br/>
                <SliderControl
                    controlId={values.id}
                    controlMin={values.min}
                    controlMax={values.max}
                    controlDefault={values.default}
                    controlValue={values.default}
                    handleSliderOnChange = {this.state.sliderOnChange.bind(this)}
                    controlLabel={values.label}
                />
                <div style={this.state.sliderValuesDiv}>
                    <OutputField className="align-right" controlId={values.id+"_label"} type="label" label={values.default}/>
                </div>
             </div>
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
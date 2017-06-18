/** Command example
{
	type:"type",
	name:"theformcheckboxes"
	values:{
		"value":"text",
		"_rememberme":"Rememberme"
	},
	value: ["value","_rememberme"]
}
*/
class CaretakerFormInputCheckbox extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return new Set()
	}
	loadedValueIsValid(){
		return true
	}
	transformValueBeforeLoad(value){
		var set = new Set()
		if(value != null){
			try{
				for(var i in value){
					try{
						set.add(value[i])
					}catch(e){console.error(e)}
				}
			}catch(e){console.error(e)}
		}
		return set
	}
	checkValidity(value){
		if(this.isRequired()){
			if(typeof this.getUpdatedProps().values == "object" && this.getUpdatedProps().values){
				if(this.state.value.size <= 0 && Object.keys(this.getUpdatedProps().values).length > 0){
					if( Object.keys(this.getUpdatedProps().values).length == 1 ){
						return ["Check to continue"]
					}else{
						return ["At least one option must be checked"]
					}
				}
			}
		}
		return true
	}
	transformValueBeforeSave(value){
		return Array.from(this.state.value)
	}
	onChange(index, value){
		if(this.state.value.has(index)){
			this.state.value.delete(index)
		}else{
			this.state.value.add(index)
		}
		this.updateParent()
	}
	removePropKeys(){
		return ["values","value","options"]
	}
	getCheckboxes(){
		var html = ""
		var values = this.getUpdatedProps().values
		for(var i in values){
			if(html == ""){
				html = []
			}
			var text = values[i]
			var props = this.getProps()
			props.onChange = this.onChange.bind(this, i)
			props.key = i+"-checkbox"
			if(this.state.value.has(i)){
				props.checked = true
			}else{
				props.checked = false
			}

			html.push(React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormInputCheckbox"), key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.getUpdatedProps().name || ""
		return React.createElement('div', {className: this.appearanceProtoGetClassName('div', "CaretakerFormInputCheckboxCollection")}, (
			this.getCheckboxes()
		))
	}
}

Caretaker.SpecialInput.register('checkbox',CaretakerFormInputCheckbox)

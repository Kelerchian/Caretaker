/** Command example
{
	type:"type",
	name:"theformradio"
	values:{
		"male":"Male",
		"female":"Female"
	},
	value: "male"
}
*/
class CaretakerFormInputRadio extends CaretakerFormInputPrototype{
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	checkValidity(value){
		if(this.isRequired()){
			if(value == ""){
				return ["An option must be selected"]
			}
		}
		return true
	}
	getDefaultValue(){
		return ""
	}
	loadedValueIsValid(value){
		return typeof value == "string"
	}
	removePropKeys(){
		return ["options","name"]
	}
	getProps(){
		var props = this.getProtoProps()
		return props
	}
	getCheckboxes(){
		var html = ""
		var values = this.props.values
		for(var i in values){
			if(html == ""){
				html = []
			}
			var text = values[i]
			var props = this.getProps()
			props.onChange = this.onChange.bind(this, i)
			props.key = i+"-radio"
			if(this.state.value == i){
				props.checked = true
			}else{
				props.checked = false
			}

			html.push(React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormInputRadio"), key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerFormInputRadioCollection")}, (
			this.getCheckboxes()
		))
	}
}

Caretaker.SpecialInput.register('radio',CaretakerFormInputRadio)

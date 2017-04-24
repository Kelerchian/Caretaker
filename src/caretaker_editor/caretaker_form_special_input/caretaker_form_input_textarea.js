class CaretakerFormInputTextarea extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return ""
	}
	checkValidity(value){
		if(this.isRequired() && value == ""){
			return false
		}
		return true
	}
	loadedValueIsValid(value){
		return typeof value == "string"
	}
	onChange(event){
		this.state.value = event.target.value
		this.updateParent()
	}
	removePropKeys(){
		return ["type"]
	}
	modifyProps(props){
		props.onChange = this.onChange.bind(this)
		props.value = this.state.value
	}
	getTextarea(){
		return React.createElement('textarea', this.getProps())
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormInputTextarea"}, (
			this.getTextarea()
		))
	}
}

Caretaker.SpecialInput.register('textarea',CaretakerFormInputTextarea)
Caretaker.SpecialInput.register('textarea-text',CaretakerFormInputTextarea)

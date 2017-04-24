class CaretakerFormInputDate extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return ""
	}
	transformValueBeforeLoad(valueFromData){
		moment(valueFromData)
	}
	loadedValueIsValid(value){
		return moment(value).isValid()
	}
	transformValueBeforeSave(value){
		if(value){
			return moment(value).format("YYYY-MM-DD")
		}else{
			return ""
		}
	}
	checkValidity(value){
		if(this.isRequired()){
			if(value == ""){
				return false
			}
		}
		return true
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onFocus(){
		Caretaker.Widget.callDateInputWidget(this.onChange.bind(this), this.state.value)
	}
	removePropKeys(){
		return ["type","values","value","defaultValue"]
	}
	modifyProps(props){
		props.type = "text"
		if(this.state.value){
			props.value = this.state.value.format("dddd, DD MMM YYYY")
		}else{
			props.value = ""
		}
		props.onFocus = this.onFocus.bind(this)
		return props
	}
	render(){
		return React.createElement('input',this.getProps())
	}
}

Caretaker.SpecialInput.register('date',CaretakerFormInputDate)

class CaretakerFormInputDate extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return ""
	}
	loadValue(props){
		this.state.value = this.getDefaultValue();
		if(props.value != null){
			var supposedValue = this.transformValueBeforeLoad(props.value)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}else if(props.defaultValue != null){
			var supposedValue = this.transformValueBeforeLoad(props.defaultValue)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}
		this.state.value = this.modifyValueAfterLoad(this.state.value) || this.state.value
	}
	updateParent(){
		if(this.props.onChange){

			this.props.onChange(this.transformValueBeforeSave(this.state.value))
		}
		this.state.validationUpdated = false
		this.setState(this.state)
	}
	transformValueBeforeLoad(valueFromData){
		if(valueFromData == ""){
			return valueFromData
		}else{
			return moment(valueFromData)
		}
	}
	loadedValueIsValid(value){
		return value == "" || moment(value).isValid()
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
				return ["This must be filled"]
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
		props.className = this.appearanceProtoGetClassName("input", "CaretakerFormInputDate")
		props.onFocus = this.onFocus.bind(this)
		return props
	}
	render(){
		return React.createElement('input',this.getProps())
	}
}

Caretaker.SpecialInput.register('date',CaretakerFormInputDate)

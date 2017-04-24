class CaretakerFormInputTime extends CaretakerFormInputPrototype{
	getDefaultValue(value){
		return ""
	}
	checkValidity(value){
		if(this.isRequired() && value == ""){
			return false
		}
		return true
	}
	transformValueBeforeLoad(value){
		return moment(value, "HH:mm:ss")
	}
	loadedValueIsValid(value){
		return moment(value).isValid()
	}
	transformValueBeforeSave(value){
		if(value){
			return value.format("HH:mm:ss")
		}else{
			return ""
		}
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onFocus(){
		Caretaker.Widget.callTimeInputWidget(this.onChange.bind(this), this.state.value)
	}
	removePropKeys(){
		return ["type","values","value"]
	}
	modifyProps(props){
		props.type = "text"
		if(this.state.value){
			props.value = this.state.value.format("HH:mm:ss")
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

Caretaker.SpecialInput.register('time',CaretakerFormInputTime)

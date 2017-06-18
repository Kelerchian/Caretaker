class CaretakerInput extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.state.isValidating = props.isValidating
		if(this.isCommonInput()){
			this.reportValidity()
		}
		// this.setState(this.state)
	}
	getDefaultValue(){
		if(this.isCommonInput()){
			return ""
		}else{
			return null
		}
	}
	loadValue(props){
		this.updateProps(props)
		this.state.value = this.getDefaultValue()
		if(props.hasOwnProperty("value")){
			if(!(props.value == null && this.isCommonInput())){
				this.state.value = props.value
			}
		}
		if(props.hasOwnProperty("defaultValue")){
			if( !(props.defaultValue == null && this.isCommonInput()) ){
				this.state.value = props.defaultValue
			}
		}
		if(props.isResetting){
			this.updateParent()
		}
	}
	checkValidityAdvanced(){
		this.state.isValid = [this.textInput.validationMessage]
	}
	checkValidity(){
		if(this.isCommonInput()){
			if(this.textInput){
				this.state.isValid = this.textInput.checkValidity()
				if(this.state.isValid == false){
					this.checkValidityAdvanced()
				}
			}else{
				this.state.isValid = false
			}
		}
	}
	onReportValidity(isValid){
		this.state.isValid = isValid
		this.state.validationUpdated = false
		this.reportValidity()
	}
	reportValidity(){
		if(this.getUpdatedProps().onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			this.checkValidity()
			this.getUpdatedProps().onReportValidity(this.state.isValid)
		}
	}
	getNegativeCommonPropKeys(){
		return ["options","value","isValidating","onReportValidity","isResetting","className"]
	}
	bindInput(input){
		this.textInput = input
	}
	getProps(){
		var props = Object.assign({}, this.getUpdatedProps())
		if(this.isCommonInput()){
			this.getNegativeCommonPropKeys().forEach(function(key){
				props[key] = null
				delete props[key]
			})
		}
		props.onChange = this.onCommonInputChange.bind(this)
		props.value = this.state.value
		props.className = this.appearanceProtoGetClassName("input","")
		props.ref = this.bindInput.bind(this)
		return props
	}
	getSpecialProps(){
		var props = Object.assign({}, this.getUpdatedProps())
		props.onChange = this.onChange.bind(this)
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
		return props
	}
	isCommonInput(){
		return Caretaker.SpecialInput.isCommonInput(this.getUpdatedProps().type)
	}
	updateParent(){
		if(this.getUpdatedProps().onChange){
			this.getUpdatedProps().onChange(this.state.value)
		}
		this.state.validationUpdated = false
	}
	onCommonInputChange(event){
		this.state.value = event.target.value
		this.updateParent()
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	renderSpecialInput(){

		var specialInputClass = Caretaker.SpecialInput.getClass(this.getUpdatedProps().type)
		if(!specialInputClass){
			return ""
		}

		var specialInput = React.createElement(specialInputClass, this.getSpecialProps())
		if(!specialInput){
			return ""
		}

		return specialInput
	}
	render(){
		if(this.isCommonInput()){
			return React.createElement('div',{className:  this.appearanceProtoGetClassName("div","CaretakerInput")}, (
				React.createElement('input', this.getProps())
			))
		}else{
			return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerInput")}, (
				this.renderSpecialInput()
			))
		}
	}
}

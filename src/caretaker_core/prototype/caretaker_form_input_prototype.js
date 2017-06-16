class CaretakerFormInputPrototype extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = new Caretaker.ValueNode()
		this.state = this.setInitialState(this.state) || this.state
		this.loadValue(props)
	}
	loadValue(props){
		this.latestProp = props
		this.state.value = this.getDefaultValue();
		if(props.hasOwnProperty("value")){
			var supposedValue = this.transformValueBeforeLoad(props.value)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}else if(props.hasOwnProperty("defaultValue")){
			var supposedValue = this.transformValueBeforeLoad(props.defaultValue)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}
		this.state.value = this.modifyValueAfterLoad(this.state.value) || this.state.value
		if(props.isResetting){
			this.updateParent()
		}
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.state.isValidating = props.isValidating
		this.setState(this.state)
		this.reportValidity()
	}
	reportValidity(){
		this.state.isValid = this.checkValidity(this.state.value)
		if(this.latestProps.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			this.latestProps.onReportValidity(this.state.isValid)
		}
	}
	getNegativePropKeys(){
		return ["value","values","defaultValue","onReportValidity","isValidating","isResetting","className"]
	}
	getProtoProps(){
		var props = Object.assign({}, this.latestProps)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		var removedPropKeys = this.removePropKeys()
		if(Array.isArray(removedPropKeys)){
			removedPropKeys.forEach(function(key){
				props[key] = null
				delete props[key]
			})
		}
		props = this.modifyProps(props) || props
		return props
	}
	updateParent(){
		if(this.latestProps.onChange){
			this.latestProps.onChange(this.transformValueBeforeSave(this.state.value))
		}
		this.state.validationUpdated = false
	}
	isRequired(){
		return this.latestProps.required
	}
	//extendable but not recommended
	getProps(){
		return this.getProtoProps()
	}
	//extendable
	removePropKeys(){
		return []
	}
	//extendable
	modifyProps(props){

	}
	//extendable
	transformValueBeforeLoad(value){
		return value
	}
	//extendable
	transformValueBeforeSave(value){
		return value
	}
	setInitialState(state){
		return state
	}
	//must be extended
	checkValidity(value){
		throw new Error("checkValidity is undefined")
	}
	modifyValueAfterLoad(value){
		return value
	}
	//must be extended
	getDefaultValue(){
		throw new Error("getDefaultValue is undefined")
	}
	//must be extended
	loadedValueIsValid(value){
		throw new Error("loadedValueIsValid is undefined")
	}
	//recommended to be extended
	onChange(value){
		if(this.loadedValueIsValid(value)){
			this.state.value = value
		}
		this.updateParent()
	}
	//must be extended
	render(){

	}
}

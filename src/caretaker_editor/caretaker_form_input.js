class CaretakerInput extends React.Component{
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
		this.setState(this.state)
	}
	loadValue(props){
		this.state.value = ""
		if(props.value != null){
			this.state.value = props.value
		}
	}
	checkValidity(){
		if(this.isCommonInput()){
			if(this.textInput){
				this.state.isValid = this.textInput.checkValidity()
			}else{
				this.state.isValid = false
			}
		}
	}
	onReportValidity(isValid){
		this.state.isValid = isValid == true
		this.state.validationUpdated = false
		this.reportValidity()
	}
	reportValidity(){
		if(this.props.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			this.checkValidity()
			this.props.onReportValidity(this.state.isValid)
		}

		this.setState(this.state)
	}
	getNegativeCommonPropKeys(){
		return ["options","value","isValidating","onReportValidity"]
	}
	bindInput(input){
		this.textInput = input
	}
	getProps(){
		var props = Object.assign({}, this.props)
		if(this.isCommonInput()){
			this.getNegativeCommonPropKeys().forEach(function(key){
				props[key] = null
				delete props[key]
			})
		}
		props.onChange = this.onCommonInputChange.bind(this)
		props.value = this.state.value
		props.ref = this.bindInput.bind(this)
		return props
	}
	getSpecialProps(){
		var props = Object.assign({}, this.props)
		props.onChange = this.onChange.bind(this)
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
		return props
	}
	isCommonInput(){
		return Caretaker.SpecialInput.isCommonInput(this.props.type)
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.state.validationUpdated = false
		this.setState(this.state)
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

		var specialInputClass = Caretaker.SpecialInput.getClass(this.props.type)
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
			return React.createElement('div',{className: "CaretakerInput"}, (
				React.createElement('input', this.getProps())
			))
		}else{
			return React.createElement('div',{className: "CaretakerInput"}, (
				this.renderSpecialInput()
			))
		}
	}
}

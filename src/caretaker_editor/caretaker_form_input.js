class CaretakerInput extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		if(this.isCommonInput()){
			this.state.value = ""
		}
		this.loadValue(props)
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.setState(this.state)
	}
	loadValue(props){
		if(props.value != null){
			this.state.value = props.value
		}
	}
	getNegativeCommonPropKeys(){
		return ["options","value"]
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
		return props
	}
	getSpecialProps(){
		var props = Object.assign({}, this.props)
		props.onChange = this.onChange.bind(this)
		return props
	}
	isCommonInput(){
		Caretaker.SpecialInput.isCommonInput(this.props.type)
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
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

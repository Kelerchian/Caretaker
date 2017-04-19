class CaretakerFormInputPrototype extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	loadValue(props){
		this.state.value = this.getDefaultValue();
		if(props.value != null){
			if(this.valueIsValid(props.value)){
				this.state.value = props.value
			}
		}else if(props.defaultValue != null){
			if(this.valueIsValid(props.value)){
				this.state.value = props.defaultValue
			}
		}
	}
	getNegativePropKeys(){
		return ["value","values","defaultValue"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys(function(key){
			props[key] = null
			delete props[key]
		})
		return props
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.setState(this.state)
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.setState(this.state)
	}
	//recommended to be extended
	getDefaultValue(){
		return null
	}
	valueIsValid(value){
		return true
	}
	onChange(value){
		if(this.valueIsValid(value)){
			this.state.value = value
		}
		this.updateParent()
	}
	render(){

	}
}

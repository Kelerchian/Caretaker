class CaretakerFormInputTime extends React.Component{
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
		this.setState(this.state)
	}
	loadValue(props){
		this.state.value = ""
		if(props.value != null){
			var newValue = moment(props.value,"HH:mm:ss")
			if(newValue.isValid()){
				this.state.value = newValue
			}
		}else if(props.defaultValue != null){
			var newValue = moment(props.defaultValue,"HH:mm:ss")
			if(newValue.isValid()){
				this.state.value = newValue
			}
		}
	}
	updateParent(){
		if(this.props.onChange){
			if(this.state.value){
				this.props.onChange(this.state.value.format("HH:mm:ss"))
			}else{
				this.props.onChange("")
			}
		}
		this.setState(this.state)
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onFocus(){
		Caretaker.Widget.callTimeInputWidget(this.onChange.bind(this), this.state.value)
	}
	getNegativePropKeys(){
		return ["type","values","value"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
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

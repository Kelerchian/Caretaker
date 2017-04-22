class CaretakerFormInputTextarea extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.state.value = ""
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
			this.state.value = props.value
		}
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.setState(this.state)
	}
	onChange(event){
		this.state.value = event.target.value
		this.updateParent()
	}
	getNegativePropKeys(){
		return ["type"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.onChange.bind(this)
		props.value = this.state.value
		return props
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

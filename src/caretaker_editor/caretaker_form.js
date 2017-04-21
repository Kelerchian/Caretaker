class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			value: props.value
		}
	}
	onChange(value){
		this.state.value = value
		this.setState(this.state)
	}
	onReset(){
		this.state.value = this.props.value
		this.setState(this.state)
	}
	onSubmit(){
		console.log("submitting:", this.state.value)
	}
	getProps(){
		var props = Object.assign({}, this.props.edit)
		props.onChange = this.onChange.bind(this)
		props.value = this.state.value
		props.key = "object"
		return props
	}
	appearanceGetActions(){
		var actions = []

		actions.push(React.createElement('button',{type:"button", key:"submit", onClick: this.onSubmit.bind(this) , className:"CaretakerButton CaretakerPositiveButton"}, [React.createElement('i',{key:"icon",className:"fa fa-check"}), "Save"]))
		if(this.props.resettable){
			actions.push(React.createElement('button',{type:"button", key:"reset", onClick: this.onReset.bind(this), className:"CaretakerButton CaretakerBlueButton"}, [React.createElement('i',{key:"icon",className:"fa fa-undo"}), "Reset"]))
		}

		return React.createElement('div', {className: "CaretakerFormActions", key:"actions"}, actions)
	}
	render(){
		var props = this.getProps()
		return React.createElement('form', {className: "CaretakerForm", encType:"multipart/form-data"}, (
			[React.createElement(CaretakerFormObject, props), this.appearanceGetActions()]
		))
	}
}

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
	getProps(){
		var props = Object.assign({}, this.props.edit)
		props.onChange = this.onChange.bind(this)
		props.value = this.state.value
		return props
	}
	render(){
		var props = this.getProps()
		return React.createElement('form', {className: "CaretakerForm", encType:"multipart/form-data"}, (
			React.createElement(CaretakerFormObject, props)
		))
	}
}

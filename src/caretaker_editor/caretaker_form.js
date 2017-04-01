class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.state.value = null
	}
	onChange(value){
		this.state.value = value
		this.setState(this.state)
	}
	render(){
		var props = Object.assign({}, this.props.edit)
		props.onChange = this.onChange.bind(this)
		props.value = this.state.value
		return React.createElement('form', {className: "CaretakerForm"}, (
			React.createElement(CaretakerFormObject, props)
		))
	}
}

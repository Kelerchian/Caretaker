class CaretakerInput extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		if(this.isCommonInput()){
			this.state.value = ""
		}
	}
	getNegativeCommonPropKeys(){
		return ["options"]
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
		return props
	}
	getSpecialProps(){
		var props = Object.assign({}, this.props)
		props.onChange = this.onChange.bind(this)
		return props
	}
	isCommonInput(){
		switch (this.props.type) {
			//need time interface
			case "time"											:
			case "date"											:
			case "week"											:
			//need options
			case "select"										:
			case "select-multiple"					:
			case "checkbox"									:
			case "textarea"									:
			case "radio"										:
			//need select interface
			case "select-object"						:
			case "select-object-multiple"		:	return false;
			default: return true;
		}
	}
	updateParent(){
		this.setState(this.state)
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
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
		switch (this.props.type) {
			//need time interface
			case "time"											: break;
			case "date"											: break;
			case "week"											: break;
			//need options
			case "select"										: break;
			case "select-multiple"					: break;
			case "checkbox"									: return React.createElement(CaretakerFormInputCheckBox, this.getSpecialProps()); break;
			case "textarea"									: break;
			case "radio"										:	 break;
			//need select interface
			case "select-object"						: break;
			case "select-object-multiple"		:	return false; break;
		}
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

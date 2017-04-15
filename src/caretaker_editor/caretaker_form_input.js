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
		switch (this.props.type) {
			//need time interface
			case "time"											: return false;
			case "date"											: return false;
			case "week"											: return true; //not implemented
			//need options
			case "select"										: return false;
			case "select-multiple"					: return true;
			case "checkbox"									: return false;
			case "textarea"									:
			case "textarea-text"						: return false;
			case "textarea-html"						: return false;
			case "radio"										: return false;
			//need select interface
			case "select-object"						: return false;
			case "select-object-multiple"		: return false;
			//special treatment
			case "file"											: return false;
			default: return true;
		}
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
		switch (this.props.type) {
			//need time interface
			case "time"											: return React.createElement(CaretakerFormInputTime, this.getSpecialProps()); break;
			case "date"											: return React.createElement(CaretakerFormInputDate, this.getSpecialProps()); break;
			case "week"											: break;
			//need options
			case "select"										: return React.createElement(CaretakerFormInputSelect, this.getSpecialProps()); break;
			case "select-multiple"					: break;
			case "checkbox"									: return React.createElement(CaretakerFormInputCheckbox, this.getSpecialProps()); break;
			case "textarea"									:
			case "textarea-text"						: return React.createElement(CaretakerFormInputTextarea, this.getSpecialProps()); break;
			case "textarea-html"						: return React.createElement(CaretakerFormInputTextareaHTML, this.getSpecialProps()); break;
			case "radio"										:	return React.createElement(CaretakerFormInputRadio, this.getSpecialProps()); break;
			//need select interface
			case "select-object"						: break;
			case "select-object-multiple"		:	break;
			//special treatment
			case "file"											: return React.createElement(CaretakerFormInputFile, this.getSpecialProps()); break;
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

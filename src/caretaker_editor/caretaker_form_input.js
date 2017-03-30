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
		var props = Object.assign({},props)
		if(this.isCommonInput()){
			this.getNegativeCommonPropKeys().forEach(function(key){
				props[key] = null
				delete props[key]
			})
		}
		return props
	}
	isCommonInput(){
		switch(this.props.type){
			//need time interface
			case "time"							:
			case "date"							:
			case "week"							:
			//need options
			case "select"						:
			case "select-multiple"	:
			case "checkbox"					:
			case "textarea"					:
			case "radio"						:
			//need select interface
			case "select-object"		:	return false; break;
			default					: return true; break;
			// Other includes:
			// ["text","password","submit","reset","button","color","email","range","search","tel","url","number"]
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
			case "time"							:
			case "date"							:
			case "week"							:
			//need options
			case "select"						:
			case "select-multiple"	:
			case "checkbox"					:
			case "textarea"					:
			case "radio"						:
			//need select interface
			case "select-object"		:	return false; break;
			default					: return true; break;
		}
	}
	render(){
		var props = this.getProps()
		if(this.isCommonInput()){
			props.onChange = this.onCommonInputChange.bind(this)
			return React.createElement('div',{className: "CaretakerInput"}, (
				React.createElement('input', props)
			))
		}else{
			return React.createElement('div',{className: "CaretakerInput"}, (
				this.renderSpecialInput()
			))
		}
	}
}

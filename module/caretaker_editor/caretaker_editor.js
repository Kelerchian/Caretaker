
class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		if(this.isEditOne() && this.isEditMany()){
			throw
		}else if(this.isEditOne()){

		}
	}
	isEditOne(){
		return !!this.props.editOne
	}
	isEditMany(){
		return !!this.props.editMany
	}
	render(){
		var fields = props.fields || []
		var attributes = Object.assign({}, props.attributes || {})
		var html = []
		fields.map(function(inputProperties, index){
			var props = Object.assign({}, inputProperties)
			props.key = index

			html.push(React.createElement(CaretakerInput))
		})
		attributes.className = (attributes.className || "") + " CaretakerForm"

		return React.createElement('form', {className: "CaretakerForm"}, html)
	}
}

class CaretakerObject extends React.createElement{
	constructor(props){
		super(props)

		this.state = {}
		if(this.isMany()){
			this.state.value = []
			if(this.props.min && this.props.max ){
				if(this.props.min < 0 || this.props.max < 0){
					throw "minimum or maximum count of childObject cannot be less than 0"
				}
				if(this.props.min > this.props.max){
					throw "minimum count of childObject cannot be more than maximum count"
				}
			}
			this.state.count = this.props.min || (this.props.max > 1 ? 1 : 0)
		}
		else if(this.isObject()){
			this.state.value = {}
		}else{
			this.state.value = null
		}
	}
	getValue(){
		return this.state.value
	}
	getOnChangeListener(){
		return this.onChange.bind(this)
	}
	isMany(){
		return this.props.quantity == "many"
	}
	isObject(){
		return this.props.type == "object"
	}
	onChange(value, name){
		if(!this.isObject()){
			this.state.value = value
		}else{
			this.state.value[name] = value
		}
		if(this.props.onChange && this.props.name){
			this.props.onChange(this.state.value, this.props.name)
		}
	}
	getNegativeChildPropKeys(){
		return ["label","description","quantity","max","min","options"]
	}
	getNegativeInputPropKeys(){
		return ["label","description","quantity","max","min","has"]
	}
	getInputProps(){
		var props = Object.assign({}, this.props)
		this.getNegativeInputPropKeys().forEach(function(prop){
			if(props[prop]){
				props[prop] = null
				delete props[prop]
			}
		})
		return props
	}
	getChildProp(){
		var props = Object.assign({}, this.props)
		this.getNegativeChildPropKeys().forEach(function(prop){
			if(prosp[prop]){
				props[prop] = null
				delete props[prop]
			}
		})
		return props
	}
	appearanceGetLabel(){
		if(this.props.label){
			if(this.isObject()){
				return React.createElement('h5', {key:"label"}, this.props.label)
			}else{
				return React.createElement('label', {htmlFor: this.props.name, key:"label"}, this.props.label)
			}
		}
		return false
	}
	appearanceGetDescription(){
		if(this.props.description){
			return React.createElement('p', {key:"description"}, (
				React.createElement('small',{},this.props.description)
			))
		}
		return false;
	}
	appearanceGetObject(){
		if(this.isMany()){
			var objects = []
			for(var i = 0; i < this.state.count; i++){
				var props = this.childProps()
				props.key = i
				props.name = i
				props.onChange = this.getOnChangeListener()
				objects.push( React.createElement(CaretakerObject,props) )
			}
			return React.createElement('div',{className:"CaretakerObjectCollection", "key":"object"}, objects)
		}else if(this.isObject()){
			var objects = []
			if(this.props.has){
				for(var i in has){
					var childProps = Object.assign({},has[i])
					childProps.name = i
					childProps.onChange = this.getOnChangeListener()
					object.push( React,createElement(CaretakerObject, childProps) )
				}
			}
			return React.createElement('div',{className:"CaretakerObjectCollection", "key":"object"}, objects)
		}else{
			var props = this.getInputProps()
			props.onChange = this.getOnChangeListener()
			return React.createElement(CaretakerInput,props)
		}
	}
	appearanceGetInsideObjectContainer(){
		var insideObjectContainer = []

		var label = this.appearanceGetLabel();
		var description = this.appearanceGetDescription()
		var object = this.appearanceGetObject();

		if(label){ insideObjectContainer.push(label) }
		if(description){ insideObjectContainer.push(description) }
		if(object){ insideObjectContainer.push(object) }

		return insideObjectContainer
	}
	render(){
		var props = {}
		props.className = "ObjectContainer " + this.props.name
		return React.createElement('div',{ className:'ObjectContainer' }, this.appearanceGetinsideObjectContainer())
	}
}

class CaretakerInput extends React.Component{
	constructor(props){
		super(props)
		if(this.isCommonInput()){
			this.state.value = ""
		}
	}
	getProps(props){
		return Object.assign({},props)
	}
	onCommonInputChange(){

	}
	isCommonInput(){
		switch(this.props.type){
			//need time interface
			case "time"			:
			case "date"			:
			case "week"			:
			//need options
			case "select"		:
			case "select-multiple"		:
			case "checkbox"	:
			case "textarea"	:
			case "radio"		: return false; break;
			default					: return true; break;
			// Other includes:
			// ["text","password","submit","reset","button","color","email","range","search","tel","url","number"]
		}
	}
	onChange(event){
		this.state.value = event.target.value
	}
	renderSpecialInput(){
		switch (this.props.type) {
			//need time interface
			case "time"						: return; break;
			case "date"						: return; break;
			case "week"						: return; break;
			//need options
			case "select"					: return; break;
			case "select-multiple": return; break;
			case "checkbox"				: return; break;
			case "textarea"				: return; break;
			case "radio"					: return; break;
		}
	}
	render(){
		var props = this.getProps()
		props.onChange = this.onCommonInputChange.bind(this)
		if(this.isCommonInput()){
			return React.createElement('div',{className: "CaretakerInput"}, (
				React.createElement('input', props)
			)}
		}else{
			return React.createElement('div',{className: "CaretakerInput"}, (
				this.renderSpecialInput()
			))
		}
	}
}

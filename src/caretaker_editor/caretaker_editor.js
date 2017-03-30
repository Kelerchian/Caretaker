
class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.state.value = null
	}
	onChange(value){
		this.state.value = value
	}
	render(){
		var props = Object.assign({}, this.props.edit)
		props.onChange = this.onChange.bind(this)
		return React.createElement('form', {className: "CaretakerForm"}, (
			React.createElement(CaretakerFormObject, props)
		))
	}
}

class CaretakerFormObject extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		if(this.isMany()){
			this.state.value = []
		}
		else if(this.isObject()){
			this.state.value = {}
		}else{
			this.state.value = null
		}
	}
	isMany(){
		return this.props.quantity == "many"
	}
	isObject(){
		return this.props.type == "object"
	}
	onChange(value, name){
		if(name){
			this.state.value[name] = value
		}else{
			this.state.value = value
		}
		if(this.props.onChange){
			this.props.onChange(this.state.value, this.props.name)
		}
	}
	getValue(){
		return this.state.value
	}
	getOnChangeListener(){
		return this.onChange.bind(this)
	}
	getNegativeChildPropKeys(){
		return ["label","description","quantity","options"]
	}
	getNegativeInputPropKeys(){
		return ["label","description","quantity","has"]
	}
	getInputProps(){
		var props = Object.assign({}, this.props)
		this.getNegativeInputPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.getOnChangeListener()
		return props
	}
	getCollectionProps(){
		var props = Object.assign({}, this.props)
		this.getNegativeChildPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.getOnChangeListener()
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
			var props = this.getCollectionProps()
			props.key = "object"
			return React.createElement(CaretakerFormObjectCollection, props)
		}else if(this.isObject()){
			var objects = []
			if(this.props.has){
				var has = this.props.has
				for(var i in has){
					var childProps = Object.assign({},has[i])
					childProps.key = i
					childProps.name = i
					if(has[i].name){
						childProps.name = has[i].name
					}
					childProps.onChange = this.getOnChangeListener()
					objects.push( React.createElement(CaretakerFormObject, childProps) )
				}
			}
			return React.createElement('div',{className:"CaretakerFormObject", "key":"object"}, objects)
		}else{
			var props = this.getInputProps()
			props.key = "object"
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
		props.className = "CaretakerFormObject " + (this.props.name ? this.props.name : "")
		return React.createElement('div',props, this.appearanceGetInsideObjectContainer())
	}
}

class CaretakerFormObjectCollection extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.state.maxCount = props.max || Infinity
		this.state.minCount = props.min || 0
		console.log()
		if(this.state.maxCount < 1){ throw "max count of multiple object cannot be fewer than 1" }
		if(this.state.minCount < 0){ throw "min count of multiple object cannot be fewer than 0" }
		if(this.state.maxCount < this.state.minCount ){ throw "max count cannot be fewer than min count" }
		this.state.childrenCount = this.state.minCount || 1
		this.state.value = []
	}
	getNegativeChildPropKeys(){
		return ["min","max"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativeChildPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.onChange.bind(this)
		return props
	}
	updateParent(){
		this.setState(this.state)
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	onChange(value,name){
		this.state.value[name] = value
		this.updateParent()
	}
	onRemoveChild(i){
		if(this.state.childrenCount > this.state.minCount){
			this.state.value.splice(i,1)
			this.state.childrenCount--
			this.updateParent()
		}
	}
	onAddChild(){
		if(this.state.childrenCount < this.state.maxCount){
			this.state.childrenCount++
			this.updateParent()
		}
	}
	appearanceGetControl(){
		return React.createElement('div',{className:"CaretakerFormObjectCollectionControl", key:"control"}, (
			React.createElement('button',{className:"CaretakerFormObjectCollectionAdd", "type":"button", onClick:this.onAddChild.bind(this)}, "Add New")
		))
	}
	appearanceGetChildren(){
		var children = ""
		for(var i = 0; i<this.state.childrenCount; i++){
			if(i == 0){
				children = []
			}
			var props = this.getProps()
			props.name = i
			props.key = i+"-child"
			if(this.state.value[i]){
				props.value = this.state.value[i]
			}
			children.push( React.createElement('div', { className: "CaretakerFormObjectContainer", key: i}, [
				React.createElement('button', { onClick:this.onRemoveChild.bind(this,i), name:i, type:"button" , key:i+"-delete-button" }, "delete"),
				React.createElement(CaretakerFormObject, props)
			]) )
		}
		return React.createElement('div',{className:"CaretakerFormObjectCollectionChildren", key:"children"}, children);
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormObjectCollection"}, [this.appearanceGetControl(), this.appearanceGetChildren()] )
	}
}

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

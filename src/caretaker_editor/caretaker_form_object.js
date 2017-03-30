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

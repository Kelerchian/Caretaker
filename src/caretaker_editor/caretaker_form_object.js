class CaretakerFormObject extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.setState(this.state)
	}
	assertValues(){
		if(this.isMany() && !(Array.isArray(this.state.value) || this.state.value == null)){
			throw "Value for manyObjects must be an array"
		}else if(this.isObject() && !(typeof this.state.value == "object" || this.state.value == null)){
			throw "Value for Object must be an object"
		}
	}
	loadValue(props){

		if(this.isMany()){
			this.state.value = []
			this.state.name = "arr"
		}
		else if(this.isObject()){
			this.state.value = {}
			this.state.name = "obj"
		}else{
			this.state.value = null
			this.state.name = "val"
		}

		if(props.value != null){
			this.state.value = props.value
		}else if(props.defaultValue != null){
			this.state.value = props.defaultValue
		}

		if(props.name != null){
			this.state.name = props.name
		}
		this.assertValues()
	}
	isMany(){
		return this.props.quantity == "many"
	}
	isObject(){
		return this.props.type == "object" || this.props.type == null
	}
	isInput(){
		return !this.isObject() && !this.isMany()
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value, this.state.name)
		}
		this.setState(this.state)
	}
	onChange(value, name){
		if(name != null){
			this.state.value[name] = value
		}else{
			this.state.value = value
		}
		this.updateParent()
	}
	getOnChangeListener(){
		return this.onChange.bind(this)
	}
	getNegativeChildPropKeys(){
		return ["label","description","quantity"]
	}
	getNegativeInputPropKeys(){
		return ["label","description","quantity","has","defaultValue"]
	}
	getInputProps(){
		var props = Object.assign({}, this.props)
		this.getNegativeInputPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.getOnChangeListener()
		props.value = this.state.value
		return props
	}
	getCollectionProps(){
		var props = Object.assign({}, this.props)
		this.getNegativeChildPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.getOnChangeListener()
		props.value = this.state.value
		return props
	}
	appearanceGetLabel(){
		return React.createElement('label', {className:"CaretakerLabel", htmlFor: this.state.name, key:"label"}, this.props.label)
	}
	appearanceGetDescription(){
		if(this.props.description){
			return React.createElement('p', {className:"CaretakerDescription",key:"description"}, (
				this.props.description
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
					if(this.state.value[i] != null){
						childProps.value = this.state.value[i]
					}
					if(has[i].name != null){
						childProps.name = has[i].name
						if(this.state.value[childProps.name]){
							childProps.value = this.state.value[childProps.name]
						}
					}
					childProps.onChange = this.getOnChangeListener()
					objects.push( React.createElement(CaretakerFormObject, childProps) )
				}
			}
			return objects
		}else{
			var props = this.getInputProps()
			props.key = "object"
			props.value = this.state.value
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
		props.className = "CaretakerFormObject " + (this.state.name ? this.state.name : "") + (this.isInput() ? " CaretakerInputContainer":"")
		return React.createElement('div',props, this.appearanceGetInsideObjectContainer())
	}
}

class CaretakerFormObject extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	onReportValidity(isValid, name){
		if(this.isObject() && !this.isMany() && !this.isChildless()){
			//if validity node is null or not an object, make new validity node
			if(typeof this.state.isValid != "object" || this.state.isValid == null){
				this.state.isValid = {}
				if(typeof this.props.has == "object"){
					for(var i in this.props.has){
						this.state.isValid[i] = false
					}
				}
			}

			this.state.isValid[name] = isValid
		}else{
			this.state.isValid = isValid
		}
		this.reportValidity()
	}
	reportValidity(){
		if(this.props.onReportValidity && this.state.isValidating){
			if(this.isObject() && !this.isMany()){
				var isValid = true
				for(var i in this.state.isValid){
					if(this.state.isValid[i] == false){
						isValid = false
						break
					}
				}
				this.props.onReportValidity(isValid, this.props.name)
			}else{
				this.props.onReportValidity(this.state.isValid, this.props.name)
			}
		}
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.state.isValidating = props.isValidating
		this.setState(this.state)
		if(this.isChildless()){
			this.onReportValidity(true)
		}
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
	isChildless(){
		return this.isObject() && (this.props.has == null || (typeof this.props.has == "object" && Object.keys(this.props.has).length == 0 ))
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
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
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
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
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
					childProps.onReportValidity = this.onReportValidity.bind(this)
					childProps.isValidating = this.state.isValidating
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
	appearanceGetValidClassname(){
		if(this.state.isValid != null){
			if(this.state.isValid == true){
				return " valid"
			}else{
				return " invalid"
			}
		}
		return ""
	}
	render(){
		var props = {}
		props.className = "CaretakerFormObject"
		props.className += (this.state.name ? " "+this.state.name : "")
		props.className += (this.isInput() ? " CaretakerInputContainer":"")
		props.className += this.appearanceGetValidClassname()
		return React.createElement('div',props, this.appearanceGetInsideObjectContainer())
	}
}

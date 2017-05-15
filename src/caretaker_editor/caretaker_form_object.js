class CaretakerFormObject extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	onReportValidity(isValid, name){
		this.state.validationUpdated = false
		if(this.isObject() && !this.isMany() && !this.isChildless()){
			//if validity node is null or not an object, make new validity node
			if(typeof this.state.isValidMap != "object" || this.state.isValidMap == null){
				this.state.isValidMap = {}
				if(typeof this.props.has == "object" && this.props.has != null){
					var has = this.props.has
					for(var i in has){
						var currentName = has[i].name
						if(!currentName){
							currentName = i
						}
						this.state.isValidMap[currentName] = false
					}
				}
			}
			this.state.isValidMap[name] = isValid
		}else{
			this.state.isValid = isValid
		}
		this.reportValidity()
	}
	reportValidity(){
		if(this.props.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			if(this.isObject() && !this.isMany() && !this.isChildless()){
				var isValid = true
				if(typeof this.props.has == "object" && this.props.has){
					var has = this.props.has
					for(var i in has){
						var name = has[i].name
						if(!name){
							name = i
						}
						if(this.state.isValidMap[name] != true){
							isValid = false
							break
						}
					}
				}
				this.state.isValid = isValid
				this.props.onReportValidity(this.state.isValid, this.props.name)
			}else{
				this.props.onReportValidity(this.state.isValid, this.props.name)
			}
			// this.setState(this.state)
		}
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.state.isValidating = props.isValidating
		// this.setState(this.state)
		if(this.isChildless()){
			this.state.isValid = true
			this.reportValidity()
		}
	}
	assertValues(){
		if(this.isMany() && !(Array.isArray(this.state.value) || this.state.value == null)){
			throw "Value for manyObjects must be an array"
		}else if(this.isObject() && !(typeof this.state.value == "object" || this.state.value == null)){
			throw "Value for Object must be an object"
		}
	}
	loadValueConversion(possibleValue){
		if(Array.isArray(possibleValue)){
			this.state.value = Caretaker.ValueArray.from(possibleValue)
		}else if(typeof possibleValue == "object" && possibleValue.__proto__.constructor == Object && possibleValue){
			this.state.value = Caretaker.ValueNode.from(possibleValue)
		}else{
			this.state.value = possibleValue
		}
	}
	loadValue(props){
		if(this.isMany()){
			this.state.value = new Caretaker.ValueArray()
			this.state.name = "arr"
		}
		else if(this.isObject()){
			this.state.value = new Caretaker.ValueNode()
			this.state.name = "obj"
		}else{
			this.state.value = null
			this.state.name = "val"
		}
		//update name
		if(props.name != null){
			this.state.name = props.name
		}
		//update value
		if(props.value != null){
			this.loadValueConversion(props.value)
		}else if(props.defaultValue != null){
			this.loadValueConversion(props.defaultValue)
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
		this.state.validationUpdated = false
		if(this.props.onChange){
			this.props.onChange(this.state.value, this.state.name)
		}
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
		return React.createElement('label', {className: this.appearanceProtoGetClassName("label", "CaretakerLabel"), htmlFor: this.state.name, key:"label"}, this.props.label)
	}
	appearanceGetDescription(){
		if(this.props.description){
			return React.createElement('p', {className: this.appearanceProtoGetClassName("p", "CaretakerDescription"),key:"description"}, (
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
						if(this.state.value[childProps.name] != null){
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
	appearanceGetErrorMessage(){
		if(typeof this.state.isValid == "string"){
			return React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerErrorMessage"), key:"errorMessage"}, this.state.isValid)
		}else if (Array.isArray(this.state.isValid) && this.state.isValid.length > 0){
			if(this.state.isValid.length == 1){
				return React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerErrorMessage"), key:"errorMessage"}, this.state.isValid[0])
			}else if(this.state.isValid.length > 1){
				return React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerErrorMessage"), key:"errorMessage"}, (
					React.createElement('ul', {}, (function(){
						var lis = []
						for(var i in this.state.isValid){
							var message = this.state.isValid[i]
							lis.push(React.createElement('li',{key:i}, message))
						}
					}()))
				))
			}
		}
	}
	appearanceGetInsideObjectContainer(){
		var insideObjectContainer = []

		var label = this.appearanceGetLabel();
		var description = this.appearanceGetDescription()
		var errorMessages = this.appearanceGetErrorMessage()
		var object = this.appearanceGetObject();

		if(label){ insideObjectContainer.push(label) }
		if(description){ insideObjectContainer.push(description) }
		if(errorMessages){ insideObjectContainer.push(errorMessages) }
		if(object){ insideObjectContainer.push(object) }

		return insideObjectContainer
	}
	appearanceGetValidClassname(){
		if(this.state.isValid != null){
			if(this.state.isValid == true){
				return this.appearanceProtoGetClassName("valid")
			}else{
				return this.appearanceProtoGetClassName("invalid")
			}
		}
		return ""
	}
	render(){
		var props = {}
		props.className = this.appearanceProtoGetClassName("div", "CaretakerFormObject")
		props.className += (this.state.name ? this.appearanceProtoGetClassName(null, this.state.name) : "")
		props.className += (this.isInput() ? this.appearanceProtoGetClassName(null, "CaretakerInputContainer") : "")
		props.className += this.appearanceGetValidClassname()
		return React.createElement(
			'div',
			props,
			this.appearanceGetInsideObjectContainer())
	}
}

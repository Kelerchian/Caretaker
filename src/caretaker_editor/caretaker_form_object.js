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
				if(typeof this.getUpdatedProps().has == "object" && this.getUpdatedProps().has != null){
					var has = this.getUpdatedProps().has
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
	createValueCopy(){
		return Array.isArray(this.state.value) ? Array.from(this.state.value) : typeof this.state.value == "object" ? Object.assign({}, this.state.value) : this.state.value
	}
	reportValidity(){
		if(this.getUpdatedProps().onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			if(this.isObject() && !this.isMany() && !this.isChildless()){
				var isValid = true
				if(typeof this.getUpdatedProps().has == "object" && this.getUpdatedProps().has){
					var has = this.getUpdatedProps().has
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
			}

			if(typeof this.getUpdatedProps().validate == "function"){
				var tempValid = Array.isArray(this.state.isValid) || this.state.isValid == true ? this.state.isValid : [this.state.isValid]
				var newValid
				try{
					var copyValue = this.createValueCopy()
					newValid = this.getUpdatedProps().validate(copyValue, tempValid)
				}catch(throwable){
					if(throwable instanceof Error){
						console.error("Something happened while validating", throwable)
					}else{
						newValid = throwable
					}
				}
				if(typeof newValid == "string" || Array.isArray(newValid) || newValid === true || newValid === false ){
					this.state.isValid = newValid
				}
			}

			this.getUpdatedProps().onReportValidity(this.state.isValid, this.getUpdatedProps().name)
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
		this.updateProps(props)
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
		//update name;
		if(props.name != null){
			this.state.name = props.name
		}else{
			throw new Error("This object scheme doesn't have name attribute:\n"+JSON.stringify(props,null,2))
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
		return this.getUpdatedProps().quantity == "many"
	}
	isObject(){
		return this.getUpdatedProps().type == "object" || this.getUpdatedProps().type == null
	}
	isInput(){
		return !this.isObject() && !this.isMany()
	}
	isChildless(){
		return this.isObject() && (this.getUpdatedProps().has == null || (typeof this.getUpdatedProps().has == "object" && Object.keys(this.getUpdatedProps().has).length == 0 ))
	}
	updateParent(){
		this.state.validationUpdated = false
		if(this.getUpdatedProps().onChange){
			this.getUpdatedProps().onChange(this.state.value, this.state.name)
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
		return ["label","description","htmlLabel","htmlDescription","quantity"]
	}
	getNegativeInputPropKeys(){
		return ["label","description","htmlLabel","htmlDescription","quantity","has","defaultValue","validate","supplements"]
	}
	getInputProps(){
		var props = Object.assign({}, this.getUpdatedProps())
		this.getNegativeInputPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.getOnChangeListener()
		props.onReportValidity = this.onReportValidity.bind(this);
		props.isValidating = this.state.isValidating
		props.value = this.state.value
		return props
	}
	getCollectionProps(){
		var props = Object.assign({}, this.getUpdatedProps())
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
		if(this.getUpdatedProps().htmlLabel && typeof this.getUpdatedProps().htmlLabel == "string"){
			return React.createElement('label',
				{
					className: this.appearanceProtoGetClassName("label", "CaretakerLabel"),
					htmlFor: this.state.name,
					key:"label",
					dangerouslySetInnerHTML: {__html:this.getUpdatedProps().htmlLabel}
				}
			)
		}else if(this.getUpdatedProps().label){
			return React.createElement('label',
				{
					className: this.appearanceProtoGetClassName("label", "CaretakerLabel"),
					htmlFor: this.state.name,
					key:"label"
				},
				this.getUpdatedProps().label
			)
		}
		return false
	}
	appearanceGetDescription(){
		if(this.getUpdatedProps().htmlDescription){
			return React.createElement('p',
				{
					className: this.appearanceProtoGetClassName("p", "CaretakerDescription"),
					key:"description",
					dangerouslySetInnerHTML: {__html:this.getUpdatedProps().htmlDescription}
				}
			)
		}else if(this.getUpdatedProps().description){
			return React.createElement('p',
				{
					className: this.appearanceProtoGetClassName("p", "CaretakerDescription"),
					key:"description"
				},
				this.getUpdatedProps().description
			)
		}
		return false;
	}
	createSupplementMap(){

		var map = {}
		var after = []
		var before = []
		var prepareMapKey = function(key){
			if(!Array.isArray(map[key])){
				map[key] = []
			}
		}
		if(Array.isArray(this.getUpdatedProps().supplements)){
			var copyValue = this.createValueCopy()
			for(var i in this.getUpdatedProps().supplements){
				var supplement = this.getUpdatedProps().supplements[i]
				if(supplement.condition){
					var supplementConditionFunction = (new Function('value','return '+supplement.condition))
					try{
						var value = this.createValueCopy()
						var conditionMet = supplementConditionFunction(value)
						if(conditionMet && supplement.model){
							if(supplement.pushAfter){
								var pushAfterKey = supplement.pushAfter
								prepareMapKey(pushAfterKey)
								map[pushAfterKey].push(supplement.model)
							}else if(supplement.pushFirst === true){
								before.push(supplement.model)
							}else{
								after.push(supplement.model)
							}
						}
					}catch(e){
						console.error(e)
					}
				}else{
					console.error(new Error("This supplement object should have 'condition' parameter: " + JSON.stringify(supplement)))
				}
			}
		}else if(typeof this.getUpdatedProps().supplements == "function"){
			var pushAfter = function(key, model){
				prepareMapKey(key)
				map[key].push(model)
			}
			var pushFirst = function(model){
				before.push(model)
			}
			var pushLast = function(model){
				after.push(model)
			}

			try{
				this.getUpdatedProps().supplements(
					Object.assign({},this.state.value),
					{pushFirst: pushFirst, pushLast: pushLast, pushAfter: pushAfter}
				)
			}catch(e){  console.error(e)  }
		}


		return {
			after: after,
			map: map,
			before: before
		}
	}
	createHasProps(base, others){
		var props = Object.assign({}, base)
		props = Object.assign(props, others)
		return props
	}
	createChildProps(childType, base){
		var props = Object.assign({}, base)
		var name = base.name
		if(name == null){
			throw new Error("This object scheme doesn't have name attribute:\n"+JSON.stringify(base,null,2))
		}
		props.key = childType+"-"+name
		if(this.state.value[name] != null){
			props.value = this.state.value[name]
		}
		props.onChange = this.getOnChangeListener()
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
		return props;

	}
	appearanceGetObject(){
		if(this.isMany()){
			// Many Object
			var props = this.getCollectionProps()
			props.key = "object"
			return React.createElement(CaretakerFormObjectCollection, props)
		}else if(this.isObject()){
			// Single Object
			var mappedSupplementParameter = this.createSupplementMap()

			var objects = []
			// "Before" Supplement Object
			for(var i in mappedSupplementParameter.before){
				objects.push(React.createElement(CaretakerFormObject, this.createChildProps("before",mappedSupplementParameter.before[i])))
			}

			if(this.getUpdatedProps().has){
				var has = this.getUpdatedProps().has
				// Spawn Object
				for(var i in has){
					var childProps = this.createChildProps("has",has[i])
					objects.push( React.createElement(CaretakerFormObject, childProps) )

					// Child-bound Supplement Object
					for(var j in mappedSupplementParameter.map[has[i].name]){
						objects.push( React.createElement(CaretakerFormObject, this.createChildProps("after-"+has[i].name, mappedSupplementParameter.map[has[i].name][j] )))
					}
				}
			}
			// "After" Supplement Object
			for(var i in mappedSupplementParameter.after){
				objects.push(React.createElement(CaretakerFormObject, this.createChildProps("after", mappedSupplementParameter.after[i])))
			}
			return objects
		}else{
			// Input Object
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
					React.createElement('ul', {}, (function(validityList){
						var lis = []
						for(var i in validityList){
							var message = validityList[i]
							lis.push(React.createElement('li',{key:i}, message))
						}
						return lis
					}(this.state.isValid)))
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
		props.className += (this.state.name ? this.appearanceProtoGetClassName(null, this.state.name || "") : "")
		props.className += (this.isInput() ? this.appearanceProtoGetClassName(null, "CaretakerInputContainer") : "")
		props.className += this.appearanceGetValidClassname()
		return React.createElement(
			'div',
			props,
			this.appearanceGetInsideObjectContainer())
	}
}

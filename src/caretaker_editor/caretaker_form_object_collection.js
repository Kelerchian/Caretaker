class CaretakerFormObjectCollection extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = {}
		this.state.maxCount = props.max || Infinity
		this.state.minCount = props.min || 0
		if(this.state.maxCount < 1){ throw "max count of multiple object cannot be fewer than 1" }
		if(this.state.minCount < 0){ throw "min count of multiple object cannot be fewer than 0" }
		if(this.state.maxCount < this.state.minCount ){ throw "max count cannot be fewer than min count" }
		this.state.value = new Caretaker.ValueArray()
		this.state.isValidMap = []
		this.loadValue(props)
		this.state.childrenCount = this.state.value.count || this.state.minCount || 1
	}
	onReportValidity(isValid, name){
		this.state.isValidMap[name] = isValid
		this.state.validationUpdated = false
		this.reportValidity()
	}
	reportValidity(){
		if(this.getUpdatedProps().onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			if(this.isChildless()){
				this.getUpdatedProps().onReportValidity(this.getUpdatedProps().required != true)
			}else{
				var isValid = true
				for(var i = 0; i<this.state.childrenCount; i++){
					if(this.state.isValidMap[i] != true){
						isValid = false
						break;
					}
				}
				this.getUpdatedProps().onReportValidity(isValid)
			}
		}
		this.setState(this.state)
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.state.isValidating = props.isValidating
		this.setState(this.state)
		this.reportValidity()
	}
	loadValue(props){
		this.updateProps(props)
		if(props.value){
			this.state.value = props.value
		}
	}
	getNegativeChildPropKeys(){
		return ["min","max","value","quantity","validate"]
	}
	getProps(){
		var props = Object.assign({}, this.getUpdatedProps())
		this.getNegativeChildPropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.onChange.bind(this)
		props.onReportValidity = this.onReportValidity.bind(this)
		return props
	}
	updateParent(){
		this.state.validationUpdated = false
		if(this.getUpdatedProps().onChange){
			this.getUpdatedProps().onChange(this.state.value)
		}
		this.setState(this.state)
	}
	isChildless(){
		return this.state.value.length == 0
	}
	onChange(value,name){
		this.state.value[name] = value
		this.updateParent()
	}
	onRemoveChild(i){
		if(this.state.childrenCount > this.state.minCount){
			this.state.value.splice(i,1)
			this.state.isValidMap.splice(i,1)
			this.state.childrenCount--
			this.updateParent()
		}
	}
	onAddChild(){
		if(this.state.childrenCount < this.state.maxCount){
			this.state.value.push(null)
			this.state.childrenCount++
			this.updateParent()
		}
	}
	appearanceGetControl(){
		return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CollectionControl"), key:"control"}, (
			React.createElement('button',{className: this.appearanceProtoGetClassName("button", "Button AddButton"),
			"type":"button",
			onClick:this.onAddChild.bind(this)},
			[React.createElement('i',{className: this.appearanceProtoGetClassName("i","fa fa-plus"), key:"icon"}), " New"])
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
			if(this.state.value[i] != null){
				props.value = this.state.value[i]
			}
			children.push( React.createElement(
				'div',
				{
					className: this.appearanceProtoGetClassName("div", "ObjectContainer"),
					key: i
				},
				[
					React.createElement(
						'button',
						{
							className: this.appearanceProtoGetClassName("button", "Negative Remove Button"),
							onClick:this.onRemoveChild.bind(this,i),
							type:"button" ,
							key:i+"-delete-button"
						},
						React.createElement(
							'i',
							{
								className: this.appearanceProtoGetClassName("i", "fa fa-trash")
							}
						)
					),
					React.createElement(CaretakerFormObject, props)
				]
			) )
		}
		return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "Objects"), key:"children"}, children);
	}
	render(){
		var name = this.getUpdatedProps().name || ""
		return React.createElement(
			'div',
			{
				className: this.appearanceProtoGetClassName("div", "CaretakerFormObjectCollection " + name)
			},
			[this.appearanceGetControl(), this.appearanceGetChildren()]
		)
	}
}

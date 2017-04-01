class CaretakerFormObjectCollection extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.state.maxCount = props.max || Infinity
		this.state.minCount = props.min || 0
		if(this.state.maxCount < 1){ throw "max count of multiple object cannot be fewer than 1" }
		if(this.state.minCount < 0){ throw "min count of multiple object cannot be fewer than 0" }
		if(this.state.maxCount < this.state.minCount ){ throw "max count cannot be fewer than min count" }
		this.state.value = []
		this.loadValue(props)
		this.state.childrenCount = this.state.value || this.state.minCount || 1
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.setState(this.state)
	}
	loadValue(props){
		if(props.value){
			this.state.value = props.value
		}
	}
	getNegativeChildPropKeys(){
		return ["min","max","value"]
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
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.setState(this.state)
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
			if(this.state.value[i] != null){
				props.value = this.state.value[i]
			}
			children.push( React.createElement('div', { className: "CaretakerFormObjectContainer", key: i}, [
				React.createElement('button', { onClick:this.onRemoveChild.bind(this,i), type:"button" , key:i+"-delete-button" }, "delete"),
				React.createElement(CaretakerFormObject, props)
			]) )
		}
		return React.createElement('div',{className:"CaretakerFormObjectCollectionChildren", key:"children"}, children);
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormObjectCollection"}, [this.appearanceGetControl(), this.appearanceGetChildren()] )
	}
}


class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
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
		return ["label","description","quantity","max","min"]
	}
	getCustomPropKeys(){
		return ["label","description","quantity","max","min","has"]
	}
	getElementProps(){
		var props = Object.assign({}, this.props)
		this.getCustomPropKeys().forEach(function(prop){
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
			var props = this.getElementProps()
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

}

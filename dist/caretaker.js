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
		var props = Object.assign({}, this.props)
		if(this.isCommonInput()){
			this.getNegativeCommonPropKeys().forEach(function(key){
				props[key] = null
				delete props[key]
			})
		}
		props.onChange = this.onCommonInputChange.bind(this)
		return props
	}
	getSpecialProps(){
		var props = Object.assign({}, this.props)
		props.onChange = this.onChange.bind(this)
		return props
	}
	isCommonInput(){
		switch (this.props.type) {
			//need time interface
			case "time"											:
			case "date"											:
			case "week"											:
			//need options
			case "select"										:
			case "select-multiple"					:
			case "checkbox"									:
			case "textarea"									:
			case "radio"										:
			//need select interface
			case "select-object"						:
			case "select-object-multiple"		:	return false;
			default: return true;
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
			case "time"											: break;
			case "date"											: break;
			case "week"											: break;
			//need options
			case "select"										: break;
			case "select-multiple"					: break;
			case "checkbox"									: return React.createElement(CaretakerFormInputCheckBox, this.getSpecialProps()); break;
			case "textarea"									: break;
			case "radio"										:	 break;
			//need select interface
			case "select-object"						: break;
			case "select-object-multiple"		:	return false; break;
		}
	}
	render(){

		if(this.isCommonInput()){
			return React.createElement('div',{className: "CaretakerInput"}, (
				React.createElement('input', this.getProps())
			))
		}else{
			return React.createElement('div',{className: "CaretakerInput"}, (
				this.renderSpecialInput()
			))
		}
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

/** Command example
{
	type:"type",
	name:"theformcheckboxes"
	values:{
		"value":"text",
		"_rememberme":"Rememberme"
	},
	value: ["value","_rememberme"]
}
*/
class CaretakerFormInputCheckBox extends React.Component{
	constructor(props){
		super(props)

		var value = new Set()
		try{
			for(var i in props.value){
				try{
					value.add(props.value[i])
				}catch(e){}
			}
		}catch(e){}

		this.state = {
			value: value
		}
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	onChange(index, value){

		if(this.state.value.has(index)){
			this.state.value.delete(index)
		}else{
			this.state.value.add(index)
		}

		this.setState(this.state)
		this.updateParent()
	}
	getNegativePropKeys(){
		return ["values","value","options"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		return props
	}
	getCheckboxes(){
		var html = ""
		var values = this.props.values
		for(var i in values){
			if(html == ""){
				html = []
			}
			var text = values[i]
			var props = this.getProps()
			props.onChange = this.onChange.bind(this, i)
			props.key = i+"-checkbox"
			if(this.state.value.has(i)){
				props.checked = true
			}else{
				props.checked = false
			}

			html.push(React.createElement('div',{className:"CaretakerFormInputCheckBox", key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: "CaretakerFormInputCheckBoxCollection"}, (
			this.getCheckboxes()
		))
	}
}

/**
 * Represents a book.
 * @example:
 *
 * <div id="notificationContainerId"></div>
 * <script async>
 * var notificationObject = ReactDOM.render(
 *	 React.createElement(NotificationBar),
 *	 window['notificationContainerId']
 * )
 * </script>
 *
 */

class NotificationBar extends React.Component{
	constructor(){
		super();
		this.state = {
			notifications : [],
			faded: false,
			hidden: true
		}
		this.closeHandler = this.closeHandler.bind(this)
		this.itemRemoveHandler = this.itemRemoveHandler.bind(this)
		this.hide = this.hide.bind(this)
		this.show = this.show.bind(this)
	}
	componentDidMount(){
		this.timeout = setTimeout(this.show,10)
	}
	addNotification(notification){
		if(notification.title && typeof notification.title == "string" && notification.body && typeof notification.body == "string"){
			this.state.notifications.push(notification)
		}
		this.setState({
			notifications: this.state.notifications
		})
	}
	removeNotification(index){
		this.state.notifications.splice(index,1)
		this.setState({
			notifications: this.state.notifications
		})
		if(this.state.notifications.length <= 0){
			var hide = this.hide
			setTimeout(function(){
				hide()
			},300)
		}
	}
	size(){
		return this.state.notifications.length
	}
	componentClasses(){
		var classes = ["NotificationBar"]
		if(this.state.faded){
			classes.push("faded")
		}
		if(this.state.hidden){
			classes.push("hidden")
		}
		return classes.join(" ")
	}
	hide(){
		var thisComponent = this
		clearTimeout(this.timeout)
		this.setState({ faded:true })
		this.timeout = setTimeout(()=>{
			thisComponent.setState({ hidden:true })
		},300)
	}
	show(){
		var thisComponent = this
		clearTimeout(this.timeout)
		this.setState({ hidden:false })
		this.timeout = setTimeout(()=>{
			thisComponent.setState({ faded:false })
		},10)
	}
	closeHandler(){
		this.hide()
	}
	openHandler(){
		this.show()
	}
	itemRemoveHandler(id){
		this.removeNotification(id)
	}
	render(){
		return React.createElement('div',{className:this.componentClasses()},(
				[
					React.createElement('div',{key:'close-container',className:"text-right"},React.createElement(NotificationClose, {key:"close-button", closeHandler:this.closeHandler})),
					React.createElement(NotificationList, {key:"list", itemRemoveHandler:this.itemRemoveHandler, notifications: this.state.notifications})
				]
			))
	}
}

class NotificationList extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		let thisComponent = this
		var notificationItems = this.props.notifications.filter(function(item){
			return typeof item == "object" && item != null && item.body && item.title
		}).map(function(item, index){
			item.key = index
			item.itemRemoveHandler = thisComponent.props.itemRemoveHandler
			item.itemId = index
	    return React.createElement(NotificationItem, item)
		})
		return React.createElement('div',{className:"NotificationList"},notificationItems)
	}
}

class NotificationItem extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'hidden': true,
			'faded': true
		}
		this.timeout = null
		this.show = this.show.bind(this)
		this.handleRemove = this.handleRemove.bind(this)
	}
	componentDidMount(){
		this.timeout = setTimeout(this.show, 10)
	}
	show(){
		clearTimeout(this.timeout)
		let thisComponent = this
		this.setState({
			"hidden": false
		})
		this.timeout = setTimeout(function(){
			thisComponent.setState({ "faded": false })
		}, 10)
	}
	componentClasses(){
		var classNames = ["NotificationItem"]
		if(this.state.hidden){
			classNames.push("hidden")
		}
		if(this.state.faded){
			classNames.push("faded")
		}
		return classNames.join(" ")
	}
	handleRemove(){
		this.props.itemRemoveHandler(this.props.itemId)
	}
	render(){
		//link resolve
		var a = {}
		if(this.props.link){
			a.href = this.props.link
		}
		a.className = this.componentClasses()

		//
		var img = {}

		return React.createElement('a', a, (
			[
				React.createElement('div', {key:"image-container", className:"image-container"}, React.createElement('img', img)),
				React.createElement('div', {key:"text-container", className:"text-container"}, [
					React.createElement('div', {key:"title",className: "title"}, React.createElement('strong', null, this.props.title)),
					React.createElement('div', {key:"body",className: "body"}, React.createElement('span', null, this.props.body))
				]),
				React.createElement('div', {key:"remove-container", className:"remove-container"}, React.createElement('button', {className:"remove-button",onClick:this.handleRemove}, '\u2717'))
			]
		))
	}
}

class NotificationClose extends React.Component{
	constructor(props){
		super(props)
		this.clickHandler = this.clickHandler.bind(this)
	}
	clickHandler(){
		this.props.closeHandler()
	}
	render(){
		return React.createElement('button',{className:"NotificationClose btn-onyx", onClick:this.clickHandler}, "x close")
	}
}

class UserDisplay extends React.Component{
	constructor(){
		super();
		this.state = {
			"name": "",
			"subtext": "",
			"image": ""
		}
	}
	render(){
		var elements = []
		if(this.state.image){
			var attrib = {
				key: 'image',
				src: this.state.image
			}
			elements.push( React.createElement('img', attrib) )
		}
		elements.push( React.createElement('div', { key:"identity", className:"identity"}, [
			React.createElement('h6', {"key":"name"}, this.state.name),
			React.createElement('small', {"key":"subtext"}, this.state.subtext)
		]) )

		return React.createElement('div', {className: "UserDisplay"}, elements)
	}
}

class UserDisplayInline extends React.Component{
	constructor(){
		super();
		this.state = {
			"name": "",
			"subtext": "",
			"image": ""
		}
	}
	render(){
		var elements = []
		if(this.state.image){
			var attrib = {
				key: 'image',
				src: this.state.image
			}
			elements.push( React.createElement('img', attrib) )
		}
		elements.push( React.createElement('div', { key:"identity", className:"identity"}, [
			React.createElement('h6', {"key":"name"}, this.state.name),
			React.createElement('small', {"key":"subtext"}, this.state.subtext)
		]) )

		return React.createElement('div', {className: "UserDisplayInline"}, elements)
	}
}

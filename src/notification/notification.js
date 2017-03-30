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

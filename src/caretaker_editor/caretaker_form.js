class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			value: props.value,
			isValidating: false,
			isValid: null,
			errors: []
		}
	}
	onChange(value){
		this.state.value = value
		this.state.isValid = null
		this.state.isSubmitting = false
		this.setState(this.state)
	}
	onReset(){
		this.state.value = this.props.value
		this.state.isValid = null
		this.state.isSubmitting = false
		this.setState(this.state)
	}
	doStringAction(){
		var url = this.props.action
		var fetch = window.fetch
		fetch(url).then(function(response){
			if(response.status != 200){
				console.log('Looks like there was a problem. Status Code: ' + response.status)
				return
			}

			response.json().then(function(data){
				console.log('data');
			});
		}).catch(function(err){
			console.error('Fetch error :-S', err)
		})
	}
	doFunctionAction(){

	}
	onAction(){
		if(typeof this.props.action == "string"){
			this.doStringAction()
		}else if(typeof this.props.action == "function"){
			// checkin if action is false
			var isClass = false
			try{ this.props.action() }catch(e){
				isClass = true
			}
			this.doFunctionAction()
		}
	}
	onSubmit(){
		if(this.state.isValid != true){
			this.triggerCheckValidity()
		}else{
			this.onAction()
		}
	}
	triggerCheckValidity(){
		this.state.isValidating = true
		this.state.isSubmitting = true
		this.setState(this.state)
	}
	onReportValidity(isValid){
		this.state.isValid = isValid == true
		if(this.state.isValid && this.state.isSubmitting){
			this.onSubmit()
		}
		this.setState(this.state)
	}
	getProps(){
		var props = Object.assign({}, this.props.edit)

		props.onChange = this.onChange.bind(this)
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating

		props.value = this.state.value
		props.key = "object"
		return props
	}
	appearanceGetActions(){
		var actions = []
		if(this.props.submittable !== false){
			actions.push(React.createElement('button',{type:"button", key:"submit", onClick: this.onSubmit.bind(this) , className:"CaretakerButton CaretakerPositiveButton"}, [React.createElement('i',{key:"icon",className:"fa fa-check"}), "Save"]))
		}
		if(this.props.resettable){
			actions.push(React.createElement('button',{type:"button", key:"reset", onClick: this.onReset.bind(this), className:"CaretakerButton CaretakerBlueButton"}, [React.createElement('i',{key:"icon",className:"fa fa-undo"}), "Reset"]))
		}
		if(actions.length > 0){
			return React.createElement('div', {className: "CaretakerFormActions", key:"actions"}, actions)
		}else{
			return ""
		}
	}
	render(){
		var props = this.getProps()
		return React.createElement('form', {className: "CaretakerForm", encType:"multipart/form-data", onSubmit: (event)=>{ event.preventDefault() } }, (
			[React.createElement(CaretakerFormObject, props), this.appearanceGetActions()]
		))
	}
}

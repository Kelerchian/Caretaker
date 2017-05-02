class CaretakerForm extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			value: props.value,
			isResetting: false,
			isValidating: false,
			isValid: null,
			errors: []
		}
	}
	onChange(value){
		this.state.value = value
		this.state.isSubmitting = false
		this.state.isResetting = false
		this.setState(this.state)
	}
	onReset(){
		this.state.value = this.props.value
		this.state.isSubmitting = false
		this.state.isResetting = true
		this.setState(this.state)
	}
	doStringAction(actionValue){
		var url = this.props.action
		var fetch = window.fetch
		var name = this.props.edit.name || "data"
		var content = JSON.stringify(actionValue)
		var body = name+"="+content

		var doAfterSuccess = this.doAfterSuccess.bind(this)
		var doAfterFailure = this.doAfterFailure.bind(this)

		fetch(url, {
			"method"	: "POST",
			"body"		: body,
			"mode"		: "cors",
			"headers"	: {
      	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		}).then(function(response){
			if(response.ok){
				doAfterSuccess(response, actionValue)
			}
		}).catch(function(err){
			doAfterFailure(err, actionValue)
		})
	}

	doFunctionAction(actionValue){
		try{
			var actionReturn = this.props.action(actionValue)
			this.doAfterSuccess(actionReturn, actionValue)
		}catch(throwable){
			this.doAfterFailure(throwable, actionValue)
		}
	}
	doAfterAction(actionValue){
		if(typeof this.props.afterAction == "function"){
			this.props.afterAction(actionValue)
		}
	}
	doAfterSuccess(actionReturn, actionValue){
		this.doAfterAction(actionValue)
		var continueAction = true
		if(typeof this.props.afterSuccess == "function"){
			continueAction = this.props.afterSuccess(actionReturn, actionValue)
		}
		if(continueAction !== false){

		}
	}
	doAfterFailure(throwable, actionValue){
		this.doAfterAction(actionValue)
		var continueAction = true
		if(typeof this.props.afterFailure == "function"){
			continueAction = this.props.afterFailure(throwable, actionValue)
		}
		if(continueAction !== false){

		}
	}
	onAction(){
		var actionValue = Caretaker.SubmissionPreprocessor.preprocess(this.state.value)
		if(typeof this.props.action == "string"){
			this.doStringAction(actionValue)
		}else if(typeof this.props.action == "function"){
			this.doFunctionAction(actionValue)
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
		props.isResetting = this.state.isResetting

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

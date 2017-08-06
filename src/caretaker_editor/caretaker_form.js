class CaretakerForm extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = {
			isResetting: false,
			isValidating: false,
			isValid: null,
			errors: []
		}
		this.loadValue(props)
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
	}
	loadValue(props){
		this.updateProps(props)
		if(props.value != null){
			this.state.value = props.value
		}
	}
	onChange(value){
		this.state.value = value
		this.state.isSubmitting = false
		this.state.isResetting = false
		this.setState(this.state)
	}
	onReset(){
		this.state.value = this.getUpdatedProps().value
		this.state.isSubmitting = false
		this.state.isResetting = true
		this.setState(this.state)
	}
	_getAdditionalHeaders(){

		var headers = new Headers()
		if(this.getUpdatedProps().headers){
			if(typeof this.getUpdatedProps().headers == "object"){
				headers = new Headers(this.getUpdatedProps().headers)
			}else if(typeof this.getUpdatedProps().headers == "function"){
				headers = this.getUpdatedProps().headers(headers) || headers
			}
		}
		return headers
	}
	doStringAction(actionValue){
		var url = this.getUpdatedProps().action
		var fetch = window.fetch
		var name = this.getUpdatedProps().edit.name || "data"

		var doAfterSuccess = this.doAfterSuccess.bind(this)
		var doAfterFailure = this.doAfterFailure.bind(this)

		var fetchParameter = {
			"method": "POST",
			"body"	: actionValue,
			"mode"	: "cors",
			"credentials": "include",
			"headers": this._getAdditionalHeaders()
		}

		if(typeof this.getUpdatedProps().fetchParameter == "object"){
			fetchParameter = Object.assign(fetchParameter, this.getUpdatedProps().fetchParameter)
		}

		fetch(url, fetchParameter)
		.then(function(response){
			if(response.ok || response.status == 200){
				doAfterSuccess(response, actionValue)
			}else{
				throw new Error(response.statusText)
			}
		})
		.catch(function(err){
			doAfterFailure(err, actionValue)
		})
	}

	doFunctionAction(actionValue){
		try{
			var actionReturn = this.getUpdatedProps().action(actionValue)
			this.doAfterSuccess(actionReturn, actionValue)
		}catch(throwable){
			this.doAfterFailure(throwable, actionValue)
		}
	}
	doAfterAction(actionValue){
		if(typeof this.getUpdatedProps().afterAction == "function"){
			this.getUpdatedProps().afterAction(actionValue)
		}
	}
	doAfterSuccess(actionReturn, actionValue){
		this.doAfterAction(actionValue)
		var continueAction = true
		if(typeof this.getUpdatedProps().afterSuccess == "function"){
			continueAction = this.getUpdatedProps().afterSuccess(actionReturn, actionValue)
		}
	}
	doAfterFailure(throwable, actionValue){
		this.doAfterAction(actionValue)
		var continueAction = true
		if(typeof this.getUpdatedProps().afterFailure == "function"){
			continueAction = this.getUpdatedProps().afterFailure(throwable, actionValue)
		}
	}
	onAction(){
		var actionValue = Caretaker.SubmissionPreprocessor.preprocess(this.state.value, this.getUpdatedProps())
		if(typeof this.getUpdatedProps().action == "string"){
			this.doStringAction(actionValue)
		}else if(typeof this.getUpdatedProps().action == "function"){
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
		var props = Object.assign({}, this.getUpdatedProps().edit)

		props.onChange = this.onChange.bind(this)
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
		props.isResetting = this.state.isResetting

		if(this.state.value != null){
			props.value = this.state.value
		}
		props.key = "object"
		return props
	}
	appearanceGetActions(){
		var actions = []
		if(this.getUpdatedProps().submittable !== false){
			actions.push(
				React.createElement(
					'button',
					{
						type:"button",
						key:"submit",
						onClick: this.onSubmit.bind(this),
						className: this.appearanceProtoGetClassName("button", "Button PositiveButton")
					},
					[React.createElement('i',{key:"icon",className:  this.appearanceProtoGetClassName('i', "fa fa-check")} ), "Save"])
			)
		}
		if(this.getUpdatedProps().resettable){
			actions.push(
				React.createElement(
					'button',
					{
						type:"button",
						key:"reset",
						onClick: this.onReset.bind(this),
						className: this.appearanceProtoGetClassName("button","Button CaretakerBlueButton")
					},
					[React.createElement('i',{key:"icon",className: this.appearanceProtoGetClassName('i', "fa fa-undo") } ), "Reset"])
			)
		}
		if(actions.length > 0){
			return React.createElement('div', {className: this.appearanceProtoGetClassName("div","Actions") , key:"actions"}, actions)
		}else{
			return ""
		}
	}
	render(){
		var props = this.getProps()
		return React.createElement('form', {className: this.appearanceProtoGetClassName("form","CaretakerForm") , encType:"multipart/form-data", onSubmit: (event)=>{ event.preventDefault() } }, (
			[React.createElement(CaretakerFormObject, props), this.appearanceGetActions()]
		))
	}
}

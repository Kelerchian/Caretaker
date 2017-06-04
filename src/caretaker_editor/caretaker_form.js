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
	loadValue(props){
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
		this.state.value = this.props.value
		this.state.isSubmitting = false
		this.state.isResetting = true
		this.setState(this.state)
	}
	_getAdditionalHeaders(){

		var headers = new Headers()
		if(this.props.headers){
			if(typeof this.props.headers == "object"){
				headers = new Headers(this.props.headers)
			}else if(typeof this.props.headers == "function"){
				headers = this.props.headers(headers) || headers
			}
		}
		return headers
	}
	doStringAction(actionValue){
		var url = this.props.action
		var fetch = window.fetch
		var name = this.props.edit.name || "data"

		var doAfterSuccess = this.doAfterSuccess.bind(this)
		var doAfterFailure = this.doAfterFailure.bind(this)

		var fetchParameter = {
			"method": "POST",
			"body"	: actionValue,
			"mode"	: "cors",
			"credentials": "include",
			"headers": this._getAdditionalHeaders()
		}

		if(typeof this.props.fetchParameter == "object"){
			fetchParameter = Object.assign(fetchParameter, this.props.fetchParameter)
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
	}
	doAfterFailure(throwable, actionValue){
		this.doAfterAction(actionValue)
		var continueAction = true
		if(typeof this.props.afterFailure == "function"){
			continueAction = this.props.afterFailure(throwable, actionValue)
		}
	}
	onAction(){
		var actionValue = Caretaker.SubmissionPreprocessor.preprocess(this.state.value, this.props)
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

		if(this.state.value != null){
			props.value = this.state.value
		}
		props.key = "object"
		return props
	}
	appearanceGetActions(){
		var actions = []
		if(this.props.submittable !== false){
			actions.push(
				React.createElement(
					'button',
					{
						type:"button",
						key:"submit",
						onClick: this.onSubmit.bind(this),
						className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerPositiveButton")
					},
					[React.createElement('i',{key:"icon",className:  this.appearanceProtoGetClassName('i', "fa fa-check")} ), "Save"])
			)
		}
		if(this.props.resettable){
			actions.push(
				React.createElement(
					'button',
					{
						type:"button",
						key:"reset",
						onClick: this.onReset.bind(this),
						className: this.appearanceProtoGetClassName("button","CaretakerButton CaretakerBlueButton")
					},
					[React.createElement('i',{key:"icon",className: this.appearanceProtoGetClassName('i', "fa fa-undo") } ), "Reset"])
			)
		}
		if(actions.length > 0){
			return React.createElement('div', {className: this.appearanceProtoGetClassName("div","CaretakerFormActions") , key:"actions"}, actions)
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

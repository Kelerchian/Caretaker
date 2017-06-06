/**
*	Copyright 2017 Alan Darmasaputra
*
*	Licensed under the Apache License, Version 2.0 (the "License");
*	you may not use this file except in compliance with the License.
*	You may obtain a copy of the License at
*
*			http://www.apache.org/licenses/LICENSE-2.0
*
*	Unless required by applicable law or agreed to in writing, software
*	distributed under the License is distributed on an "AS IS" BASIS,
*	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*	See the License for the specific language governing permissions and
*	limitations under the License.
*/
var Caretaker = (function(){

	var StructBank = (function(){

		var structMap = {}

		function register(key,data){
			if(structMap[key]){
				console.warn('Key '+key+' has beed reserved')
			}else{
				structMap[key] = data
			}
		}
		function get(key){
			return structMap[key]
		}
		return {register:register, get:get}
	}())

	var Utils = (function(){

		var getBase64Async = function(file, onSuccess, onError){
			var reader = new FileReader()
   		reader.readAsDataURL(file);
			reader.onload = function(){
				if(onSuccess){
					onSuccess(reader.result)
				}
			}
			reader.onerror = function(error){
				if(onError){
					onError(error)
				}
			}
		}

		return {
			getBase64Async: getBase64Async
		}
	}())

	/**
	* Caretaker top window widget
	*
	*/
	var Widget = (function(){

		// default onclick listener to prevent widget from closing
		var widgetOnClick = function(e){
			console.log(e)
			e.stopPropagation()
		}

		function getInterfaceWidget(){
			const interfaceID = "CaretakerInterfaceWidget"
			var theInterface = document.querySelector('div#'+interfaceID)

			if(!theInterface){
				theInterface = document.createElement('div')
				theInterface.id = interfaceID
				document.body.appendChild(theInterface)

				theInterface.addEventListener('click', function(e){
					if(e.target == theInterface){
						e.stopPropagation();
						e.preventDefault();
						hideInterfaceWidget()
					}
				}, true)

				theInterface.addEventListener('touchend', function(e){
					if(e.target == theInterface){
						e.stopPropagation();
						e.preventDefault();
						hideInterfaceWidget()
					}
				}, true)
			}
			return theInterface
		}

		function removeClassFrom(classAttribute, className){
			classAttribute = classAttribute.trim().split(' ')
			var classIndex = classAttribute.indexOf(className)
			if(classIndex != -1){
				classAttribute.splice(classIndex, 1)
			}
			return classAttribute.join(' ')
		}
		function addClassFrom(classAttribute, className){
			classAttribute = classAttribute.trim().split(' ')
			classAttribute.push(className)
			return classAttribute.join(' ')
		}

		function hideInterfaceWidget(theInterface){
			var theInterface = theInterface || getInterfaceWidget()
			theInterface.className = removeClassFrom(theInterface.className, "active")
			theInterface.innerHTML = ""
			return theInterface
		}

		function callInterfaceWidget(){
			var theInterface = getInterfaceWidget()
			theInterface.className = addClassFrom(theInterface.className, "active")
			return theInterface
		}

		function callDateInputWidget(onChange, value){
			var theInterface = callInterfaceWidget()
			var intermediateChange = function(newValue){
				onChange(newValue)
				hideInterfaceWidget(theInterface)
			}
			ReactDOM.render(React.createElement(CaretakerDateInputWidget, {onChange:intermediateChange, value: value}), theInterface)
		}

		function callTimeInputWidget(onChange, value){
			var theInterface = callInterfaceWidget()
			var intermediateChange = function(newValue){
				onChange(newValue)
				hideInterfaceWidget(theInterface)
			}
			ReactDOM.render(React.createElement(CaretakerTimeInputWidget, {onChange:intermediateChange, value: value}), theInterface)
		}

		return {
			callDateInputWidget,
			callTimeInputWidget
		}
	}())



	/**
	* Special Input & Extensor Support
	*
	*/
	var SpecialInputPrivate = {
		inputMap : {}
	}
	var SpecialInputPublic = {
		isSpecialInput: function(type){
			if(SpecialInputPrivate.inputMap[type]){
				return true
			}else{
				return false
			}
		},
		isCommonInput: function(type){
			return !SpecialInputPublic.isSpecialInput(type)
		},
		getClass: function(type){
			return SpecialInputPrivate.inputMap[type]
		},
		register: function(type,className){
			if(SpecialInputPrivate.inputMap[type]){
				console.warn('SpecialInput '+type+' has been installed and cannot be replaced with '+className)
			}else{
				SpecialInputPrivate.inputMap[type] = className
			}
		}
	}



	class ValueNode{
		static from(object){
			return Object.assign(new this(), object)
		}
		convert(){
			return Object.assign({}, this)
		}
	}
	class ValueArray extends Array{
		convert(){
			return Array.from(this)
		}
	}

	/**
	* SubmissionPreprocessor
	* preprocess valueTree before submission
	*/
	var SubmissionUtility = (function(){
		var utilities = []

		function make(){

		}

		return {}
	}())
	var SubmissionPreprocessor = (function(){
		var preprocessors = []
		var utilities = {}

		function addUtility(name, utility){
			utilities[name] = utility
		}
		function makeUtility(){
			var utilityObject = {}
			for(var i in utilities){
				utilityObject[i] = new utilities[i]()
			}
			return utilityObject;
		}

		function preprocessOne(valueNode, props, utility){
			for(var i in preprocessors){
				valueNode = preprocessors[i](valueNode, props, utility)
			}
			return valueNode
		}
		function preprocessTree(valueNode, props, utility){
			if(valueNode instanceof ValueNode || valueNode instanceof ValueArray){
				valueNode = valueNode.convert()
				for(var i in valueNode){
					valueNode[i] = preprocessTree(valueNode[i], props, utility)
				}
			}
			valueNode = preprocessOne(valueNode, props, utility)
			return valueNode
		}
		function preprocess(valueRoot, props){
			var utility = makeUtility()
			var actionJSON = preprocessTree(valueRoot, props, utility)
			var formData = new FormData()
			var name = props.edit.name || "data"
			formData.append(name, JSON.stringify(actionJSON))
			for(var i in utility){
				var utilityClass = utilities[i]
				var utilityObject = utility[i]

				utilityClass.finalize(formData, utilityObject)
			}
			return formData
		}
		function append(func){
			if(typeof func == "function"){
				preprocessors.push(func)
			}
		}
		function prepend(func){
			if(typeof func == "function"){
				preprocessors.unshift(func)
			}
		}

		return {
			addUtility: addUtility,
			preprocess: preprocess,
			prepend: prepend,
			append: append
		}
	}())

	/**
	* Caretaker UploadedFile and UploadedFileMap
	*
	*/
	var globalInputFile
	class UploadedFile{
		static promptUpload(onChange, props){
			var inputFile = document.createElement('input')
			globalInputFile = inputFile
			var reader = new FileReader()
			var thisClass = this

			//ready the props
			for(var i in props){
				inputFile.setAttribute(i, props[i])
			}

			//ready the render
			inputFile.type = "file"
			inputFile.onchange = function(e){
				var file = inputFile.files[0]
				if(file){
					var uploadedFile = new thisClass(file)
					onChange(uploadedFile)
				}
			}
			inputFile.click()
		}
		constructor(file){
			this.fileData = {
				_is_caretaker_uploaded_file: true,
				name: file.name,
				size: file.size
			}
			this.originalFile = file
		}
		getName(){
			return this.fileData.name
		}
		getSize(){
			return this.fileData.size
		}
		getOriginalFile(){
			return this.originalFile
		}
		getData(){
			return this.fileData.data
		}
		getFileData(){
			return this.fileData
		}
	}
	class UploadedFileCatalog{
		static finalize(formData, uploadedFileCatalog){
			for(var i = 0; i<uploadedFileCatalog.files.length; i++){
				formData.append('files', uploadedFileCatalog.files[i])
			}
		}
		constructor(){
			this.files = []
		}
		register(file){
			var index = this.files.length
			this.files.push(file)
			return index
		}
	}

	SubmissionPreprocessor.addUtility('UploadedFileCatalog',UploadedFileCatalog)
	SubmissionPreprocessor.append(function(valueNode, props, utilities){
		if(valueNode instanceof UploadedFile){
			var fileData =  valueNode.getFileData()
			var index = utilities.UploadedFileCatalog.register(valueNode.getOriginalFile())
			fileData.index = index
			return fileData
		}
		return valueNode
	})

	function makeForm(formCommand, element){
		if(!React || !ReactDOM){
			throw new Error("Caretaker needs React and ReactDOM. If you are using Webpack, please bind React and ReactDOM to window like this \nwindow['React'] = React  \n window['ReactDOM = ReactDOM']")
		}
		if(typeof formCommand != "object"){
			throw new Error("Parameter formCommand must be object")
		}
		//parse
		if(typeof element == "string"){
			element = document.querySelector(element)
		}
		if(!(element instanceof HTMLElement)){
			throw new Error("Parameter element must be object")
		}

		return ReactDOM.render( React.createElement(CaretakerForm, formCommand), element )
	}

	return {
		SpecialInput:SpecialInputPublic,
		SubmissionPreprocessor: SubmissionPreprocessor,
		UploadedFile:UploadedFile,
		ValueArray:ValueArray,
		ValueNode:ValueNode,
		Utils:Utils,
		Widget:Widget,
		StructBank:StructBank,
		makeForm: makeForm
	}
})();

class CaretakerFormElementPrototype extends React.Component{
	appearanceProtoGetAdditionalClassName(classKeys){
		return this.constructor.appearanceProtoGetAdditionalClassName(this.props, classKeys)
	}

	static appearanceProtoGetAdditionalClassName(props, classKeys){
		if( Array.isArray(classKeys) ){
			if( props.className && typeof props.className == "object" ){
				var additionals = []
				for(var i in classKeys){
					var classKey = classKeys[i]
					if(props.className[classKey]){
						additionals.push(props.className[classKey])
					}
				}
				return " " + additionals.join(' ') + " "
			}
		}else{
			console.warn("Error : appearanceProtoGetAdditionalClassName : " + classNames )
		}
		return ""
	}

	static appearanceProtoGetClassName(props, tag, className){

		if(className == null){
			return this.appearanceProtoGetClassName(props, null, tag)
		}

		className = String(className)
		tag = String(tag)

		var retClassName = className
		retClassName += this.appearanceProtoGetAdditionalClassName(props, (function(){
			var classKeyArray = []
			if(tag != null){
				classKeyArray.push(tag)
			}
			className.split(' ').forEach(function(classKey){
				classKeyArray.push("."+classKey.trim())
			})
			return classKeyArray
		}()) )
		return " " + retClassName + " "
	}

	appearanceProtoGetClassName(tag, className){
		return this.constructor.appearanceProtoGetClassName(this.props, tag, className)
	}
}

class CaretakerFormInputPrototype extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = new Caretaker.ValueNode()
		this.state = this.setInitialState(this.state) || this.state
		this.loadValue(props)
	}
	loadValue(props){
		this.state.value = this.getDefaultValue();
		if(props.hasOwnProperty("value")){
			var supposedValue = this.transformValueBeforeLoad(props.value)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}else if(props.hasOwnProperty("defaultValue")){
			var supposedValue = this.transformValueBeforeLoad(props.defaultValue)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}
		this.state.value = this.modifyValueAfterLoad(this.state.value) || this.state.value
		if(props.isResetting){
			this.updateParent()
		}
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
	reportValidity(){
		this.state.isValid = this.checkValidity(this.state.value)
		if(this.props.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			this.props.onReportValidity(this.state.isValid)
		}
	}
	getNegativePropKeys(){
		return ["value","values","defaultValue","onReportValidity","isValidating","isResetting","className"]
	}
	getProtoProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		var removedPropKeys = this.removePropKeys()
		if(Array.isArray(removedPropKeys)){
			removedPropKeys.forEach(function(key){
				props[key] = null
				delete props[key]
			})
		}
		props = this.modifyProps(props) || props
		return props
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.transformValueBeforeSave(this.state.value))
		}
		this.state.validationUpdated = false
	}
	isRequired(){
		return this.props.required
	}
	//extendable but not recommended
	getProps(){
		return this.getProtoProps()
	}
	//extendable
	removePropKeys(){
		return []
	}
	//extendable
	modifyProps(props){

	}
	//extendable
	transformValueBeforeLoad(value){
		return value
	}
	//extendable
	transformValueBeforeSave(value){
		return value
	}
	setInitialState(state){
		return state
	}
	//must be extended
	checkValidity(value){
		throw new Error("checkValidity is undefined")
	}
	modifyValueAfterLoad(value){
		return value
	}
	//must be extended
	getDefaultValue(){
		throw new Error("getDefaultValue is undefined")
	}
	//must be extended
	loadedValueIsValid(value){
		throw new Error("loadedValueIsValid is undefined")
	}
	//recommended to be extended
	onChange(value){
		if(this.loadedValueIsValid(value)){
			this.state.value = value
		}
		this.updateParent()
	}
	//must be extended
	render(){

	}
}

class CaretakerDateInputWidget extends React.Component{
	constructor(props){
		super(props)

		var currentValue = moment(props.value)
		if(!moment(props.value).isValid()){
			currentValue = moment()
		}
		this.state = {
			oldValue : props.value,
			lastValidValue: moment(currentValue),
			value : moment(currentValue)
		}
	}
	submitChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	clearChange(){
		if(this.props.onChange){
			this.props.onChange("")
		}
	}
	cancelChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.oldValue)
		}
	}
	checkValidity(){
		this.state.value = moment(this.state.value)
		if(this.state.value.isValid()){
			this.state.lastValidValue = moment(this.state.value)
		}else{
			this.state.value = moment(this.state.lastValidValue)
		}
		this.setState(this.state)
	}
	changeDay(e){
		var day = e.target.value
		this.state.value.date(day)
		this.checkValidity()
	}
	changeMonth(e){
		var month = e.target.value
		this.state.value.month(month)
		this.checkValidity()
	}
	changeYear(e){
		var year = e.target.value
		this.state.value.year(year)
		this.checkValidity()
	}
	appearanceGetInputs(){
		var minDay = 1;
		var maxDay = moment(this.state.value).endOf("month").date()
		var minMonth = 0;
		var maxMonth = 12;
		var modifier = moment(this.state.value)
		var widget = this

		var day = React.createElement('div',{key:"day"},[
			React.createElement('label',{key:"label", className:"CaretakerLabel"},"Day"),
			React.createElement('select',{onChange: this.changeDay.bind(this),value:this.state.value.date(), key:"day"}, (function(){
				var options = []
				for(var i = minDay; i<=maxDay; i++){
					modifier.date(i)
					options.push( React.createElement('option',{value:i,key:i}, modifier.format("Do (dddd)")) )
				}
				return options
			}()))
		])

		var month = React.createElement('div',{key:"month"},[
			React.createElement('label',{key:"label", className:"CaretakerLabel"},"Month"),
			React.createElement('select',{onChange: this.changeMonth.bind(this),value:this.state.value.month(), key:"month"}, (function(){
				var options = []
				modifier.date(1)
				for(var i = minMonth; i<=maxMonth; i++){
					modifier.month(i)
					options.push( React.createElement('option',{value:i,key:i}, modifier.format("MMMM")) )
				}
				return options
			}()))
		])

		var year = React.createElement('div',{key:"year"}, [
			React.createElement('label',{key:"label", className:"CaretakerLabel"},"Year"),
			React.createElement('input',{onChange: this.changeYear.bind(this), key:"input" ,type:"number",min:"1970", value:this.state.value.year()})
		])

		return [day,month,year]
	}
	appearanceGetActions(){
		var saveButton = React.createElement('button',{key:"save",className:"CaretakerButton CaretakerPositiveButton",onClick: this.submitChange.bind(this)},"Save")
		var clearButton = React.createElement('button',{key:"clear",className:"CaretakerButton",onClick: this.clearChange.bind(this)},"Clear")
		var cancelButton = React.createElement('button',{key:"cancel",className:"CaretakerButton CaretakerNegativeButton",onClick: this.cancelChange.bind(this)},"Cancel")
		return [saveButton, clearButton, cancelButton]
	}
	render(){
		return React.createElement('div',{onClick: this.props.widgetOnClick, className:"CaretakerWidget CaretakerDateInputWidget"}, [
			React.createElement('div',{className:"CaretakerInputContainer", key:"container"}, this.appearanceGetInputs()),
			React.createElement('div',{className:"CaretakerActionButtons", key:"actions"}, this.appearanceGetActions())
		])
	}
}

class CaretakerTimeInputWidget extends React.Component{
	constructor(props){
		super(props)

		var currentValue = moment(props.value)
		if(!moment(props.value).isValid()){
			currentValue = moment()
		}

		this.state = {
			oldValue : props.value,
			lastValidValue: moment(currentValue),
			value : moment(currentValue)
		}
	}
	submitChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	clearChange(){
		if(this.props.onChange){
			this.props.onChange("")
		}
	}
	cancelChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.oldValue)
		}
	}
	checkValidity(){
		this.state.value = moment(this.state.value)
		if(this.state.value.isValid()){
			this.state.lastValidValue = moment(this.state.value)
		}else{
			this.state.value = moment(this.state.lastValidValue)
		}
		this.setState(this.state)
	}
	changeHour(e){
		var hour = e.target.value
		this.state.value.hour(hour)
		this.checkValidity()
	}
	changeMinute(e){
		var minute = e.target.value
		this.state.value.minute(minute)
		this.checkValidity()
	}
	changeSecond(e){
		var second = e.target.value
		this.state.value.second(second)
		this.checkValidity()
	}
	appearanceGetInputs(){
		var minHour = 0;
		var maxHour = 23;
		var minMinute = 0;
		var maxMinute = 59;
		var minSecond = 0;
		var maxSecond = 59;

		var hour 	= React.createElement('div',{key:"hour"},[
			React.createElement('label', { className:"CaretakerLabel", key:"label" }, "Hour"),
			React.createElement('input', { onChange:this.changeHour.bind(this), value: this.state.value.hour(), key:"input" })
		])
		var minute 	= React.createElement('div',{key:"minute"},[
			React.createElement('label', { className:"CaretakerLabel", key:"label" }, "Minute"),
			React.createElement('input', { onChange:this.changeMinute.bind(this), value: this.state.value.minute(), key:"input" })
		])
		var second 	= React.createElement('div',{key:"second"},[
			React.createElement('label', { className:"CaretakerLabel", key:"label" }, "Second"),
			React.createElement('input', { onChange:this.changeSecond.bind(this), value:this.state.value.second(), key:"input" })
		])

		return [hour,minute,second]
	}
	appearanceGetActions(){
		var saveButton = React.createElement('button',{key:"save",className:"CaretakerButton CaretakerPositiveButton",onClick: this.submitChange.bind(this)},"Save")
		var clearButton = React.createElement('button',{key:"clear",className:"CaretakerButton",onClick: this.clearChange.bind(this)},"Clear")
		var cancelButton = React.createElement('button',{key:"cancel",className:"CaretakerButton CaretakerNegativeButton",onClick: this.cancelChange.bind(this)},"Cancel")
		return [saveButton, clearButton, cancelButton]
	}
	render(){
		return React.createElement('div',{onClick: this.props.widgetOnClick, className:"CaretakerWidget CaretakerTimeInputWidget"}, [
			React.createElement('div',{className:"CaretakerInputContainer", key:"container"}, this.appearanceGetInputs()),
			React.createElement('div',{className:"CaretakerActionButtons", key:"actions"}, this.appearanceGetActions())
		])
	}
}

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

class CaretakerInput extends CaretakerFormElementPrototype{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.state.isValidating = props.isValidating
		if(this.isCommonInput()){
			this.reportValidity()
		}
		// this.setState(this.state)
	}
	getDefaultValue(){
		if(this.isCommonInput()){
			return ""
		}else{
			return null
		}
	}
	loadValue(props){
		this.state.value = this.getDefaultValue()
		if(props.hasOwnProperty("value")){
			if(!(props.value == null && this.isCommonInput())){
				this.state.value = props.value
			}
		}
		if(props.hasOwnProperty("defaultValue")){
			if( !(props.defaultValue == null && this.isCommonInput()) ){
				this.state.value = props.defaultValue
			}
		}
		if(props.isResetting){
			this.updateParent()
		}
	}
	checkValidityAdvanced(){
		this.state.isValid = [this.textInput.validationMessage]
	}
	checkValidity(){
		if(this.isCommonInput()){
			if(this.textInput){
				this.state.isValid = this.textInput.checkValidity()
				if(this.state.isValid == false){
					this.checkValidityAdvanced()
				}
			}else{
				this.state.isValid = false
			}
		}
	}
	onReportValidity(isValid){
		this.state.isValid = isValid
		this.state.validationUpdated = false
		this.reportValidity()
	}
	reportValidity(){
		if(this.props.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			this.checkValidity()
			this.props.onReportValidity(this.state.isValid)
		}
	}
	getNegativeCommonPropKeys(){
		return ["options","value","isValidating","onReportValidity","isResetting","className"]
	}
	bindInput(input){
		this.textInput = input
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
		props.value = this.state.value
		props.className = this.appearanceProtoGetClassName("input","")
		props.ref = this.bindInput.bind(this)
		return props
	}
	getSpecialProps(){
		var props = Object.assign({}, this.props)
		props.onChange = this.onChange.bind(this)
		props.onReportValidity = this.onReportValidity.bind(this)
		props.isValidating = this.state.isValidating
		return props
	}
	isCommonInput(){
		return Caretaker.SpecialInput.isCommonInput(this.props.type)
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.state.validationUpdated = false
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

		var specialInputClass = Caretaker.SpecialInput.getClass(this.props.type)
		if(!specialInputClass){
			return ""
		}

		var specialInput = React.createElement(specialInputClass, this.getSpecialProps())
		if(!specialInput){
			return ""
		}

		return specialInput
	}
	render(){
		if(this.isCommonInput()){
			return React.createElement('div',{className:  this.appearanceProtoGetClassName("div","CaretakerInput")}, (
				React.createElement('input', this.getProps())
			))
		}else{
			return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerInput")}, (
				this.renderSpecialInput()
			))
		}
	}
}

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
				if(typeof this.props.has == "object" && this.props.has != null){
					var has = this.props.has
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
	reportValidity(){
		if(this.props.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			if(this.isObject() && !this.isMany() && !this.isChildless()){
				var isValid = true
				if(typeof this.props.has == "object" && this.props.has){
					var has = this.props.has
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

			if(typeof this.props.validate == "function"){
				var tempValid = Array.isArray(this.state.isValid) || this.state.isValid == true ? this.state.isValid : [this.state.isValid]
				var newValid
				try{
					newValid = this.props.validate(this.state.value, tempValid)
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

			this.props.onReportValidity(this.state.isValid, this.props.name)
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
		return this.props.quantity == "many"
	}
	isObject(){
		return this.props.type == "object" || this.props.type == null
	}
	isInput(){
		return !this.isObject() && !this.isMany()
	}
	isChildless(){
		return this.isObject() && (this.props.has == null || (typeof this.props.has == "object" && Object.keys(this.props.has).length == 0 ))
	}
	updateParent(){
		this.state.validationUpdated = false
		if(this.props.onChange){
			this.props.onChange(this.state.value, this.state.name)
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
		return ["label","description","htmlLabel","htmlDescription","quantity","has","defaultValue","validate"]
	}
	getInputProps(){
		var props = Object.assign({}, this.props)
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
		var props = Object.assign({}, this.props)
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
		if(this.props.htmlLabel && typeof this.props.htmlLabel == "string"){
			return React.createElement('label',
				{
					className: this.appearanceProtoGetClassName("label", "CaretakerLabel"),
					htmlFor: this.state.name,
					key:"label",
					dangerouslySetInnerHTML: {__html:this.props.htmlLabel}
				}
			)
		}else if(this.props.label){
			return React.createElement('label',
				{
					className: this.appearanceProtoGetClassName("label", "CaretakerLabel"),
					htmlFor: this.state.name,
					key:"label"
				},
				this.props.label
			)
		}
		return false
	}
	appearanceGetDescription(){
		if(this.props.htmlDescription){
			return React.createElement('p',
				{
					className: this.appearanceProtoGetClassName("p", "CaretakerDescription"),
					key:"description",
					dangerouslySetInnerHTML: {__html:this.props.htmlDescription}
				}
			)
		}else if(this.props.description){
			return React.createElement('p',
				{
					className: this.appearanceProtoGetClassName("p", "CaretakerDescription"),
					key:"description"
				},
				this.props.description
			)
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
					if(this.state.value[i] != null){
						childProps.value = this.state.value[i]
					}
					if(has[i].name != null){
						childProps.name = has[i].name
						if(this.state.value[childProps.name] != null){
							childProps.value = this.state.value[childProps.name]
						}
					}
					childProps.onChange = this.getOnChangeListener()
					childProps.onReportValidity = this.onReportValidity.bind(this)
					childProps.isValidating = this.state.isValidating
					objects.push( React.createElement(CaretakerFormObject, childProps) )
				}
			}
			return objects
		}else{
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
		if(this.props.onReportValidity && this.state.isValidating && !this.state.validationUpdated){
			this.state.validationUpdated = true
			if(this.isChildless()){
				this.props.onReportValidity(this.props.required != true)
			}else{
				var isValid = true
				for(var i = 0; i<this.state.childrenCount; i++){
					if(this.state.isValidMap[i] != true){
						isValid = false
						break;
					}
				}
				this.props.onReportValidity(isValid)
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
		if(props.value){
			this.state.value = props.value
		}
	}
	getNegativeChildPropKeys(){
		return ["min","max","value","quantity","validate"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
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
		if(this.props.onChange){
			this.props.onChange(this.state.value)
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
		return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormObjectCollectionControl"), key:"control"}, (
			React.createElement('button',{className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerAddButton"),
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
					className: this.appearanceProtoGetClassName("div", "CaretakerFormObjectContainer"),
					key: i
				},
				[
					React.createElement(
						'button',
						{
							className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerNegativeButton CaretakerRemoveButton"),
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
		return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormObjectCollectionChildren"), key:"children"}, children);
	}
	render(){
		var name = this.props.name || ""
		return React.createElement(
			'div',
			{
				className: this.appearanceProtoGetClassName("div", "CaretakerFormObjectCollection " + name)
			},
			[this.appearanceGetControl(), this.appearanceGetChildren()]
		)
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
class CaretakerFormInputCheckbox extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return new Set()
	}
	loadedValueIsValid(){
		return true
	}
	transformValueBeforeLoad(value){
		var set = new Set()
		if(value != null){
			try{
				for(var i in value){
					try{
						set.add(value[i])
					}catch(e){console.error(e)}
				}
			}catch(e){console.error(e)}
		}
		return set
	}
	checkValidity(value){
		if(this.isRequired()){
			if(typeof this.props.values == "object" && this.props.values){
				if(this.state.value.size <= 0 && Object.keys(this.props.values).length > 0){
					if( Object.keys(this.props.values).length == 1 ){
						return ["Check to continue"]
					}else{
						return ["At least one option must be checked"]
					}
				}
			}
		}
		return true
	}
	transformValueBeforeSave(value){
		return Array.from(this.state.value)
	}
	onChange(index, value){
		if(this.state.value.has(index)){
			this.state.value.delete(index)
		}else{
			this.state.value.add(index)
		}
		this.updateParent()
	}
	removePropKeys(){
		return ["values","value","options"]
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

			html.push(React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormInputCheckbox"), key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: this.appearanceProtoGetClassName('div', "CaretakerFormInputCheckboxCollection")}, (
			this.getCheckboxes()
		))
	}
}

Caretaker.SpecialInput.register('checkbox',CaretakerFormInputCheckbox)

class CaretakerFormInputDate extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return ""
	}
	loadValue(props){
		this.state.value = this.getDefaultValue();
		if(props.value != null){
			var supposedValue = this.transformValueBeforeLoad(props.value)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}else if(props.defaultValue != null){
			var supposedValue = this.transformValueBeforeLoad(props.defaultValue)
			if(this.loadedValueIsValid(supposedValue)){
				this.state.value = supposedValue
			}
		}
		this.state.value = this.modifyValueAfterLoad(this.state.value) || this.state.value
	}
	updateParent(){
		if(this.props.onChange){

			this.props.onChange(this.transformValueBeforeSave(this.state.value))
		}
		this.state.validationUpdated = false
		this.setState(this.state)
	}
	transformValueBeforeLoad(valueFromData){
		if(valueFromData == ""){
			return valueFromData
		}else{
			return moment(valueFromData)
		}
	}
	loadedValueIsValid(value){
		return value == "" || moment(value).isValid()
	}
	transformValueBeforeSave(value){
		if(value){
			return moment(value).format("YYYY-MM-DD")
		}else{
			return ""
		}
	}
	checkValidity(value){
		if(this.isRequired()){
			if(value == ""){
				return ["This must be filled"]
			}
		}
		return true
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onFocus(){
		Caretaker.Widget.callDateInputWidget(this.onChange.bind(this), this.state.value)
	}
	removePropKeys(){
		return ["type","values","value","defaultValue"]
	}
	modifyProps(props){
		props.type = "text"
		if(this.state.value){
			props.value = this.state.value.format("dddd, DD MMM YYYY")
		}else{
			props.value = ""
		}
		props.className = this.appearanceProtoGetClassName("input", "CaretakerFormInputDate")
		props.onFocus = this.onFocus.bind(this)
		return props
	}
	render(){
		return React.createElement('input',this.getProps())
	}
}

Caretaker.SpecialInput.register('date',CaretakerFormInputDate)

/**
* Usage example:
* {
* 	type: "file",
* 	name: "attached_file",
* 	value: {
* 		link: "http://domain.me/fileURL",
* 		name: "fileName.ext"
* 	}
* }
*
*/
class CaretakerFormInputFile extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return false
	}
	loadedValueIsValid(value){
		if(value === false || value instanceof Caretaker.UploadedFile || (typeof value == "object" && value)){
			return true
		}
		return false
	}
	checkValidity(value){
		if(this.isRequired() && value === false){
			return ["A file must be selected"]
		}
		return true
	}
	removePropKeys(){
		return ["value","values"]
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onRemove(){
		this.state.value = false
		this.updateParent()
	}
	onWillPrompt(){
		Caretaker.UploadedFile.promptUpload(this.onChange.bind(this), this.getProps())
	}
	appearanceGetControl(){
		if(this.state.value === false){
			return React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFilePromptButton") , type:"button", onClick: this.onWillPrompt.bind(this)}, "Select File...")
		}else if(this.state.value instanceof Caretaker.UploadedFile){
			return [
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileRemoveButton"), type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, [React.createElement('i', {className: this.appearanceProtoGetClassName("i", "fa fa-remove"), key:"icon"}),"Remove"]),
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileChangeButton"), type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, [React.createElement('i',{className: this.appearanceProtoGetClassName("i", "fa fa-edit"), key:"icon"}), "Change..."]),
				React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerFormInputFilePreview"), key:"preview"}, this.state.value.getName() + "(" + this.state.value.getSize() + ")")
			]
		}else if(typeof this.state.value == "object"){
			var previewLinkProp = {}
			var name = ""
			if(this.state.value.link){
				previewLinkProp.href = this.state.value.link
				previewLinkProp.target = "_blank"
			}
			if(this.state.value.name){
				name = this.state.value.name
			}
			return [
				React.createElement('button', {className:this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileRemoveButton"), type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, [React.createElement('i', {className:this.appearanceProtoGetClassName("i", "fa fa-remove"), key:"icon"}),"Remove"] ),
				React.createElement('button', {className:this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileChangeButton"), type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, [React.createElement('i',{className:this.appearanceProtoGetClassName("i", "fa fa-edit"), key:"icon"}), "Change..."] ),
				React.createElement('div', {className:this.appearanceProtoGetClassName("div", "CaretakerFormInputFilePreview"), key:"preview"}, (
					React.createElement('a', previewLinkProp, name)
				))
			]
		}
	}
	render(){
		return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormInputFile "+(this.props.name || "") )}, this.appearanceGetControl())
	}
}

Caretaker.SpecialInput.register('file',CaretakerFormInputFile)

/** Command example
{
	type:"type",
	name:"theformradio"
	values:{
		"male":"Male",
		"female":"Female"
	},
	value: "male"
}
*/
class CaretakerFormInputRadio extends CaretakerFormInputPrototype{
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	checkValidity(value){
		if(this.isRequired()){
			if(value == ""){
				return ["An option must be selected"]
			}
		}
		return true
	}
	getDefaultValue(){
		return ""
	}
	loadedValueIsValid(value){
		return typeof value == "string"
	}
	removePropKeys(){
		return ["options","name"]
	}
	getProps(){
		var props = this.getProtoProps()
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
			props.key = i+"-radio"
			if(this.state.value == i){
				props.checked = true
			}else{
				props.checked = false
			}

			html.push(React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormInputRadio"), key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerFormInputRadioCollection")}, (
			this.getCheckboxes()
		))
	}
}

Caretaker.SpecialInput.register('radio',CaretakerFormInputRadio)

/** Command example
{
	type:"select",
	name:"gender"
	values:[
		{value:"male", text:"Male"},
		{value:"female", text:"Female"}
	],
	defaultValue: "male"
}
*/
class CaretakerFormInputSelect extends CaretakerFormInputPrototype{
	onChange(event){
		this.state.value = event.target.value
		this.updateParent()
	}
	getDefaultValue(){
		return ""
	}
	loadedValueIsValid(value){
		return typeof value == "string"
	}
	checkValidity(value){
		if(this.isRequired()){
			if(value == ""){
				return ["An option must be selected"]
			}
		}
		return true
	}
	removePropKeys(){
		return ["multiple","type","required"]
	}
	getProps(){
		var props = this.getProtoProps()
		props.value = this.state.value
		props.className = this.appearanceProtoGetClassName("select", "CaretakerFormInputSelect")
		props.onChange = this.onChange.bind(this)
		return props
	}
	appearanceGetSelect(){
		var options = this.props.values || {}
		if(typeof options != "object"){
			options = {}
		}

		var optionElements = []
		for(var i in options){
			var option = options[i]
			var value = i
			var key = i
			var text = option
			var prop = {value:value, key:key}
			optionElements.push(React.createElement('option',prop, text))
		}

		var props = this.getProps()
		var select = React.createElement('select', props, optionElements)
		return select
	}
	render(){
		return this.appearanceGetSelect()
	}
}

Caretaker.SpecialInput.register('select',CaretakerFormInputSelect)

class CaretakerFormInputTextarea extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return ""
	}
	checkValidity(value){
		if(this.isRequired() && value == ""){
			return ["This must be filled"]
		}
		return true
	}
	loadedValueIsValid(value){
		return typeof value == "string"
	}
	onChange(event){
		this.state.value = event.target.value
		this.updateParent()
	}
	removePropKeys(){
		return ["type"]
	}
	modifyProps(props){
		props.onChange = this.onChange.bind(this)
		props.className = this.appearanceProtoGetClassName("textarea", "CaretakerFormInputTextarea")
		props.value = this.state.value
	}
	getTextarea(){
		return React.createElement('textarea', this.getProps())
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormInputTextarea"}, (
			this.getTextarea()
		))
	}
}

Caretaker.SpecialInput.register('textarea',CaretakerFormInputTextarea)
Caretaker.SpecialInput.register('textarea-text',CaretakerFormInputTextarea)

class CaretakerFormInputTime extends CaretakerFormInputPrototype{
	getDefaultValue(value){
		return ""
	}
	checkValidity(value){
		if(this.isRequired() && value == ""){
			return ["This must be filled"]
		}
		return true
	}
	transformValueBeforeLoad(value){
		return moment(value, "HH:mm:ss")
	}
	loadedValueIsValid(value){
		return moment(value).isValid()
	}
	transformValueBeforeSave(value){
		if(value){
			return value.format("HH:mm:ss")
		}else{
			return ""
		}
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onFocus(){
		Caretaker.Widget.callTimeInputWidget(this.onChange.bind(this), this.state.value)
	}
	removePropKeys(){
		return ["type","values","value"]
	}
	modifyProps(props){
		props.type = "text"
		if(this.state.value){
			props.value = this.state.value.format("HH:mm:ss")
		}else{
			props.value = ""
		}
		props.className = this.appearanceProtoGetClassName("input", "CaretakerFormInputTime")
		props.onFocus = this.onFocus.bind(this)
		return props
	}
	render(){
		return React.createElement('input',this.getProps())
	}
}

Caretaker.SpecialInput.register('time',CaretakerFormInputTime)

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

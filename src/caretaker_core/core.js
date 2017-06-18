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

	var ViewClass = {
		inputMap: {}
	}
	var ViewClassPublic = {
		getClass: function(type){
			return ViewClass.inputMap[type]
		},
		register: function(type, className){
			if(ViewClass.inputMap[type]){
				console.warn('SpecialInput '+type+' has been installed and cannot be replaced with '+className)
			}else{
				ViewClass.inputMap[type] = className
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

	function checkReact(){
		if(!React || !ReactDOM){
			throw new Error("Caretaker needs React and ReactDOM. If you are using Webpack, please bind React and ReactDOM to window like this \nwindow['React'] = React  \n window['ReactDOM = ReactDOM']")
		}
	}

	function makeForm(formCommand, element){
		checkReact()
		if(typeof formCommand != "object"){
			throw new Error("Parameter formCommand must be object")
		}
		if(typeof element == "string"){
			element = document.querySelector(element)
		}
		if(!(element instanceof HTMLElement)){
			throw new Error("Parameter element must be HTMLElement")
		}

		return ReactDOM.render( React.createElement(CaretakerForm, formCommand), element )
	}

	function makeView(viewCommand, element){
		checkReact()
		if(typeof viewCommand != "object"){
			throw new Error("Parameter viewCommand must be object")
		}
		if(typeof element == "string"){
			element = document.querySelector(element)
		}
		if(!(element instanceof HTMLElement)){
			throw new Error("Parameter element must be HTMLElement")
		}

		return ReactDOM.render( React.createElement(CaretakerViewRoot, viewCommand), element )
	}

	return {
		SpecialInput:SpecialInputPublic,
		SubmissionPreprocessor:SubmissionPreprocessor,
		UploadedFile:UploadedFile,
		ValueArray:ValueArray,
		ValueNode:ValueNode,
		ViewClass:ViewClassPublic,
		Utils:Utils,
		Widget:Widget,
		StructBank:StructBank,
		makeForm:makeForm,
		makeView:makeView
	}
})();

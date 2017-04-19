var Caretaker = (function(){

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
	* Caretaker UploadedFile and UploadedFileMap
	*
	*/
	var globalInputFile
	class UploadedFile{
		static promptUpload(onChange, props){
			var inputFile = document.createElement('input')
			globalInputFile = inputFile
			var reader = new FileReader()

			//ready the props
			for(var i in props){
				inputFile.setAttribute(i, props[i])
			}

			//ready the render
			inputFile.type = "file"
			inputFile.onchange = function(e){
				var file = inputFile.files[0]

				reader.addEventListener('load', function(){
					var uploadedFile = new Caretaker.UploadedFile(file,reader.result)
					onChange(uploadedFile)
				}, false)

				if(file){
					reader.readAsDataURL(file)
				}
			}
			inputFile.click()
		}
		constructor(file, result){
			this.fileData = {
				_is_caretaker_uploaded_file: true,
				name: file.name,
				size: file.size,
				data: result
			}
		}
		getName(){
			return this.fileData.name
		}
		getSize(){
			return this.fileData.size
		}
		getData(){
			return this.fileData.data
		}
		getFileData(){
			return this.fileData
		}
	}


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

	return {
		Widget:Widget,
		UploadedFile:UploadedFile,
		SpecialInput:SpecialInputPublic
	}
})();

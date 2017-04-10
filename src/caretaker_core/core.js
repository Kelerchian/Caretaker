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

	return {
		Widget
	}
})();

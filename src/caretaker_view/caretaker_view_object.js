class CaretakerViewObject extends CaretakerViewPrototype{
	isMany(){
		return this.getUpdatedProps().quantity == "many"
	}
	isObject(){
		return this.getUpdatedProps().type == "object" || this.getUpdatedProps().type == null
	}

	appearanceGetDefaultContent(){
		var type = this.getUpdatedProps().type
		var classCandidate = Caretaker.ViewClass.getClass(type)

		if(classCandidate){
			return React.createElement(classCandidate, this.getUpdatedProps())
		}else{
			console.warn("This object doesn't have valid type:",this.getUpdatedProps())
			return ""
		}
	}

	appearanceGetCollectionContent(){
		return React.createElement(CaretakerViewCollection, this.getUpdatedProps())
	}

	appearanceGetObjectContent(){
		var hasObjects = []

		var hasModels = this.getUpdatedProps().has || []
		var objectValue = this.getUpdatedProps().value || {}

		for(var i in hasModels){
			var model = hasModels[i] || {}
			if(model.name){
				var props = Object.assign({}, model)
				props.key = model.name || String(i)
				props.value = objectValue[model.name]
				hasObjects.push(React.createElement(CaretakerViewObject,props))
			}
		}

		return hasObjects || ""
	}

	appearanceGetContent(){
		if(this.isMany()){
			return this.appearanceGetCollectionContent()
		}else if(this.isObject()){
			return this.appearanceGetObjectContent()
		}else{
			return this.appearanceGetDefaultContent()
		}
	}
	render(){
		var props = Object.assign({}, {})
		var tagName = this.getUpdatedProps().tagName || "div"
		props.className = this.appearanceProtoGetClassName(tagName,("ViewObject " + this.getUpdatedProps().name || "").trim())

		return React.createElement(
			tagName,
			props,
			this.appearanceGetContent()
		)
	}
}

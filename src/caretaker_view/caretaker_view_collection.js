class CaretakerViewCollection extends CaretakerViewPrototype{
	render(){
		var props = Object.assign({},this.getUpdatedProps())
		props.quantity = null
		var value = this.getUpdatedProps().value
		var viewObjects
		if( Array.isArray(value) && value.length > 0 ){
			viewObjects = value.map(function(value, index){
				var childProps = Object.assign({}, props)
				childProps.value = value
				childProps.key = index
				return React.createElement(CaretakerViewObject, childProps)
			})
		}else{
			viewObjects = ""
		}
		return React.createElement("div", {className: this.appearanceProtoGetClassName("div", "ViewCollection " + this.getUpdatedProps().name)}, viewObjects)
	}
}

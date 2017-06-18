class CaretakerViewRoot extends CaretakerViewPrototype{
	render(){
		var props = this.getProps()
		var childProps = props.model
		childProps.value = props.value

		return React.createElement(CaretakerViewObject, childProps)
	}
}

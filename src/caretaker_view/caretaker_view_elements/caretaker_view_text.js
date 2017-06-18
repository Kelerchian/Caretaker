class CaretakerViewText extends CaretakerViewPrototype{
	render(){
		var props = {}
		props.className = this.appearanceProtoGetClassName("span", "ViewText")
		return React.createElement('span', props, String(this.getUpdatedProps().value || ""))
	}
}
Caretaker.ViewClass.register('text', CaretakerViewText)

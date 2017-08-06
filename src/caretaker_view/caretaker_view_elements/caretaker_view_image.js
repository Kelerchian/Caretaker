class CaretakerViewImage extends CaretakerViewPrototype{
	render(){
		var props = {}
		props.className = this.appearanceProtoGetClassName("img", "ViewImage")
		return React.createElement('img', props)
	}
}
Caretaker.ViewClass.register('image', CaretakerViewImage)

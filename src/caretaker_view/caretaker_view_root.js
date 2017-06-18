class CaretakerViewRoot extends CaretakerViewPrototype{
	setValue(value){
		getViewProps()
		this.setState({
			value:value
		})
	}
	getViewProps(){
		if(!this.state){
			this.state = Object.assign({},this.getUpdatedProps().model)
			this.state.value = this.getUpdatedProps().value
		}
		return this.state
	}
	render(){
		return React.createElement(CaretakerViewObject, this.getViewProps())
	}
}

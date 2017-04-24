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
				return false
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

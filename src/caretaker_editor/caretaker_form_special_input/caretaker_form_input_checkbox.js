/** Command example
{
	type:"type",
	name:"theformcheckboxes"
	values:{
		"value":"text",
		"_rememberme":"Rememberme"
	},
	value: ["value","_rememberme"]
}
*/
class CaretakerFormInputCheckBox extends React.Component{
	constructor(props){
		super(props)

		var value = new Set()
		try{
			for(var i in props.value){
				try{
					value.add(props.value[i])
				}catch(e){}
			}
		}catch(e){}

		this.state = {
			value: value
		}
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	onChange(index, value){

		if(this.state.value.has(index)){
			this.state.value.delete(index)
		}else{
			this.state.value.add(index)
		}

		this.setState(this.state)
		this.updateParent()
	}
	getNegativePropKeys(){
		return ["values","value","options"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		return props
	}
	getCheckboxes(){
		var html = ""
		var values = this.props.values
		for(var i in values){
			if(html == ""){
				html = []
			}
			var text = values[i]
			var props = this.getProps()
			props.onChange = this.onChange.bind(this, i)
			props.key = i+"-checkbox"
			if(this.state.value.has(i)){
				props.checked = true
			}else{
				props.checked = false
			}

			html.push(React.createElement('div',{className:"CaretakerFormInputCheckBox", key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: "CaretakerFormInputCheckBoxCollection"}, (
			this.getCheckboxes()
		))
	}
}

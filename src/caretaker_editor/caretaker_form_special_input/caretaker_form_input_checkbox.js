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
class CaretakerFormInputCheckbox extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.setState(this.state)
	}
	loadValue(props){
		var value = new Set()
		if(props.value != null){
			try{
				for(var i in props.value){
					try{
						value.add(props.value[i])
					}catch(e){}
				}
			}catch(e){console.error(e)}
		}
		this.state.value = value
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(Array.from(this.state.value))
		}
		this.setState(this.state)
	}
	onChange(index, value){

		if(this.state.value.has(index)){
			this.state.value.delete(index)
		}else{
			this.state.value.add(index)
		}
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

			html.push(React.createElement('div',{className:"CaretakerFormInputCheckbox", key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: "CaretakerFormInputCheckboxCollection"}, (
			this.getCheckboxes()
		))
	}
}

Caretaker.SpecialInput.register('checkbox',CaretakerFormInputCheckbox)

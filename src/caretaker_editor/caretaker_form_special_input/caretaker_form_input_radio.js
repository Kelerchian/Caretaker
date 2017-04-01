/** Command example
{
	type:"type",
	name:"theformradio"
	values:{
		"male":"Male",
		"female":"Female"
	},
	value: "male"
}
*/
class CaretakerFormInputRadio extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.state.value = this.props.value || ""
		console.log(this.state)
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	onChange(value){
		console.log(value)
		this.state.value = value
		this.updateParent()
	}
	getNegativePropKeys(){
		return ["values","value","options","name"]
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
			props.key = i+"-radio"
			if(this.state.value == i){
				props.checked = true
			}else{
				props.checked = false
			}

			html.push(React.createElement('div',{className:"CaretakerFormInputRadio", key:i}, [
				React.createElement('input', props),
				text
			]))
		}
		return html
	}
	render(){
		var name = this.props.name || ""
		return React.createElement('div', {className: "CaretakerFormInputRadioCollection"}, (
			this.getCheckboxes()
		))
	}
}

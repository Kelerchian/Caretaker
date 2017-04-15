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
class CaretakerFormInputSelect extends React.Component{
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
		this.state.value = ""
		if(props.value){
			this.state.value = props.value
		}else if(props.defaultValue){
			this.state.value = props.defaultValue
		}
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.setState(this.state)
	}
	onChange(event){
		this.state.value = event.target.value
		this.updateParent()
	}
	getNegativePropKeys(){
		return ["value","values","multiple"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
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
			var value = option.value || i
			var key = option.value || i
			var text = option.text || i
			var prop = {value:value, key:key}
			optionElements.push(React.createElement('option',prop, text))
		}

		var props = this.getProps()
		console.log(props)
		var select = React.createElement('select', props, optionElements)
		return select
	}
	render(){
		return this.appearanceGetSelect()
	}
}

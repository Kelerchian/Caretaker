class CaretakerFormInputTextareaHTML extends React.Component{
	constructor(props){
		super(props)
		var value = props.value || ""
		var blocksFromHTML = CaretakerTextareaDependency.convertFromHTML(value)
		var state = CaretakerTextareaDependency.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
		this.state = {
			editorState: CaretakerTextareaDependency.EditorState.createWithContent(state)
		}
	}
	updateParent(){
		// if(this.props.onChange){
		// 	this.props.onChange(this.state.value)
		// }
	}
	focus(){
		this.editor.focus()
	}
	onChange(editorState){
		this.state.editorState = editorState
		this.setState(this.state)
		this.updateParent()
	}
	getNegativePropKeys(){
		return []
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.onChange.bind(this)
		props.editorState = this.state.editorState
		props.plugins = CaretakerTextareaDependency.plugins
		props.ref = (element) => { this.editor = element }
		props.key = "textarea"
		return props
	}
	getTextarea(){
		return React.createElement(CaretakerTextareaDependency.Editor, this.getProps())
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormInputTextareaHTML", onClick: this.focus.bind(this)}, (
			this.getTextarea()
		))
	}
}

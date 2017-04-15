class CaretakerFormInputTextareaHTML extends React.Component{
	constructor(props){
		super(props)
		this.state = { editorState:CaretakerTextareaDependency.EditorState.createEmpty() }
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
		if(props.value){
			var currentValue = CaretakerTextareaDependency.convertToHTML(this.state.editorState.getCurrentContent())
			var value = props.value || ""
			if(currentValue != value){
				var blocksFromHTML = CaretakerTextareaDependency.convertFromHTML(value)
				var state = CaretakerTextareaDependency.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
				this.state = {
					editorState: CaretakerTextareaDependency.EditorState.createWithContent(state)
				}
			}
		}
	}
	updateParent(){
		var value = CaretakerTextareaDependency.convertToHTML(this.state.editorState.getCurrentContent())
		if(this.props.onChange){
			this.props.onChange(value)
		}
	}
	focus(){
		this.editor.focus()
	}
	onChange(editorState){
		this.state.editorState = editorState
		this.updateParent()
	}
	getNegativePropKeys(){
		return ["type"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys().forEach(function(key){
			props[key] = null
			delete props[key]
		})
		props.onChange = this.onChange.bind(this)
		props.editorState = this.state.editorState
		props.plugins = CaretakerTextareaDependency.pluginsHTML
		props.ref = (element) => { this.editor = element }
		props.key = "textarea_html"
		return props
	}
	getTextarea(){
		return [React.createElement(CaretakerTextareaDependency.Editor, this.getProps()), React.createElement(CaretakerTextareaDependency.InlineToolbar, {key:"toolbar"})]
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormInputTextareaHTML", onClick: this.focus.bind(this)}, (
			this.getTextarea()
		))
	}
}

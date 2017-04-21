class CaretakerFormInputTextareaHTML extends React.Component{
	constructor(props){
		super(props)
		this.state = { editorState:CaretakerTextareaDependency.EditorState.createEmpty() }
		this.loadValue(props)
	}
	getLinkifier(){
		if(!this.linkifier){
			this.linkifier = CaretakerTextareaDependency.linkifyIt()
		}
		return this.linkifier
	}
	normalize(text){
		text = this.stripScript(text)
		var normalizer = document.createElement('div')
		normalizer.innerHTML = text
		var as = normalizer.querySelectorAll('a')
		for(var i in as){
			var currentA = as[i]
			if(currentA instanceof HTMLAnchorElement){
				var theHref = currentA.getAttribute("href")
				if(theHref){
					currentA.parentNode.insertBefore(document.createTextNode(theHref), currentA)
				}
				currentA.parentNode.removeChild(currentA)
			}
		}
		text = normalizer.innerHTML

		return text
	}
	stripScript(text){
		var pattern = /<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')*?<\/script>/gi
		return text.replace(pattern, "")
	}
	linkify(text){
		var linkifier = this.getLinkifier()
		var matches = linkifier.match(text)
		if(matches == null){
			return text
		}else{
			for(var i = matches.length - 1; i >= 0; i--){
				var matchValue = matches[i]
				var firstIndex = matchValue.index
				var lastIndex = matchValue.lastIndex

				var beforeMatch = text.substr(0, firstIndex)
				var theMatch = matchValue.text
				var afterMatch = text.substr(lastIndex, text.length)

				text = beforeMatch + "<a href=\""+theMatch+"\">"+theMatch+"</a>" + afterMatch
			}
			return text
		}
		return text
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
			if(props.linkify == true){
				value = this.normalize(value)
			}
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
			this.props.onChange( this.linkify(value) )
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

Caretaker.SpecialInput.register('textarea-html',CaretakerFormInputTextareaHTML)

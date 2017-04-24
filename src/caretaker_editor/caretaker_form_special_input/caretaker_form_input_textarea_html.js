class CaretakerFormInputTextareaHTML extends CaretakerFormInputPrototype{
	setInitialState(state){
		state.editorState = CaretakerTextareaDependency.EditorState.createEmpty()
		state.inlineToolbarPlugin = CaretakerTextareaDependency.pluginsHTML.createInlineToolbarPlugin(CaretakerTextareaDependency.inlineToolbarPluginParams)
		state.plugin = [
			CaretakerTextareaDependency.pluginsHTML.createUndoPlugin(),
			CaretakerTextareaDependency.pluginsHTML.createLinkifyPlugin(),
			state.inlineToolbarPlugin
		]
		state.inlineToolbar = state.inlineToolbarPlugin.InlineToolbar
		return state
	}
	getDefaultValue(){
		return ""
	}
	loadedValueIsValid(){
		return true
	}
	getLinkifier(){
		if(!this.linkifier){
			this.linkifier = CaretakerTextareaDependency.linkifyIt()
		}
		return this.linkifier
	}
	normalize(text){
		text = this.stripScript(text)
		this.state.normalizer = this.state.normalizer || document.createElement('div')
		var normalizer = this.state.normalizer
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
	getCurrentValue(){
		if(!this.state.editorState){
			this.state.editorState = CaretakerTextareaDependency.EditorState.createEmpty()
		}
		return CaretakerTextareaDependency.convertToHTML(this.state.editorState.getCurrentContent())
	}
	checkValidity(value){
		var currentValueHTML = this.getCurrentValue()
		if(this.isRequired() && currentValueHTML == ""){
			return false
		}
		return true
	}
	modifyValueAfterLoad(value){
		var currentValue = this.getCurrentValue()
		value = value || ""
		value = this.normalize(value)
		if(currentValue != value){
			var blocksFromHTML = CaretakerTextareaDependency.convertFromHTML(value)
			var contentState = CaretakerTextareaDependency.ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
			this.state.editorState = CaretakerTextareaDependency.EditorState.createWithContent(contentState)
			this.setState(this.state)
		}
	}
	transformValueBeforeLoad(value){
		return this.normalize(value)
	}
	transformValueBeforeSave(value){
		return this.linkify(CaretakerTextareaDependency.convertToHTML(this.state.editorState.getCurrentContent()))
	}
	focus(){
		this.editor.focus()
	}
	onChange(editorState){
		this.state.editorState = editorState
		this.updateParent()
	}
	removePropKeys(){
		return ["type"]
	}
	modifyProps(props){
		props.onChange = this.onChange.bind(this)
		props.editorState = this.state.editorState
		props.plugins = this.state.plugin
		props.ref = (element) => {this.editor = element}
		props.key = "textarea_html"
		return props
	}
	getTextarea(){
		return [React.createElement(CaretakerTextareaDependency.Editor, this.getProps()), React.createElement(this.state.inlineToolbar, {key:"toolbar"})]
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormInputTextareaHTML", onClick: this.focus.bind(this)}, (
			this.getTextarea()
		))
	}
}

Caretaker.SpecialInput.register('textarea-html',CaretakerFormInputTextareaHTML)

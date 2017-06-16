"";
(function(){

	class StyleButton extends React.Component {
		constructor(props) {
			super(props);
			this.onToggle = (e) => {
				e.preventDefault();
				this.latestProps.onToggle(this.latestProps.style);
			};
		}
		render() {
			let className = CaretakerFormElementPrototype.appearanceProtoGetClassName(this.latestProps, "span", "TextareaHTML__StyleButton");
			if (this.latestProps.active) {
				className += ' active';
			}
			return (
				React.createElement('span',{
					className: className,
					onMouseDown: this.onToggle
				},(
					this.latestProps.label
				))
			);
		}
	}

	var BLOCK_TYPES = [
		{label: 'H1', style: 'header-one'},
		{label: 'H2', style: 'header-two'},
		{label: 'H3', style: 'header-three'},
		{label: 'H4', style: 'header-four'},
		{label: 'H5', style: 'header-five'},
		{label: 'H6', style: 'header-six'},
		{label: 'Blockquote', style: 'blockquote'},
		{label: 'UL', style: 'unordered-list-item'},
		{label: 'OL', style: 'ordered-list-item'}
	];

	var INLINE_STYLES = [
		{label: 'Bold', style: 'BOLD'},
		{label: 'Italic', style: 'ITALIC'},
		{label: 'Underline', style: 'UNDERLINE'},
		{label: 'Monospace', style: 'CODE'}
	];

	var BlockTypeControls = function(props){
		var editorState = props.editorState
		var selection = editorState.getSelection()
		var blockType = editorState
			.getCurrentContent()
			.getBlockForKey(selection.getStartKey())
			.getType()


		return React.createElement("div",{
			className:CaretakerFormElementPrototype.appearanceProtoGetClassName(props, "div", "TextareHTML__Controls"),
			key:"block"
		},(
			BLOCK_TYPES.map(function(type){
				return React.createElement(StyleButton, {
					key: type.label,
					active: type.style == blockType,
					label: type.label,
					onToggle: props.onToggle,
					style: type.style
				})
			})
		))
	}

	var InlineStyleControls = function(props){
		var currentStyle = props.editorState.getCurrentInlineStyle()
		return React.createElement('div',{
			className:CaretakerFormElementPrototype.appearanceProtoGetClassName(props, "div", "TextareHTML__Controls"),
			key: "inline"
		},(
			INLINE_STYLES.map(function(type){
				return React.createElement(StyleButton, {
					key: type.label,
					active: currentStyle.has(type.style),
					label: type.label,
					onToggle: props.onToggle,
					style: type.style
				})
			})
		))
	}

	// Caretaker.StructBank.register('CaretakerFormInputPrototype.StyleButton', StyleButton)
	Caretaker.StructBank.register('CaretakerFormInputPrototype.MakeBlockTypeControls', BlockTypeControls)
	Caretaker.StructBank.register('CaretakerFormInputPrototype.MakeInlineStyleControls', InlineStyleControls)

}());

class CaretakerFormInputTextareaHTML extends CaretakerFormInputPrototype{
	setInitialState(state){
		var DraftJS = Caretaker.StructBank.get('draft-js')
		state.editorState = DraftJS.EditorState.createEmpty()

		this.toggleBlockType = this._toggleBlockType.bind(this)
		this.toggleInlineStyle = this._toggleInlineStyle.bind(this)
		this.onTab = this._onTab.bind(this)

		return state
	}

	getDefaultValue(){
		return ""
	}

	loadedValueIsValid(){
		return true
	}

	/*@custom*/
	stripScript(text){
		var pattern = /<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')*?<\/script>/gi
		return text.replace(pattern, "")
	}

	/*@custom*/
	getCurrentValue(){
		var DraftJS = Caretaker.StructBank.get("draft-js")
		if(!this.state.editorState){
			this.state.editorState = DraftJS.EditorState.createEmpty()
		}
		return Caretaker.StructBank.get("draft-convert").convertToHTML(this.state.editorState.getCurrentContent())
	}

	/*@custom*/
	checkHasContent(html){
		this.state.normalizer = this.state.normalizer || document.createElement('div')
		var normalizer = this.state.normalizer
		normalizer.innerHTML = html
		if(normalizer.innerText.trim() == ""){
			return false
		}else{
			return true
		}
	}

	transformValueBeforeSave(value){
		return this.getCurrentValue()
	}

	modifyValueAfterLoad(value){
		var currentValue = this.getCurrentValue()
		value = value || ""
		value = this.stripScript(value)
		if(currentValue != value){
			var blocksFromHTML = Caretaker.StructBank.get('draft-js').convertFromHTML(value)
			var contentState = Caretaker.StructBank.get('draft-js').ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
			this.state.editorState = Caretaker.StructBank.get('draft-js').EditorState.createWithContent(contentState)
		}
	}

	checkValidity(){
		var currentValueHTML = this.getCurrentValue()
		if(this.isRequired() && !this.checkHasContent(currentValueHTML)){
			return "This field must be filled"
		}
		return true
	}

	/*@custom*/
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

	/*@custom*/
	handleKeyCommand(command){
		const newState = Caretaker.StructBank.get("draft-js").RichUtils.handleKeyCommand(this.state.editorState, command)
		if(newState){
			this.onChange(newState)
			return true
		}
		return false
	}

	modifyProps(props){
		props.onChange = this.onChange.bind(this)
		props.handleKeyCommand = this.handleKeyCommand.bind(this)
		props.editorState = this.state.editorState
		props.onTab = this._onTab.bind(this)
		props.ref = (element) => {this.editor = element}
		return props
	}

	_onTab(e){
		const maxDepth = 4
		this.onChange(Caretaker.StructBank.get("draft-js").RichUtils.onTab(e, this.state.editorState, maxDepth))
	}

  _toggleBlockType(blockType) {
    this.onChange(
      Caretaker.StructBank.get("draft-js").RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      Caretaker.StructBank.get("draft-js").RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

	/*@custom*/
	appearanceGetTextarea(){
		return React.createElement('div',{className:this.appearanceProtoGetClassName("div", "TextareaHTML__textarea"), key:"textarea"},(
			React.createElement(Caretaker.StructBank.get('draft-js').Editor, this.getProps())
		))
	}

	/*@custom*/
	appearanceGetControl(){
		var blockTypeProps = {
			editorState: this.state.editorState,
			onToggle: this.toggleBlockType,
			className: this.latestProps.className
		}
		var inlineStyleProps = {
			editorState: this.state.editorState,
			onToggle: this.toggleInlineStyle,
			className: this.latestProps.className
		}

		return React.createElement('div',{
			className: this.appearanceProtoGetClassName("div","TextareaHTML__control"),
			key: "controls"
		},[
			Caretaker.StructBank.get('CaretakerFormInputPrototype.MakeBlockTypeControls')(blockTypeProps),
			Caretaker.StructBank.get('CaretakerFormInputPrototype.MakeInlineStyleControls')(inlineStyleProps)
		])
	}

	render(){
		return React.createElement('div',{
			className: this.appearanceProtoGetClassName("div", "TextareaHTML"),
			onClick: this.focus.bind(this)
		},(
			[
				this.appearanceGetControl(),
				this.appearanceGetTextarea()
			]
		))
	}
}

// class CaretakerFormInputTextareaHTML extends CaretakerFormInputPrototype{
// 	setInitialState(state){
// 		state.editorState = Caretaker.StructBank.get('draft-js').EditorState.createEmpty()
// 		state.plugin = [
// 			Caretaker.StructBank.get('draft-js').pluginsHTML.createUndoPlugin(),
// 			Caretaker.StructBank.get('draft-js').pluginsHTML.createLinkifyPlugin(),
// 		]
// 		this.Rich = Caretaker.StructBank.get('draft-js').RichUtils
// 		return state
// 	}
// 	_onBoldClick(){
// 		this.onChange(this.Rich.toggleInlineStyle(this.state.editorState, 'BOLD'))
// 	}
// 	_onItalicClick(){
// 		this.onChange(this.Rich.toggleInlineStyle(this.state.editorState, 'ITALIC'))
// 	}
// 	_onUnderlineClick(){
// 		this.onChange(this.Rich.toggleInlineStyle(this.state.editorState, 'UNDERLINE'))
// 	}
// 	handleKeyCommand(command){
// 		const newState = this.Rich.handleKeyCommand(this.state.editorState, command)
// 		if(newState){
// 			this.onChange(newState)
// 			return 'handled'
// 		}
// 		return 'not-handled'
// 	}
// 	getDefaultValue(){
// 		return ""
// 	}
// 	loadedValueIsValid(){
// 		return true
// 	}
// 	getLinkifier(){
// 		if(!this.linkifier){
// 			this.linkifier = Caretaker.StructBank.get('draft-js').linkifyIt()
// 		}
// 		return this.linkifier
// 	}
// 	normalize(text){
// 		text = text || ""
// 		text = this.stripScript(text)
// 		this.state.normalizer = this.state.normalizer || document.createElement('div')
// 		var normalizer = this.state.normalizer
// 		normalizer.innerHTML = text
// 		var as = normalizer.querySelectorAll('a')
// 		for(var i in as){
// 			var currentA = as[i]
// 			if(currentA instanceof HTMLAnchorElement){
// 				var theHref = currentA.getAttribute("href")
// 				if(theHref){
// 					currentA.parentNode.insertBefore(document.createTextNode(theHref), currentA)
// 				}
// 				currentA.parentNode.removeChild(currentA)
// 			}
// 		}
// 		text = normalizer.innerHTML
//
// 		return text
// 	}
// 	stripScript(text){
// 		var pattern = /<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')*?<\/script>/gi
// 		return text.replace(pattern, "")
// 	}
// 	linkify(text){
// 		var linkifier = this.getLinkifier()
// 		var matches = linkifier.match(text)
// 		if(matches == null){
// 			return text
// 		}else{
// 			for(var i = matches.length - 1; i >= 0; i--){
// 				var matchValue = matches[i]
// 				var firstIndex = matchValue.index
// 				var lastIndex = matchValue.lastIndex
//
// 				var beforeMatch = text.substr(0, firstIndex)
// 				var theMatch = matchValue.text
// 				var afterMatch = text.substr(lastIndex, text.length)
//
// 				text = beforeMatch + "<a href=\""+theMatch+"\">"+theMatch+"</a>" + afterMatch
// 			}
// 			return text
// 		}
// 		return text
// 	}
// 	checkHasContent(html){
// 		this.state.normalizer = this.state.normalizer || document.createElement('div')
// 		var normalizer = this.state.normalizer
// 		normalizer.innerHTML = html
// 		if(normalizer.innerText.trim() == ""){
// 			return false
// 		}else{
// 			return true
// 		}
// 	}
// 	getCurrentValue(){
// 		if(!this.state.editorState){
// 			this.state.editorState = Caretaker.StructBank.get('draft-js').EditorState.createEmpty()
// 		}
// 		return Caretaker.StructBank.get('draft-convert').convertToHTML(this.state.editorState.getCurrentContent())
// 	}
// 	checkValidity(){
// 		var currentValueHTML = this.getCurrentValue()
// 		if(this.isRequired() && !this.checkHasContent(currentValueHTML)){
// 			return "This must be filled"
// 		}
// 		return true
// 	}
// 	modifyValueAfterLoad(value){
// 		var currentValue = this.getCurrentValue()
// 		value = value || ""
// 		value = this.normalize(value)
// 		if(currentValue != value){
// 			var blocksFromHTML = Caretaker.StructBank.get('draft-js').convertFromHTML(value)
// 			var contentState = Caretaker.StructBank.get('draft-js').ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
// 			this.state.editorState = Caretaker.StructBank.get('draft-js').EditorState.createWithContent(contentState)
// 		}
// 	}
// 	transformValueBeforeLoad(value){
// 		return this.normalize(value)
// 	}
// 	transformValueBeforeSave(value){
// 		return this.linkify(Caretaker.StructBank.get('draft-convert').convertToHTML(this.state.editorState.getCurrentContent()))
// 	}
// 	focus(){
// 		this.editor.focus()
// 	}
// 	onChange(editorState){
// 		this.state.editorState = editorState
// 		this.updateParent()
// 	}
// 	removePropKeys(){
// 		return ["type"]
// 	}
// 	modifyProps(props){
// 		props.onChange = this.onChange.bind(this)
// 		props.handleKeyCommand = this.handleKeyCommand.bind(this)
// 		props.editorState = this.state.editorState
// 		props.plugins = this.state.plugin
// 		props.ref = (element) => {this.editor = element}
// 		props.key = "textarea_html"
// 		return props
// 	}
// 	getTextarea(){
// 		return React.createElement(Caretaker.StructBank.get('draft-js').Editor, this.getProps())
// 	}
// 	render(){
// 		return React.createElement('div',{className: this.appearanceProtoGetClassName("textarea-html", "CaretakerFormInputTextareaHTML"), onClick: this.focus.bind(this)}, (
// 			this.getTextarea()
// 		))
// 	}
// }
Caretaker.SpecialInput.register('textarea-html',CaretakerFormInputTextareaHTML)

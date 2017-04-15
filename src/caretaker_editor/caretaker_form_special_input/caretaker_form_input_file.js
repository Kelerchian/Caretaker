/**
* Usage example:
* {
* 	type: "file",
* 	name: "attached_file",
* 	value: {
* 		link: "http://domain.me/fileURL",
* 		name: "fileName.ext"
* 	}
* }
*
*/
class CaretakerFormInputFile extends React.Component{
	constructor(props){
		super(props)
		this.state = {}
		this.loadValue(props)
	}
	loadValue(props){
		this.state.value = null
		if(props.value != null){
			this.state.value = props.value
		}
	}
	componentDidMount(){
		this.updateParent()
	}
	componentWillReceiveProps(props){
		this.loadValue(props)
		this.setState(this.state)
	}
	updateParent(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
		this.setState(this.state)
	}
	getNegativePropKeys(){
		return ["value","values"]
	}
	getProps(){
		var props = Object.assign({}, this.props)
		this.getNegativePropKeys(function(key){
			props[key] = null
			delete props[key]
		})
		return props
	}
	onChange(value){
		this.state.value = value
		this.updateParent()
	}
	onRemove(){
		this.state.value = null
		this.updateParent()
	}
	onWillPrompt(){
		Caretaker.UploadedFile.promptUpload(this.onChange.bind(this), this.getProps())
	}
	appearanceGetControl(){
		if(this.state.value == null){
			return React.createElement('button', {className:"CaretakerButton CaretakerFormInputFilePromptButton", type:"button", onClick: this.onWillPrompt.bind(this)}, "Select File...")
		}else if(this.state.value instanceof Caretaker.UploadedFile){
			return [
				React.createElement('button', {className:"CaretakerButton CaretakerFormInputFileRemoveButton", type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, "Remove"),
				React.createElement('button', {className:"CaretakerButton CaretakerFormInputFileChangeButton", type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, "Change..."),
				React.createElement('div', {className:"CaretakerFormInputFilePreview", key:"preview"}, this.state.value.getName() + "(" + this.state.value.getSize() + ")")
			]
		}else if(typeof this.state.value == "object"){
			var previewLinkProp = {}
			var name = ""
			if(this.state.value.link){
				previewLinkProp.href = this.state.value.link
				previewLinkProp.target = "_blank"
			}
			if(this.state.value.name){
				name = this.state.value.name
			}
			return [
				React.createElement('button', {className:"CaretakerButton CaretakerFormInputFileRemoveButton", type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, "Remove" ),
				React.createElement('button', {className:"CaretakerButton CaretakerFormInputFileChangeButton", type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, "Change..." ),
				React.createElement('div', {className:"CaretakerFormInputFilePreview", key:"preview"}, (
					React.createElement('a', previewLinkProp, name)
				))
			]
		}
	}
	render(){
		return React.createElement('div',{className: "CaretakerFormInputFile "+(this.props.name || "")}, this.appearanceGetControl())
	}
}

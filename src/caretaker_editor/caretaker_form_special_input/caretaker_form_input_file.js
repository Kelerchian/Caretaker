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
class CaretakerFormInputFile extends CaretakerFormInputPrototype{
	getDefaultValue(){
		return null
	}
	loadedValueIsValid(value){
		if(value != null && !(value instanceof Caretaker.UploadedFile) && typeof value != "object"  ){
			return false
		}
		return true
	}
	checkValidity(value){
		if(this.isRequired() && value == null){
			return ["A file must be selected"]
		}
		return true
	}
	removePropKeys(){
		return ["value","values"]
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
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileRemoveButton"), type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, [React.createElement('i', {className: this.appearanceProtoGetClassName("i", "fa fa-remove"), key:"icon"}),"Remove"]),
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileChangeButton"), type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, [React.createElement('i',{className: this.appearanceProtoGetClassName("i", "fa fa-edit"), key:"icon"}), "Change..."]),
				React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerFormInputFilePreview"), key:"preview"}, this.state.value.getName() + "(" + this.state.value.getSize() + ")")
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
				React.createElement('button', {className:this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileRemoveButton"), type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, [React.createElement('i', {className:this.appearanceProtoGetClassName("i", "fa fa-remove"), key:"icon"}),"Remove"] ),
				React.createElement('button', {className:this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileChangeButton"), type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, [React.createElement('i',{className:this.appearanceProtoGetClassName("i", "fa fa-edit"), key:"icon"}), "Change..."] ),
				React.createElement('div', {className:this.appearanceProtoGetClassName("div", "CaretakerFormInputFilePreview"), key:"preview"}, (
					React.createElement('a', previewLinkProp, name)
				))
			]
		}
	}
	render(){
		return React.createElement('div',{className: this.appearanceProtoGetClassName("div", "CaretakerFormInputFile "+(this.props.name || "") )}, this.appearanceGetControl())
	}
}

Caretaker.SpecialInput.register('file',CaretakerFormInputFile)

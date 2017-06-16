/*
* Explanation: the first parameter 'image'
* will be used when you pass object
*
*	{
*	 type: "image",
*	 name: "your image",
*	 ...etcetera etcetera
*	}
*
*
*
* I assume you have a good understanding using React to extend the FormInput
*
*/
class CaretakerFormInputImage extends CaretakerFormInputPrototype{

	/*
	* Extended function
	* This is not needed if you are going to return null anyway, but you can change your defaultValue this way.
	* This value will be overwritten by your data
	*/
	getDefaultValue(){
		return false
	}

	/*
	* Extended function
	* It is called when default value is assigned to this.state.value
	* default is "return true" so it's kinda useless on default
	*/
	loadedValueIsValid(value){
		if(value instanceof Caretaker.UploadedFile){
			return true
		}else if(typeof value == "object" && value && value.link != null){
			return true
		}else if(value == false){			//don't forget to include your defaultValue
			return true
		}
		return false
	}

	/**
	* Extended function
	*/
	checkValidity(value){
		if(this.isRequired() && value === false){
			return ["An image must be selected"]
		}
		return true
	}


	/*
	* Extended Function
	* The parameter is absolutely yours to decide.
	* IMPORTANT:
	*		- this.state.value is an important variable, you must save your value in this variable, if you want this pushed to your whole form value
	*		- you should remember to call this.updateParent() this handles the value pushing mechanism and the this.setState()
	*		- don't judge me on the absent of this.setState() function call
	*/
	onChange(value){
		this.state.value = value
		this.updateParent()
		var setState = this.setState.bind(this)
		var onRemove = this.onRemove.bind(this)
		Caretaker.Utils.getBase64Async(this.state.value.getOriginalFile(),
			function(result){	//OnSuccess
				setState({
					imageData: result
				})
			},
			function(error){
				onRemove()
			}
		)
	}

	/*
	* Not an extended function
	*/
	onRemove(){
		this.state.value = false
		this.state.imageData = null
		this.updateParent()
	}

	/*
	* Not an Extended Function
	* I assign this function when upload button is pressed so that it will trigger the promptUpload
	*/
	onWillPrompt(){
		// The promptUpload will trigger upload dialog
		// This is CaretakerCore function not intended for you to use
		Caretaker.UploadedFile.promptUpload( this.onChange.bind(this), this.getProps() )
	}

	/**
	* modifyProps and getRemovedPropKeys is extended function
	* This is defaultValue to show you what it contains, no changes in it
	*/
	getRemovedPropKeys(){
		//the keys which will be deleted when passed
		return ["value","values","defaultValue"]
	}
	modifyProps(props){
		props.accept = "image/*"
	}

	/*
	* Not an extended function
	* My style of coding, don't follow if you don't agree
	* Making render function uncluttered
	*/
	appearanceGetControl(){
		//Don't forget to handle all your state
		if(this.state.value === false){
			var control = []
			control.push(React.createElement('button', {className: this.appearanceProtoGetClassName("button","CaretakerButton CaretakerFormInputFilePromptButton") , key:"selectButton", type:"button", onClick: this.onWillPrompt.bind(this)}, "Select Image..."))
			if(this.latestProps.placeholder){
				control.push(React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerFormInputFilePreview"), key:"preview"}, (
					React.createElement('img', {src:this.latestProps.placeholder, className: this.appearanceProtoGetClassName("img", "CaretakerFormInputFilePreviewImage"), title:"placeholder", alt:"placeholder"})
				)))
			}
			return control

		}else if(this.state.value instanceof Caretaker.UploadedFile){
			var previewProps = {
				title:this.state.value.getName(),
				alt:this.state.value.getName(),
				className: this.appearanceProtoGetClassName("img", "CaretakerFormInputFilePreviewImage")
			}
			if(this.state.imageData){
				previewProps.src = this.state.imageData
			}
			return [
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileRemoveButton"), type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, [React.createElement('i', {className: this.appearanceProtoGetClassName("i", "fa fa-remove"), key:"icon"}),"Remove"]),
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileChangeButton"), type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, [React.createElement('i',{className: this.appearanceProtoGetClassName("i", "fa fa-edit"), key:"icon"}), "Change..."]),
				React.createElement('div', {className: this.appearanceProtoGetClassName("div", "CaretakerFormInputFilePreview"), key:"preview"}, (
					React.createElement('img', previewProps)
				))
			]
		}else if(typeof this.state.value == "object"){
			var link = this.state.value.link || ""
			return [
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileRemoveButton"), type:"button", key:"removeButton", onClick: this.onRemove.bind(this)}, [React.createElement('i', {className: this.appearanceProtoGetClassName("i", "fa fa-remove"), key:"icon"}),"Remove"] ),
				React.createElement('button', {className: this.appearanceProtoGetClassName("button", "CaretakerButton CaretakerFormInputFileChangeButton"), type:"button", key:"changeButton", onClick: this.onWillPrompt.bind(this)}, [React.createElement('i',{className: this.appearanceProtoGetClassName("i", "fa fa-edit"), key:"icon"}), "Change..."] ),
				React.createElement('div', {className: this.appearanceProtoGetClassName("div","CaretakerFormInputFilePreview"), key:"preview"}, (
					React.createElement('img', {src: link, title: link, alt: link, className: this.appearanceProtoGetClassName("img", "CaretakerFormInputFilePreviewImage")})
				))
			]
		}
	}

	/*
	*/
	render(){
		return React.createElement('div',{className: "CaretakerFormInputImage "+(this.latestProps.name || "")}, this.appearanceGetControl())
	}
}

/*
* Install your SpecialInput
* This way:
*/
Caretaker.SpecialInput.register('image',CaretakerFormInputImage)

/*
* Additional Notes: you might want to see CaretakerFormInputPrototype class
*/

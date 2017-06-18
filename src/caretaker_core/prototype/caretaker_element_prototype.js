class CaretakerElementPrototype extends React.Component{
	constructor(props){
		super(props)
		this.updateProps(props)
	}
	componentWillReceiveProps(props){
		this.updateProps(props)
	}
	updateProps(props){
		this.updatedProps = props
	}
	getUpdatedProps(){
		return this.updatedProps || this.props
	}

	appearanceProtoGetAdditionalClassName(classKeys){
		return this.constructor.appearanceProtoGetAdditionalClassName(this.getUpdatedProps() || this.props, classKeys)
	}

	static appearanceProtoGetAdditionalClassName(props, classKeys){
		if( Array.isArray(classKeys) ){
			if( props.className && typeof props.className == "object" ){
				var additionals = []
				for(var i in classKeys){
					var classKey = classKeys[i]
					if(props.className[classKey]){
						additionals.push(props.className[classKey])
					}
				}
				return " " + additionals.join(' ') + " "
			}
		}else{
			console.warn("Error : appearanceProtoGetAdditionalClassName : " + classNames )
		}
		return ""
	}

	static appearanceProtoGetClassName(props, tag, className){

		if(className == null){
			return this.appearanceProtoGetClassName(props, null, tag)
		}

		className = String(className)
		tag = String(tag)

		var retClassName = className
		retClassName += this.appearanceProtoGetAdditionalClassName(props, (function(){
			var classKeyArray = []
			if(tag != null){
				classKeyArray.push(tag)
			}
			className.split(' ').forEach(function(classKey){
				classKeyArray.push("."+classKey.trim())
			})
			return classKeyArray
		}()) )
		return " " + retClassName + " "
	}

	appearanceProtoGetClassName(tag, className){
		return this.constructor.appearanceProtoGetClassName(this.getUpdatedProps() || this.props, tag, className)
	}
}

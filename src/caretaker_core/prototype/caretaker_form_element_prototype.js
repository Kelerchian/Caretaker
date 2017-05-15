class CaretakerFormElementPrototype extends React.Component{
	appearanceGetAdditionalClassname(subClassName){
		if(subClassName == null){
			if(typeof this.props.className == "string"){
				return " "+this.props.className+" "
			}
		}else if(typeof subClassName == "string"){
			if(this.props.className && typeof this.props.className == "object" && typeof this.props.className[subClassName] == "string"){
				return " "+this.props.className[subClassName]+" "
			}
		}else if(Array.isArray(subClassName)){
			if(this.props.className && typeof this.props.className == "object"){
				var classNames = []
				for(var i in subClassName){
					var subClassNameSingle = subClassName[i]
					if(typeof this.props.className[subClassNameSingle] == "string"){
						className.push(this.props.className[subClassNameSingle])
					}
				}
				return " " + className.join(' ') + " "
			}
		}
		return "";
	}

	appearanceProtoGetAdditionalClassName(classKeys){
		if( Array.isArray(classKeys) ){
			if( this.props.className && typeof this.props.className == "object" ){
				var additionals = []
				for(var i in classKeys){
					var classKey = classKeys[i]
					if(this.props.className[classKey]){
						additionals.push(classKey)
					}
				}
				return " " + additionals.join(' ') + " "
			}
		}else{
			console.warn("Error : appearanceProtoGetAdditionalClassName : " + classNames )
		}
		return ""
	}

	appearanceProtoGetClassName(tag, className){
		if(arguments.length == 1){
			return this.appearanceProtoGetClassName(null, tag)
		}

		var retClassName = className
		retClassName += this.appearanceProtoGetAdditionalClassName( (function(){
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
}

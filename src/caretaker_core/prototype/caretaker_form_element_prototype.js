class CaretakerFormElementPrototype extends React.Component{

	appearanceProtoGetAdditionalClassName(classKeys){
		if( Array.isArray(classKeys) ){
			if( this.props.className && typeof this.props.className == "object" ){
				var additionals = []
				for(var i in classKeys){
					var classKey = classKeys[i]
					if(this.props.className[classKey]){
						additionals.push(this.props.className[classKey])
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

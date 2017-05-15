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
}

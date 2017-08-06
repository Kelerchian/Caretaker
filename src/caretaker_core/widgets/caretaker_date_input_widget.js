class CaretakerDateInputWidget extends React.Component{
	constructor(props){
		super(props)

		var currentValue = moment(props.value)
		if(!moment(props.value).isValid()){
			currentValue = moment()
		}
		this.state = {
			oldValue : props.value,
			lastValidValue: moment(currentValue),
			value : moment(currentValue)
		}
	}
	submitChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	clearChange(){
		if(this.props.onChange){
			this.props.onChange("")
		}
	}
	cancelChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.oldValue)
		}
	}
	checkValidity(){
		this.state.value = moment(this.state.value)
		if(this.state.value.isValid()){
			this.state.lastValidValue = moment(this.state.value)
		}else{
			this.state.value = moment(this.state.lastValidValue)
		}
		this.setState(this.state)
	}
	changeDay(e){
		var day = e.target.value
		this.state.value.date(day)
		this.checkValidity()
	}
	changeMonth(e){
		var month = e.target.value
		this.state.value.month(month)
		this.checkValidity()
	}
	changeYear(e){
		var year = e.target.value
		this.state.value.year(year)
		this.checkValidity()
	}
	appearanceGetInputs(){
		var minDay = 1;
		var maxDay = moment(this.state.value).endOf("month").date()
		var minMonth = 0;
		var maxMonth = 12;
		var modifier = moment(this.state.value)
		var widget = this

		var day = React.createElement('div',{key:"day"},[
			React.createElement('label',{key:"label", className:"Label"},"Day"),
			React.createElement('select',{onChange: this.changeDay.bind(this),value:this.state.value.date(), key:"day"}, (function(){
				var options = []
				for(var i = minDay; i<=maxDay; i++){
					modifier.date(i)
					options.push( React.createElement('option',{value:i,key:i}, modifier.format("Do (dddd)")) )
				}
				return options
			}()))
		])

		var month = React.createElement('div',{key:"month"},[
			React.createElement('label',{key:"label", className:"Label"},"Month"),
			React.createElement('select',{onChange: this.changeMonth.bind(this),value:this.state.value.month(), key:"month"}, (function(){
				var options = []
				modifier.date(1)
				for(var i = minMonth; i<=maxMonth; i++){
					modifier.month(i)
					options.push( React.createElement('option',{value:i,key:i}, modifier.format("MMMM")) )
				}
				return options
			}()))
		])

		var year = React.createElement('div',{key:"year"}, [
			React.createElement('label',{key:"label", className:"Label"},"Year"),
			React.createElement('input',{onChange: this.changeYear.bind(this), key:"input" ,type:"number",min:"1970", value:this.state.value.year()})
		])

		return [day,month,year]
	}
	appearanceGetActions(){
		var saveButton = React.createElement('button',{key:"save",className:"Button PositiveButton",onClick: this.submitChange.bind(this)},"Save")
		var clearButton = React.createElement('button',{key:"clear",className:"Button",onClick: this.clearChange.bind(this)},"Clear")
		var cancelButton = React.createElement('button',{key:"cancel",className:"Button Negative",onClick: this.cancelChange.bind(this)},"Cancel")
		return [saveButton, clearButton, cancelButton]
	}
	render(){
		return React.createElement('div',{onClick: this.props.widgetOnClick, className:"CaretakerWidget CaretakerDateInputWidget"}, [
			React.createElement('div',{className:"CaretakerInputContainer", key:"container"}, this.appearanceGetInputs()),
			React.createElement('div',{className:"CaretakerActionButtons", key:"actions"}, this.appearanceGetActions())
		])
	}
}

class CaretakerDateInputWidget extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			oldValue : moment(props.value),
			lastValidValue: moment(props.value),
			value : moment(props.value)
		}
	}
	submitChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.value)
		}
	}
	cancelChange(){
		if(this.props.onChange){
			this.props.onChange(this.state.oldValue)
		}
	}
	checkValidity(){
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

		var day = React.createElement('select',{onChange: this.changeDay.bind(this),value:this.state.value.date(), key:"day"}, (function(){
			var options = []
			for(var i = minDay; i<=maxDay; i++){
				modifier.date(i)
				options.push( React.createElement('option',{value:i,key:i}, modifier.format("dddd Do")) )
			}
			return options
		}()))

		var month = React.createElement('select',{onChange: this.changeMonth.bind(this),value:this.state.value.month(), key:"month"}, (function(){
			var options = []
			modifier.date(1)
			for(var i = minMonth; i<=maxMonth; i++){
				modifier.month(i)
				options.push( React.createElement('option',{value:i,key:i}, modifier.format("MMMM")) )
			}
			return options
		}()))

		var year = React.createElement('input',{onChange: this.changeYear.bind(this),type:"number",min:"1970", key:"year", value:this.state.value.year()})

		return [day,month,year]
	}
	appearanceGetActions(){
		var saveButton = React.createElement('button',{key:"save",className:"SaveButton",onClick: this.submitChange.bind(this)},"Save")
		var cancelButton = React.createElement('button',{key:"cancel",className:"cancelButton",onClick: this.cancelChange.bind(this)},"Cancel")
		return [saveButton, cancelButton]
	}
	render(){
		return React.createElement('div',{onClick: this.props.widgetOnClick, className:"CaretakerWidget CaretakerDateInputWidget"}, [
			React.createElement('div',{className:"CaretakerInputContainer", key:"container"}, this.appearanceGetInputs()),
			React.createElement('div',{className:"CaretakerActionButtons", key:"actions"}, this.appearanceGetActions())
		])
	}
}

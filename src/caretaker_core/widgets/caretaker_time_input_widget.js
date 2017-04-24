class CaretakerTimeInputWidget extends React.Component{
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
	changeHour(e){
		var hour = e.target.value
		this.state.value.hour(hour)
		this.checkValidity()
	}
	changeMinute(e){
		var minute = e.target.value
		this.state.value.minute(minute)
		this.checkValidity()
	}
	changeSecond(e){
		var second = e.target.value
		this.state.value.second(second)
		this.checkValidity()
	}
	appearanceGetInputs(){
		var minHour = 0;
		var maxHour = 23;
		var minMinute = 0;
		var maxMinute = 59;
		var minSecond = 0;
		var maxSecond = 59;

		var hour 	= React.createElement('div',{key:"hour"},[
			React.createElement('label', { className:"CaretakerLabel", key:"label" }, "Hour"),
			React.createElement('input', { onChange:this.changeHour.bind(this), value: this.state.value.hour(), key:"input" })
		])
		var minute 	= React.createElement('div',{key:"minute"},[
			React.createElement('label', { className:"CaretakerLabel", key:"label" }, "Minute"),
			React.createElement('input', { onChange:this.changeMinute.bind(this), value: this.state.value.minute(), key:"input" })
		])
		var second 	= React.createElement('div',{key:"second"},[
			React.createElement('label', { className:"CaretakerLabel", key:"label" }, "Second"),
			React.createElement('input', { onChange:this.changeSecond.bind(this), value:this.state.value.second(), key:"input" })
		])

		return [hour,minute,second]
	}
	appearanceGetActions(){
		var saveButton = React.createElement('button',{key:"save",className:"CaretakerButton CaretakerPositiveButton",onClick: this.submitChange.bind(this)},"Save")
		var clearButton = React.createElement('button',{key:"clear",className:"CaretakerButton",onClick: this.clearChange.bind(this)},"Clear")
		var cancelButton = React.createElement('button',{key:"cancel",className:"CaretakerButton CaretakerNegativeButton",onClick: this.cancelChange.bind(this)},"Cancel")
		return [saveButton, clearButton, cancelButton]
	}
	render(){
		return React.createElement('div',{onClick: this.props.widgetOnClick, className:"CaretakerWidget CaretakerTimeInputWidget"}, [
			React.createElement('div',{className:"CaretakerInputContainer", key:"container"}, this.appearanceGetInputs()),
			React.createElement('div',{className:"CaretakerActionButtons", key:"actions"}, this.appearanceGetActions())
		])
	}
}

class UserDisplay extends React.Component{
	constructor(){
		super();
		this.state = {
			"name": "",
			"subtext": "",
			"image": ""
		}
	}
	render(){
		var elements = []
		if(this.state.image){
			var attrib = {
				key: 'image',
				src: this.state.image
			}
			elements.push( React.createElement('img', attrib) )
		}
		elements.push( React.createElement('div', { key:"identity", className:"identity"}, [
			React.createElement('h6', {"key":"name"}, this.state.name),
			React.createElement('small', {"key":"subtext"}, this.state.subtext)
		]) )

		return React.createElement('div', {className: "UserDisplay"}, elements)
	}
}

class UserDisplayInline extends React.Component{
	constructor(){
		super();
		this.state = {
			"name": "",
			"subtext": "",
			"image": ""
		}
	}
	render(){
		var elements = []
		if(this.state.image){
			var attrib = {
				key: 'image',
				src: this.state.image
			}
			elements.push( React.createElement('img', attrib) )
		}
		elements.push( React.createElement('div', { key:"identity", className:"identity"}, [
			React.createElement('h6', {"key":"name"}, this.state.name),
			React.createElement('small', {"key":"subtext"}, this.state.subtext)
		]) )

		return React.createElement('div', {className: "UserDisplayInline"}, elements)
	}
}

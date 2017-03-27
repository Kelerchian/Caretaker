var Person = {
	type: "object",
	has: [
		name: {
			type: "text",
			pattern: "[A-Za-z]",
			//optionals
			label: "name",
			description: "this is the name of the person"
		},
		email:{
			type: "email"
		},
		gender:{
			type: "radio",
			values: ""
		},
		contacts: {
			quantity: "many",
			type: "object",
			has: [
				phone_number: {
					type: "text",
					pattern: "[0-9]"
				}
			]
		}
	]
}

var PersonForm = {
	editedObject: Person,
	quantity: "many",
	max: "12",
	min: "1",
	action: "",
	successRedirect: "",
	failureRedirect: ""
}

// switch(this.props.type){
// 	case "time"			:
// 	case "date"			:
// 	case "week"			:
// 	case "select"		:
// 	case "checkbox"	:
// 	case "textarea"	:
// 	case "radio"		: return false; break;
// 	default					: return true; break;
// 	// case "text"			:
// 	// case "password"	:
// 	// case "submit"		:
// 	// case "reset"			:
// 	// case "button"		:
// 	// case "color"			:
// 	// case "email"			:
// 	// case "range"			:
// 	// case "search"		:
// 	// case "tel"				:
// 	// case "url"				:
// 	// case "number"		:
// }

# Caretaker Version 0.1.0-beta
A Javascript library for making a new breed of structured HTML5 Form

## What Caretaker?

Caretaker provides another way to make HTML5 Form request by creating data structure in JSON first, and receiving structured data in JSON format later.

For example, with this data structure below:

```Javascript
{
	type: "object",
	name: "person",
	label: "Person",
	has: [
		{
			type: "text",
			name: "fullname",
			label: "Fullname"
		},
		{
			type: "text",
			name: "address",
			label: "Address",
			quantity: "many"
		}
	]
}
```

Will create this Form:

![Readme-Example](https://github.com/Kelerchian/Caretaker/blob/github-master/example/asset/image/readme-example.png)

The Form will results the following:

```Javascript
{
  "fullname": "This is Fullname field",
  "address": [
    "This is \"many\" Address field",
    "Which items you can add or remove",
    "There you go"
  ]
}
```


## Getting Started

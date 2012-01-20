// require Person model class from models/Person.js file
var Person = require('./models/Person');
// View is a base class that handles rendering data from Models into HTML
var View = require('shipyard/view/View'),
    // Container renders to a <div> element
    Container = require('shipyard/view/Container'),
    // TextField view is <input type="text">
    TextFieldView = require('shipyard/view/TextFieldView');

// instantiate an object of class Person
var person = new Person({name: 'Sean'});

// create a new text field with data from person object
var whoAreYou = new TextFieldView({
    placeholder: 'What is your name',
    id: 'whoAreYou'
}).bind(person, { value: 'name' });
// render the text field onto the page inside the element with "example" id
// if you'd ommit the 'example', text field will be rendereed into
// <body>
whoAreYou.attach('example');

// create a new div
var hello = new Container();
// create a span containing the text 'Hello '
hello.addView(new View({data: 'Hello '}));
// create another span with person.name
hello.addView(new View().bind(person, { data: 'name' }));
// render the div
hello.attach('example');

var Task = require('./models/Task'),
	FormView = require('../../lib/view/FormView')
	ButtonView = require('../../lib/view/ButtonView');

var form = new FormView();
var btn = new ButtonView({ data: 'Add Task' });

form.addView(btn);
form.attach();



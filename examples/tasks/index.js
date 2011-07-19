var Task = require('./models/Task'),
	ListView = require('../../lib/view/ListView'),
	FormView = require('../../lib/view/FormView'),
	ButtonView = require('../../lib/view/ButtonView');
	TextFieldView = require('../../lib/view/TextFieldView');


var form = new FormView({
	onSubmit: function(data) {
		var task = new Task(data);
		task.save();
		list.addItem(task);
	}
})
	.addView(new TextFieldView({ name: 'title', placeholder: 'Task title...' }))
	.addView(new ButtonView({ data: 'Add Task' }))
	.attach();

var list = new ListView({
	empty: 'Add a task with the above form.'
}).attach();

exports.list = list;

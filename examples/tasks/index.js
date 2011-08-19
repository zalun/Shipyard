var Task = require('./models/Task'),
	ListView = require('../../lib/view/ListView'),
	FormView = require('../../lib/view/FormView'),
	ButtonView = require('../../lib/view/ButtonView'),
	TextFieldView = require('../../lib/view/TextFieldView');


var form = new FormView({
	onSubmit: function(data) {
		var task = new Task(data);
		task.save();
	}
})
	.addView(new TextFieldView({ name: 'title', placeholder: 'Task title...' }))
	.addView(new ButtonView({ data: 'Add Task' }))
	.attach();

var list = new ListView({
	empty: 'Add a task with the above form.'
}).attach();

Task.find({ callback: function(tasks) { 
	tasks.forEach(function(t) {
		list.addItem(t);
	});
}});

Task.addEvent('save', function(task, isNew) {
	if (isNew) list.addItem(task);
});
Task.addEvent('destroy', function(task) {
	list.removeItem(task);
});

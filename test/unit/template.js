var EJS = require('../../lib/template/ejs/Template');

module.exports = {
    'Template': function(it, setup) {
    },

    'EJS': function(it, setup) {
        it('should be able to echo data', function(expect) {
            var template = new EJS();
            var text = '<p><%= data %></p>';
            template.setTemplate(text);
            template.compile();

            expect(template.render({ data: 'hello'}))
                .toBe('<p>hello</p>');

        });

		it('should be able to render sub-templates', function(expect) {
			
			var template = new EJS;
			template.setTemplate('<p><%=template(sub, { data: data})%></p>');
			
			var sub = new EJS;
			sub.setTemplate('<em><%=data%></em>');

			var output = template.render({ sub: sub, data: 'bonk' });

			expect(output).toBe('<p><em>bonk</em></p>');
		});
    }
};

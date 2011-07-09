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
    }
};

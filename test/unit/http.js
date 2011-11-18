var Request = require('../../lib/shipyard/http/Request'),
	Spy = require('../testigo/lib/spy').Spy;


module.exports = {
	
	'Request': function(it, setup) {
		var MockXHR;
		
		setup('beforeEach', function() {
			MockXHR = function() {
				this.send = new Spy();
				this.abort = new Spy();
				this.open = new Spy();
				this.setRequestHeader = new Spy();
			};
			MockXHR.DONE = 4;
			Request.setXHR(MockXHR);
		});


		it('should fire success if successful', function(expect) {
			var spy = new Spy();
			var r = new Request({
				url: 'http://x.com',
				onSuccess: spy
			});

			r.send();
			r.xhr.status = 200;
			r.xhr.readyState = MockXHR.DONE;
			r.xhr.onreadystatechange();

			expect(spy.getCallCount()).toBe(1);
		});

		it('should fire failure if failed', function(expect) {
			var spy = new Spy();
			var r = new Request({
				url: 'http://x.com',
				onFailure: spy
			});

			r.send();
			r.xhr.status = 404;
			r.xhr.readyState = MockXHR.DONE;
			r.xhr.onreadystatechange();

			expect(spy.getCallCount()).toBe(1);
		});

		it('should send data as query string when GET', function(expect) {
			var r = new Request({
				url: 'http://x.com',
				method: 'get',
				data: {
					'foo': 'bar'
				}
			});

			r.send({ 'baz': 'derp' });

			expect(r.xhr.open.getLastArgs()[1]).toBe('http://x.com?foo=bar&baz=derp');

			var r2 = new Request({
				url: 'http://x.com/?a=1',
				method: 'get',
				data: {
					'foo': 'bar'
				}
			});
			r2.send();

			expect(r2.xhr.open.getLastArgs()[1]).toBe('http://x.com/?a=1&foo=bar');
		});

        it('should have default headers', function(expect) {
            var r = new Request({ url: '/' });
            expect(r.options.headers['X-Requested-With']).toBe('XMLHttpRequest');
            
            r.send();
            expect(r.xhr.setRequestHeader.getCallCount()).toBe(2);
        });
	}

};

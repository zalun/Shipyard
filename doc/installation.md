Installation
============

Install Node
-----------

Shipyard uses node.js for it's utilty scripts, such as running tests and
minifying your application for deployment. Head over to [nodejs.org][1], and
follow the installation instructions for your operating system.

Install Shipyard
--------------

Checkout [Shipyard from GitHub][2] into the directory of your choosing.

	$ git checkout git://github.com/seanmonstar/Shipyard.git

Next, `cd` into that directory, and use `npm link`. This will add the
`shipyard` command to your `PATH`, as well as download Shipyard's
dependencies.

	$ cd ./Shipyard
	$ npm link

Finally, you should add to your NODE_PATH enivornment variable the `lib`
directory inside Shipyard. This allows testing and building of apps to
work as easily as possible. You may need to create the NODE_PATH
variable, if you don't have one yet.

Verifying
---------

To verify that Shipyard has been installed, type `shipyard` into a
terminal. You should see the usage information for the `shipyard`
command.

Done
----

Excellent. Now you can proceed with the [tutorial][3].

[1]: http://nodejs.org/#download
[2]: https://github.com/seanmonstar/Shipyard
[3]: ./tutorial

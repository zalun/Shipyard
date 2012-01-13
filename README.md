Shipyard
===========

A Javascript [MVC][mvc] application framework. For when you have a full-on application sitting on a web page. So much is going on, you should be able to focus on making the application working, not worrying about XmlHttpRequests and the DOM.

What Shipyard is
--------------

An application framework that covers all the common things any JavaScript application would need to deal with: interacting with a server, storing data, rendering said data in the browser, and responding to user actions. An application built on Shipyard should only have to write that pulls all those things together.

If you're application is going to have 1000 lines of JavaScript, would you rather write all those yourself, or have 900 of them be in a framework that is tested and used by others?

When starting a web application, you would reach for Django, or CakePHP, or Rails; never would you decide to use just he language itself. Why shouldn't you do the same when the target language is JavaScript?

Goals
-----

### Framework-wide Goals

1. Be able to declare dependencies inside the code, and not be bothered with managing them during development or deployment.
2. Be easily testable, using a node test runner.
3. Not reliant on any other language. Build scripts will use JavaScript. The End.

### Model Goals

1. Provide fields that can convert properties from useful JavaScript objects to serialized values when persisting, and vice versa.
2. Fire `change` events, so that Views bound to a model can automatically update what they are displaying.
3. Allow persistance mixins to easily attach to sync methods, allowing one to easily store data in multiple places by simpling mixing in a new persistance service.
4. Ability to add in Validation rules easily.

### View Goals

1. Be abstract view classes, allowing the developer to not worry about the underlying DOM and how much it sucks.
2. Be able to fire meaningful events, and not worry about DOM events and which one's are important, or whether you should use event delegation, etc.
3. Be extendable, such that there is very little DRY: TreeView extends ListView.
4. Be able to bind to a model, and update (re-render) parts of itself when the underlying data changes, with no work from the developer.
5. Use a templating language underneath, so that experienced developers can write their own custom View classes with the utmost control.

### Controller Goals

1. A controller should be concerned with a general area of the webapp, adding Views.
2. Can listen to Views events, and decide what models should change and when.

Getting Started
---------------

1. Checkout the repo.
2. `npm link`
3. `shipyard test`
4. Woo!

Afterwards, to use it with one of your apps, especially when running
tests, you'll want to add the path to Shipyard/lib to your `NODE_PATH`,
since node 0.6 removed the ability for me to push onto the path with
code.

How to use
----------

### Models

Your application revolves around data, not the DOM. Models allow you to easily define rules, and setup methods to persist your data via various persistence schemas, such as to a server, or using localStorage.
		
    var Class = require('shipyard/Class'),
        model = require('shipyard/model'),
        Syncable = require('shipyard/sync/Syncable'),
        XHR = require('shipyard/sync/Server'),
        localStorage = require('shipyard/sync/Browser');
    
    var Recipe = module.exports = new Class({		
            
            Extends: model.Model,

            Implements: Syncable,

            Sync: {
                'default': {
                    driver: XHR,
                    route: '/api/recipes'
                },
                'local': {
                    driver: localStorage,
                    table: 'recipes'
                }
            },
            
            fields: {
                    id: model.Fields.NumberField(),
                    title: model.Fields.TextField({ length: 64, required: true}),
                    ingredients: model.Fields.TextField()
            },

            toString: function() {
                return this.get('title');    
            }
            
    });

And then use it like so:

    var Recipe = require('./models/Recipe');
    var rec = new Recipe({ title: 'Curry', ingredients: 'coconut' });
    rec.save(); // saves using 'default' Sync.
    rec.save({using: 'local'}); // or save to another Sync.


### Views

The browser just happens to be where you application resides, but manipulating the DOM is something you shouldn't have to think about. Shipyard provides an extensible view system that abstracts away the DOM elements and events, and lets you think in terms of UI elements instead.

    var View = require('shipyard/view/View');

    var recipe = new Recipe({ title: 'Cookies' });
    var titleView = new View({
        data: recipe
    });
    titleView.attach();

Or, you can create your own views, extending them when you need
something custom:

    var Class = require('shipyard/Class'),
        ListView = require('shipyard/view/ListView');

    var RecipesView = module.exports = new Class({

            Extends: ListView

            //override getRenderOptions or something

    });

However, this should only be necessary for changing the inherent
behavior of a View. Simply adding events to views does not require
creating a new class.

### Controllers

Controllers build the views, pass them data from the models, and then interpret events in order to modify the models back again.

    var Class = require('shipyard/Class'),
        ListController = require('shipyard/controller/ListController'),
        RecipeView = require('../view/RecipeView'),
        Recipe = require('../model/Recipe');
        
    var RecipesController = modules.export = new Class({
            
            Extends: ListController,
            
            list: RecipeView,
            
            model: Recipe
            
    });


Relies On
--------

[CommonJS modules][cjs]. `require` will load the modules automatically during development, to make development more sane.

When a push is needed, [DryIce][di] can be use to compile the whole project into a single compressed file.

Credit
------

Major credit goes to [MooTools][moo], for much of the core of Shipyard is __heavily__ inspired by it.
While it has mostly been modified slightly to fit better into a Module setting, 
huge thanks to MooTools.

[mvc]: http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
[di]: https://github.com/mozilla/dryice
[cjs]: http://wiki.commonjs.org/wiki/Modules/1.1
[moo]: http://mootools.net

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

window.quicksync = window.quicksync || {};
var mediator = quicksync.mediator = _.extend( {}, Backbone.Events );

// Wait for DOM so views will work
$( function(){
	quicksync.views = {};
});
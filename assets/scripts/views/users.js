var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var _ = require('underscore');

var users_template = require('../../templates/users.hbs');
var user_template = require('../../templates/user.hbs');

module.exports = Backbone.View.extend({
	initialize: function(){
		_( this ).bindAll( 'destroy', 'render', 'renderUsers', 'addUser', 'removeUser' );
		this.render();
		this.listenTo( this.collection, 'reset', this.render );
		this.listenTo( this.collection, 'add', this.addUser );
		this.listenTo( this.collection, 'remove', this.removeUser );
	},
	// completely un-initializes the view
	destroy: function(){
		this.remove();
	},
	render: function(){
		this.$el.html( users_template() );
		this.$users = this.$el.find('ul.users');
		this.renderUsers();
	},
	// render all users
	renderUsers: function(){
		var users_view = this;
		var users_str = this.collection.reduce( function( memo, user ){
			return memo + user_template( user.toJSON() );
		}, '' );
		this.$users.html( users_str );
	},
	// render and add a message to the users ul
	addUser: function( user ){
		this.$users.append( user_template( user.toJSON() ) );
	},
	// remove an item from the users ul
	removeUser: function( user ){
		this.$users.find('li[data-id="'+ user.id +'"]').remove();
	}
});
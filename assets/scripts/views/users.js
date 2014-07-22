var Backbone = require('backbone');
var $ = Backbone.$ = require('jquery');
var _ = require('underscore');
var Handlebars = require('hbsfy/runtime');

var users_template = require('../../templates/users.hbs');
var user_template = require('../../templates/user.hbs');
var _user_template = require('../../templates/_user.hbs');

Handlebars.registerPartial( 'user', _user_template );

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
			var user_data = user.toJSON();
			user_data.self = ( user_data.id === users_view.collection.user.id );
			return memo + user_template( user_data );
		}, '' );
		this.$users.html( users_str );
	},
	// render and add a message to the users ul
	addUser: function( user ){
		var user_data = user.toJSON();
		user_data.self = ( user_data.id === this.collection.user.id );
		this.$users.append( user_template( user_data ) );
	},
	// remove an item from the users ul
	removeUser: function( user ){
		this.$users.find('li[data-id="'+ user.id +'"]').remove();
	}
});

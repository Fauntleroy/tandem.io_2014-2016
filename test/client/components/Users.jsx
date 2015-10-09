var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var test = require('tape');

var Users = require('../../../assets/scripts/components/Users.jsx');
var User = require('../../../assets/scripts/components/User.jsx');

var USERS = [{
	id: '1',
	name: 'Test',
	avatar: 'https://www.tandem.io/avatars/1.png'
},
{
	id: '2',
	name: 'Test 2',
	avatar: 'https://www.tandem.io/avatars/2.png'
},
{
	id: '3',
	name: 'Test 3',
	avatar: 'https://www.tandem.io/avatars/3.png'
}];

test('Renders a list of users', function( t ){
	t.plan(1);
	var two_users = USERS.slice( 0, 1 );
	var users_component = TestUtils.renderIntoDocument( <Users users={two_users} /> );
	var users_components = TestUtils.scryRenderedComponentsWithType( users_component, User );
	t.equal( users_components.length, 2 );
});

test('Adds a user to the list of users', function(){

});

test('Removes a user from the list of users', function(){

});
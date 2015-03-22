var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');
var cx = require('classnames');

var User = require('./User.jsx');
var MenuTrigger = React.createClass({
	render: function(){
		return (
			<a className="menu__trigger" href="#menu-trigger" onClick={this.props.onClick}>
				{this.props.children}
			</a>
		);
	}
});
var MenuContent = React.createClass({
	render: function(){
		return (
			<div className="menu__content">
				{this.props.children}
			</div>
		);
	}
});
var Menu = React.createClass({
	getInitialState: function(){
		return {
			active: false
		};
	},
	componentDidMount: function () {
		window.addEventListener( 'click', this._onWindowClick );
	},
	componentWillUnmount: function () {
		window.removeEventListener( 'click', this._onWindowClick );
	},
	render: function(){
		var children = React.Children.map( this.props.children, function( child ){
			if( child.type === MenuTrigger.type ){
				child = cloneWithProps( child, {
					ref: 'trigger',
					onClick: this._onToggleClick
				});
			}
			return child;
		}, this);
		var menu_classes = cx({
			menu: true,
			'menu--active': this.state.active
		});
		return (
			<div className={menu_classes}>
				{children}
			</div>
		);
	},
	_onWindowClick: function( event ){
		var menu_element = this.getDOMNode();
		if( event.target !== menu_element && !menu_element.contains( event.target ) ){
			this.setState({
				active: false
			});
		}
	},
	_onToggleClick: function( event ){
		event.preventDefault();
		this.setState({
			active: !this.state.active
		});
	}
});

var UserMenu = React.createClass({
	render: function(){
		var user = tandem.bridge.user;
		var register_youtube_jsx = ( user.is_youtube_linked )
			? <span className="user-menu__item__info">Logged in with Youtube <i className="fa fa-check" /></span>
			: <a className="user-menu__item__link" href="/auth/youtube">Log in with Youtube <i className="fa fa-youtube" /></a>;
		var register_soundcloud_jsx = ( user.is_soundcloud_linked )
			? <span className="user-menu__item__info">Logged in with Soundcloud <i className="fa fa-check" /></span>
			: <a className="user-menu__item__link" href="/auth/soundcloud">Log in with Soundcloud <i className="fa fa-soundcloud" /></a>;
		var logout_jsx = ( user.is_registered )
			? <li className="user-menu__item"><a className="user-menu__item__link" href="/logout">Log Out</a></li>
			: '';
		return (
			<div className="user-menu">
				<Menu>
					<MenuTrigger>
						<User user={user} />
						<i className="fa fa-caret-down" />
					</MenuTrigger>
					<MenuContent>
						<ul className="user-menu__items">
							<li className="user-menu__item">
								{register_youtube_jsx}
							</li>
							<li className="user-menu__item">
								{register_soundcloud_jsx}
							</li>
							{logout_jsx}
						</ul>
					</MenuContent>
				</Menu>
			</div>
		);
	}
});

module.exports = UserMenu;
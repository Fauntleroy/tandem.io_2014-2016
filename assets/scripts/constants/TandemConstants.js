var keyMirror = require('keymirror');

var constants = {
	ActionTypes: keyMirror({
		ADD_USER: null,
		REMOVE_USER: null,
		ADD_MESSAGE: null,
		RECEIVE_MESSAGE: null,
		ADD_PLAYLIST_ITEM: null,
		REMOVE_PLAYLIST_ITEM: null,
		PLAY_PLAYLIST_ITEM: null,
		SKIP_PLAYLIST_ITEM: null,
		LIKE_PLAYLIST_ITEM: null,
		RECEIVE_PLAYLIST_ITEM: null,
		CHANGE_PLAYER_ORDER: null,
		CHANGE_PLAYER_VOLUME: null,
		TOGGLE_PLAYER_MUTE: null,
		SEARCH_ACTIVE: null,
		START_SEARCH: null,
		SWITCH_SEARCH_SOURCE: null,
		RECEIVE_RESULTS: null
	}),
	PayloadSources: keyMirror({
		VIEW_ACTION: null,
		SERVER_ACTION: null
	})
};

module.exports = constants;
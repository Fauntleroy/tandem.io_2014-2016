var keyMirror = require('keymirror');

var constants = {
	ActionTypes: keyMirror({
		// Search Actions
		SEARCH_ACTIVE: null,
		SEARCH_START: null,
		SEARCH_SWITCH_SOURCE: null,
		SEARCH_RECEIVE_RESULTS: null,
		// Users Actions
		USERS_RECEIVE_STATE: null,
		USERS_RECEIVE_JOIN: null,
		USERS_RECEIVE_LEAVE: null,
		// Chat Actions
		CHAT_ADD_MESSAGE: null,
		CHAT_ADD_EMOTE: null,
		CHAT_RECEIVE_ADD_MESSAGE: null,
		CHAT_RECEIVE_ADD_EMOTE: null,
		// Player Actions
		PLAYER_SET_ELAPSED_TIME: null,
		PLAYER_SKIP_ITEM: null,
		PLAYER_LIKE_ITEM: null,
		PLAYER_SET_ORDER: null,
		PLAYER_SET_VOLUME: null,
		PLAYER_SET_MUTE: null,
		PLAYER_RECEIVE_STATE: null,
		PLAYER_RECEIVE_ELAPSED_TIME: null,
		PLAYER_RECEIVE_SKIP_ITEM: null,
		PLAYER_RECEIVE_ITEM: null,
		PLAYER_RECEIVE_LIKE_ITEM: null,
		PLAYER_RECEIVE_ORDER: null,
		// Playlist Actions
		PLAYLIST_ADD_ITEM: null,
		PLAYLIST_ADD_ITEM_FROM_URL: null,
		PLAYLIST_REMOVE_ITEM: null,
		PLAYLIST_SORT_START: null,
		PLAYLIST_SORT_END: null,
		PLAYLIST_RECEIVE_ADD_ITEM_FROM_URL: null,
		PLAYLIST_RECEIVE_STATE: null,
		PLAYLIST_RECEIVE_ADD_ITEM: null,
		PLAYLIST_RECEIVE_REMOVE_ITEM: null,
		PLAYLIST_RECEIVE_SORT_START: null,
		PLAYLIST_RECEIVE_SORT_END: null
	}),
	PayloadSources: keyMirror({
		VIEW_ACTION: null,
		SERVER_ACTION: null
	})
};

module.exports = constants;
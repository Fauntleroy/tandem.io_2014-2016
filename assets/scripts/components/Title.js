import TitleStore from '../stores/TitleStore.js';

var CHANGE_EVENT = 'change';

var Title = function(){
	TitleStore.on( CHANGE_EVENT, this.updateTitle );
};

Title.prototype.updateTitle = function(){
	document.title = TitleStore.getTitle();
};

export default Title;

tandem.io
=========

Minimal, open-source version of TK Sync


## Installing Tandem.io

You will need:

- [Node.js](http://nodejs.org/)
- [NPM](https://www.npmjs.org/) (bundled with Node.js)
- [Redis](http://www.redis.io/) (session backing)
- [MySQL](http://www.mysql.org/)
- A database in MySQL (mine is named `tandem`)
- Ideally, a user in MySQL with the correct privileges
- [Gulp](http://gulpjs.com/)
- This entry in your `hosts` file: `127.0.0.1 dev.tandem.io`
- A properly configured [SoundCloud app](http://soundcloud.com/you/apps/new)
- A properly configured [YouTube app](https://developers.google.com/youtube/android/player/register)
- The following `ENV` variables set:

        export TANDEM_SESSION_SECRET="YOUR-SESSION-SECRET-HERE"
        export TANDEM_SOUNDCLOUD_APP_ID="YOUR-SOUNDCLOUD-APP-ID-HERE"
        export TANDEM_SOUNDCLOUD_APP_SECRET="YOUR-SOUNDCLOUD-APP-SECRET-HERE"
        export TANDEM_YOUTUBE_APP_ID="YOUR-YOUTUBE-APP-ID-HERE"
        export TANDEM_YOUTUBE_APP_SECRET="YOUR-YOUTUBE-APP-SECRET-HERE"
        export TANDEM_YOUTUBE_API_KEY="YOUR-YOUTUBE-API-KEY-HERE"
        export TANDEM_TOKEN_SECRET="YOUR-TOKEN-SECRET-HERE"
        export TANDEM_MYSQL_URL="YOUR-MYSQL-URL-HERE" (mysql2://user:password@host:port/database)
        export TANDEM_REDIS_URL="YOUR-REDIS-URL-HERE" (redis://user:password@host:port)

Then you'll need to run `npm install` to install all of the node.js dependencies. After that's complete, you'll have two main scripts to run:

- `gulp` - This will run the default Gulp task, which will compile all of the client side assets and watch for changes. This will automatically reload CSS changes on the fly, and recompile javascript as you change it (you will have to reload the page for that, though).
- `node index.js` - This will run the server. While this is running you should be able to access the application at http://dev.tandem.io:8080
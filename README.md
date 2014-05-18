tandem.io
=========

Minimal, open-source version of TK Sync


## Installing Tandem.io

You will need:

- [Node.js](http://nodejs.org/)
- [NPM](https://www.npmjs.org/) (bundled with Node.js)
- [MongoDB](http://www.mongodb.org/)
- A databased named `tandem` in MongoDB
- [Gulp](http://gulpjs.com/)
- This entry in `HOSTS`: `127.0.0.1 dev.tandem.io`
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

You'll then need to run `npm install` to install the application's dependencies, and finally run `gulp` inside the repo's directory to run the application's startup scripts. Once this is running, you should be able to use the application at http://dev.tandem.io:8080
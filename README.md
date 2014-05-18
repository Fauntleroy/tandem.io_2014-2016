tandem.io
=========

Minimal, open-source version of TK Sync


## Installing Tandem.io

You will need:

- Node.js
- NPM (bundled with Node.js)
- MongoDB
- A databased named `tandem` in MongoDB
- Gulp
- This entry in `HOSTS`: `127.0.0.1 dev.tandem.io`
- The following `ENV` variables set:

        export TANDEM_SESSION_SECRET="YOUR-SESSION-SECRET-HERE"
        export TANDEM_SOUNDCLOUD_APP_ID="YOUR-SOUNDCLOUD-APP-ID-HERE"
        export TANDEM_SOUNDCLOUD_APP_SECRET="YOUR-SOUNDCLOUD-APP-SECRET-HERE"
        export TANDEM_YOUTUBE_APP_ID="YOUR-YOUTUBE-APP-ID-HERE"
        export TANDEM_YOUTUBE_APP_SECRET="YOUR-YOUTUBE-APP-SECRET-HERE"
        export TANDEM_YOUTUBE_API_KEY="YOUR-YOUTUBE-API-KEY-HERE"
        export TANDEM_TOKEN_SECRET="YOUR-TOKEN-SECRET-HERE"

You can then run the applicaiton
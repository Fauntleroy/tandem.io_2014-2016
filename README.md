tandem.io
=========

Minimal, open-source version of TK Sync


## Installing Tandem.io

You will need to:

- Install the following:
    - [Node.js](http://nodejs.org/)
    - [NPM](https://www.npmjs.org/) (bundled with Node.js)
    - [Redis](http://www.redis.io/) (session backing)
    - [MySQL](http://www.mysql.org/)
- Create a database in MySQL (e.g. `tandem`)
- Add this to your [`hosts` file](http://www.rackspace.com/knowledge_center/article/modify-your-hosts-file): `127.0.0.1 dev.tandem.io`
- Configure a [YouTube App](#user-content-youtube-app-registration)
- Configure a [SoundCloud App](#user-content-soundcloud-app-registration)
- Set the following `ENV` variables:
    ```bash
    # Secrets
    export TANDEM_TOKEN_SECRET="YOUR-TOKEN-SECRET-HERE"
    export TANDEM_SESSION_SECRET="YOUR-SESSION-SECRET-HERE"

    # DB URLs
    export TANDEM_MYSQL_URL="YOUR-MYSQL-URL-HERE" (mysql2://user:password@host:port/database)
    export TANDEM_REDIS_URL="YOUR-REDIS-URL-HERE" (redis://user:password@host:port)

    # SoundCloud
    export TANDEM_SOUNDCLOUD_APP_ID="YOUR-SOUNDCLOUD-APP-ID-HERE"
    export TANDEM_SOUNDCLOUD_APP_SECRET="YOUR-SOUNDCLOUD-APP-SECRET-HERE"

    # YouTube
    export TANDEM_YOUTUBE_APP_ID="YOUR-YOUTUBE-APP-ID-HERE"
    export TANDEM_YOUTUBE_APP_SECRET="YOUR-YOUTUBE-APP-SECRET-HERE"
    export TANDEM_YOUTUBE_API_KEY="YOUR-YOUTUBE-API-KEY-HERE"
    ```
- Run `npm install` to install all of the node.js dependencies.

Once you've done all of the above, you can start your development server by running: `npm run watch`. This will build Tandem, watch files for changes, run the server. While this is running you should be able to access the application at http://dev.tandem.io:8080.


### YouTube App Registration

NOTE: If these instructions are out of date, try stumbling through [YouTube's app instructions](https://developers.google.com/youtube/android/player/register).

Before you can create an app, you'll need a Google Account. [Sign up now](https://accounts.google.com/signUp) if you don't already have one.

1. Go to the [Google Developers Console](https://console.developers.google.com/home/dashboard)
2. You will see a blue **Create project** button in the top left corner of the page body.
3. Name your project something like `tandem-io-dev` and click **Create**. Once the project is ready you'll be redirected to the Project Dashboard.
4. Now you'll need to [enable the YouTube Data API](https://console.developers.google.com/apis/api/youtube/overview) on this project. Click the blue **Enable API** button at the top of this page.
5. Next, you'll need to [create a server key](https://console.developers.google.com/apis/credentials/key?type=SERVER_SIDE) for your app. Call your key something like `Tandem.io Dev Key`, skip the IP address field, and click **Create**.
6. The dev console will show your key in a modal dialog. Copy and paste it into the appropriate environment variable.
7. Finally, you'll need to [set up an OAuth Client ID](https://console.developers.google.com/apis/credentials/oauthclient) for the project. When you visit this page you'll see a warning stating that you must set your product's name. Click the blue **Configure consent screen** button.
8. Name your project something like `Tandem.io Dev` and click save. This will take you back to the OAuth Client screen.
9. Select the "Web application" radio.
    * Name your client name (e.g. `Tandem.io Dev`)
    * Set Authorize JavaScript Origins to `http://dev.tandem.io:8080`
    * Set Authorized redirect URIs `http://dev.tandem.io:8080/auth/google/callback`
10. Click the blue **Save** button.
11. The dev console will show you your client ID and secret in a modal dialog. Copy those to the appropriate environment variables.

That's it! Next time you launch Tandem you will be able to make YouTube API requests.


### SoundCloud App Registration

NOTE: If these instructions are out of date, you can try stumbling through the
[SoundCloud app instructions](http://soundcloud.com/you/apps/new).

Before you can create an app, you'll need a SoundCloud account. [Sign up now](https://soundcloud.com/signup) if you don't already have one.

1. Go to the [SoundCloud app registration](http://soundcloud.com/you/apps/new) page.
2. Name your app something like `Tandem.io Dev`, agree to the Dev Policies, and click **Register**.
3. Next, set the app's website as `http://dev.tandem.io:8080` and the Redirect URI to `http://dev.tandem.io:8080/auth/soundcloud/callback`.
4. Copy the Client ID and Client Secret into the appropriate environment variables.
5. Click **Save app**.

That's it! Next time you launch Tandem you will be able to make SoundCloud API requests.

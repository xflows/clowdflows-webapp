# ClowdFlows-WebApp #

This is an Angular2 application to consume the ClowdFlows web API. 
It will replace the current Django/jQuery-based interface that comes with the main [ClowdFlows project](https://github.com/xflows/clowdflows/). 
That project will eventually provide only the REST API endpoint.

Potentially, you can provide your own API backend and use this app to provide the interface.

## Installation ##

Make sure you have the latest node and npm installed, then run from the root folder:

```
npm install
```

Edit `config/api.dev.js` to reflect your development API server location (default: `http://localhost:8000/api/`).

## Running ##

Start the development server:

```
npm start
```

Run less in watch mode:

```
npm run-script less
```

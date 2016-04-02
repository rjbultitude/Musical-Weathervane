<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Musical Weathervane</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <link rel="stylesheet" href="src/styles/main.css">
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <main aria-role="main" class="wrapper">
        <article>
            <h1>Musical Weathevane</h1>
            <p>The musical wearthervane makes music from weather across the globe. Three locations have been randomly picked to produce a chord using the local wind speed and bearing.</p>
            <div class="cta inactive" id="cta-user-location">
                <p>Play the sound of your location too:</p>
                <button id="use-location-btn">Use my location</button>
            </div>
        </article>
            <p id="message-block" class="status-bar">Loading</p>
            <div id="canvas-container">
            </div>
            <form id="form-coords" style="display: none">
                <h2>Enter your coordinates</h2>
                <label for="lat">Lattiude</label>
                <input type="text" id="lat">
                <label for="long">Longitude</label>
                <input type="text" id="long">
                <button id="form-coords-btn">Submit</button>
            </form>
        </main>
        <footer>
            <h2>Credits</h2>
            <p>This project uses <a href="http://forecast.io/">Forecast.io</a> to obtain the weather data.</p>
            <p>The JavaScript library used to access the API can be found on <a href="https://github.com/iantearle/forecast.io-javascript-api">GitHub here</a>.</p>
            <p><a href="http://p5js.org/">P5.js</a> is used to generate the graphical interface and audio.</p>
            <p><a href="https://www.google.com/intx/en_uk/work/mapsearth/products/mapsapi.html">Google maps</a> is used to reverse Geocode the location information</p>
            <p>Musical Weathervane is written and maintained by <a href="https://github.com/rjbultitude">R.Bultitude</a></p>
        </footer>
        <script src="dist/scripts/app.js"></script>
    </body>
</html>

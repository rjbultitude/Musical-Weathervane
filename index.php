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
            <div class="cta">
                <p>Play the sound of your location too:</p>
                <button id="use-location-btn">Use my location</button>
            </div>
        </article>
            <div id="message-block"></div>
            <div id="canvas-container">
            </div>
            <div style="display: none">
                <form id="form-coords">
                    <label for="lat">Lattiude</label>
                    <input type="text" id="lat">
                    <label for="long">Longitude</label>
                    <input type="text" id="long">
                    <button id="form-coords-btn">Submit</button>
                </form>
            </div>
            <div id="map"></div>
        </main>
        <script src="dist/scripts/app.js"></script>
    </body>
</html>

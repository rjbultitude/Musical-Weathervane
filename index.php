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

        <p>Inspired by the Croatian sea organ this app consumes real-time weather data and generates music using wind direction and speed</p>
        <div id="canvas-container">
        </div>
        <form data-behavior="form-coords">
            <label for="lat">Lattiude</label>
            <input type="text" id="lat">
            <label for="long">Longitude</label>
            <input type="text" id="long">
            <button id="submit">Submit</button>
        </form>
        <p>
            <span id="speedBrixton"></span>
            <span id="bearingBrixton"></span>
        </p>
        <p>
            <span id="speedBirkenhead"></span>
            <span id="bearingBirkenhead"></span>
        </p>
        <p>
            <span id="speedBradford"></span>
            <span id="bearingBradford"></span>
        </p>
        <script src="dist/scripts/app.js"></script>
    </body>
</html>

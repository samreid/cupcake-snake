define( function( require ) {
  'use strict';

  // modules
  var CupcakeSnakeScreen = require( 'CUPCAKE_SNAKE/CupcakeSnakeScreen' );
  var platform = require( 'PHET_CORE/platform' );
  //var BackgroundMusic = require( 'CUPCAKE_SNAKE/sBackgroundMusic' );
  var App = require( 'CUPCAKE_SNAKE/App' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var titleString = require( 'string!CUPCAKE_SNAKE/cupcake-snake.title' );

  // strings
  var simOptions = {
    credits: {}
  };

  var level = 0;
  if ( phet.chipper.getQueryParameter( 'level' ) ) {
    level = parseInt( phet.chipper.getQueryParameter( 'level' ), 10 );
  }
  var app = null;

  SimLauncher.launch( function() {

    // After the user pressed restart level or go to homescreen, this function is called
    // level = 0 is homescreen
    var restart = function( level ) {
      app.destroy();
      app = new App( titleString, [ new CupcakeSnakeScreen( level, restart ) ], simOptions );
      app.start();
    };

    app = new App( titleString, [ new CupcakeSnakeScreen( level, restart ) ], simOptions );
    app.start();

    if ( !platform.ie ) {
      //BackgroundMusic.start();
    }

    // <audio autoplay="autoplay" preload="preload" loop="loop">
    //   <source src="audio/jewel-crusher.mp3" type="audio/mpeg" />
    //   <source src="audio/jewel-crusher.ogg" type="audio/ogg" />
    // </audio>
  } );
} );
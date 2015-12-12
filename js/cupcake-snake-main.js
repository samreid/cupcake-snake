// Copyright 2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Display = require( 'SCENERY/display/Display' );
  var Text = require( 'SCENERY/nodes/Text' );

  var rootNode = new Node();
  var display = new Display( rootNode, {
    allowSceneOverflow: true,
    isApplication: true,
    accessibility: false
  } );

  var simDiv = display.domElement;
  simDiv.id = 'sim';
  document.body.appendChild( simDiv );

  SimLauncher.launch( function() {
    console.log( 'hello' );
    var callback = function() {
      console.log( 'again' );
      rootNode.addChild( new Text( 'hello', { fill: 'white', centerX: 200, centerY: 200 } ) );
    };
    display.updateOnRequestAnimationFrame( callback );
  } );
} );
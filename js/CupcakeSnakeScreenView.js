// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Text = require( 'SCENERY/nodes/Text' );

  function CupcakeSnakeScreenView( cupcakeSnakeModel ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 834, 504 ) } );

    this.addChild( new Text( 'hello', { x: 100, y: 100 } ) );
  }

  return inherit( ScreenView, CupcakeSnakeScreenView, {} );
} );
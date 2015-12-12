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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function CupcakeSnakeScreenView( cupcakeSnakeModel ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    this.addChild( new Text( 'Level 1', { top: 10, left: 10, font: new PhetFont( { size: 30, weight: 'bold' } ) } ) );
  }

  return inherit( ScreenView, CupcakeSnakeScreenView, {} );
} );
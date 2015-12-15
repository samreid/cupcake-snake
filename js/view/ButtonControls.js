// Copyright 2015

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RectangularMomentaryButton = require( 'SUN/buttons/RectangularMomentaryButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  function ButtonControls( cupcakeSnakeScreenView, leftButtonProperty, rightButtonProperty ) {
    Node.call( this );

    var s = 1.5;
    var buttonScaleVector = new Vector2( 1.4 * s, 2 * s );
    var leftButton = new RectangularMomentaryButton( false, true, leftButtonProperty, {
      content: new ArrowNode( 0, 0, -20, -0, {
        scale: buttonScaleVector
      } ),
      scale: 1.7
    } );
    var dilationTouchAreaDelta = 210;
    leftButton.touchArea = leftButton.localBounds.dilatedXY( dilationTouchAreaDelta, dilationTouchAreaDelta );

    var rightButton = new RectangularMomentaryButton( false, true, rightButtonProperty, {
      content: new ArrowNode( 0, 0, 20, -0, {
        scale: buttonScaleVector
      } ),
      scale: 1.7
    } );
    rightButton.touchArea = rightButton.localBounds.dilatedXY( dilationTouchAreaDelta, dilationTouchAreaDelta );

    this.addChild( leftButton );
    this.addChild( rightButton );
    cupcakeSnakeScreenView.events.on( 'layoutFinished', function( dx, dy, width, height ) {
        leftButton.left = -dx + 20;
        leftButton.bottom = -dy - 20 + height;

        rightButton.right = -dx - 20 + width;
        rightButton.bottom = -dy - 20 + height;
      }
    );
  }

  return inherit( Node, ButtonControls, {} );
} );
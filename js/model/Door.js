// Copyright 2015

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var Line = require( 'KITE/segments/Line' );

  var DOOR_THICKNESS = 15;

  function Door( left, right ) {
    this.left = left; // Vector2
    this.right = right; // Vector2
    this.segment = new Line( left, right );
    this.doorVector = left.minus( right ).perpendicular().normalized().timesScalar( DOOR_THICKNESS );
    var left1 = left.plus( this.doorVector );
    var right1 = right.plus( this.doorVector );
    var left2 = left1.plus( this.doorVector );
    var right2 = right1.plus( this.doorVector );

    this.yellowSegments = [
      new Line( left, left1 ),
      new Line( left1, right1 ),
      new Line( right1, right ),
      new Line( right, left )
    ];

    this.blueSegments = [
      new Line( left1, left2 ),
      new Line( left2, right2 ),
      new Line( right2, right1 ),
      new Line( right1, left1 )
    ];
  }

  cupcakeSnake.register( 'Door', Door );

  return inherit( Object, Door, {
    copy: function() {
      return new Door( this.left, this.right );
    }
  } );
} );
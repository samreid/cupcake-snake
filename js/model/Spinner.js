// Copyright 2015

/**
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var cupcakeSnake = require( 'CUPCAKE_SNAKE/cupcakeSnake' );
  var Line = require( 'KITE/segments/Line' );
  var Vector2 = require( 'DOT/Vector2' );

  function Spinner( center, radius, width, speed ) {
    this.center = center;
    this.radius = radius;
    this.width = width;
    this.speed = speed;

    this.topLeft = new Vector2( -width / 2, radius ).plus( center );
    this.topRight = new Vector2( width / 2, radius ).plus( center );
    this.bottomLeft = new Vector2( -width / 2, -radius ).plus( center );
    this.bottomRight = new Vector2( width / 2, -radius ).plus( center );

    this.segments = [
      new Line( this.topLeft, this.topRight ),
      new Line( this.topRight, this.bottomRight ),
      new Line( this.bottomRight, this.bottomLeft ),
      new Line( this.bottomLeft, this.topLeft )
    ];

    this.step( Math.random() * Math.PI * 2 ); // randomly initialize angle
  }

  cupcakeSnake.register( 'Spinner', Spinner );

  return inherit( Object, Spinner, {
    message: 'Was the room spinning, or just that barrier?',

    copy: function() {
      return new Spinner( this.center, this.radius, this.width, this.speed );
    },

    step: function( dt ) {
      var angleDelta = dt * this.speed;

      this.topLeft.subtract( this.center ).rotate( angleDelta ).add( this.center );
      this.topRight.subtract( this.center ).rotate( angleDelta ).add( this.center );
      this.bottomLeft.subtract( this.center ).rotate( angleDelta ).add( this.center );
      this.bottomRight.subtract( this.center ).rotate( angleDelta ).add( this.center );

      for ( var i = 0; i < this.segments.length; i++ ) {
        this.segments[ i ].invalidate();
      }
    },

    // screw MVT!
    draw: function( context ) {
      // TODO: better graphics?

      // TODO: arc for the graphics?
      context.beginPath();
      context.moveTo( this.topLeft.x, this.topLeft.y );
      context.lineTo( this.topRight.x, this.topRight.y );
      context.lineTo( this.bottomRight.x, this.bottomRight.y );
      context.lineTo( this.bottomLeft.x, this.bottomLeft.y );
      context.closePath();
      context.fillStyle = '#3fa';
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.lineJoin = 'miter';
      context.fill();
      context.stroke();
    }
  } );
} );
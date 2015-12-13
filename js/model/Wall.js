// Copyright 2015, University of Colorado Boulder

/**
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  function Wall( segments ) {
    assert && assert( segments.length > 0, 'should have segments' );

    // @public
    this.segments = segments; // kite segments
  }

  return inherit( Object, Wall, {

  } );
} );
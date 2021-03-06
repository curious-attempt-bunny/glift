glift.displays.board.svgutil = {
  /**
   * Move the current position to X,Y.  Usually used in the context of creating a
   * path.
   */
  svgMove: function(x, y) {
    return "M" + x + " " + y;
  },

  svgMovePt: function(pt) {
    return glift.displays.board.svgutil.svgMove(pt.x(), pt.y());
  },

  // Create a relative SVG line, starting from the 'current' position.
  svgLineRel: function(x, y) {
    return "l" + x + " " + y;
  },

  svgLineRelPt: function(pt) {
    return glift.displays.board.svgutil.svgLineRel(pt.x(), pt.y());
  },

  /**
   * Create an absolute SVG line -- different from lower case
   * This form is usually preferred.
   */
  svgLineAbs: function(x, y) {
    return "L" + x + " " + y;
  },

  // Create an absolute SVG line -- different from lower case.
  svgLineAbsPt: function(pt) {
    return glift.displays.board.svgutil.svgLineAbs(pt.x(), pt.y());
  }
};

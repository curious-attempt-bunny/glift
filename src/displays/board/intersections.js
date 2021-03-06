glift.displays.board._Intersections = function(
    divId, svg, intersectionData, boardPoints, theme) {
  this.divId = divId;
  this.svg = svg;
  this.theme = theme;
  this.boardPoints = boardPoints;

  // elements by id.  Maps from point-string to element ID ('#...')
  this.lineIds = intersectionData.lineIds;
  this.starPointIds = intersectionData.starPointIds;
  this.stoneShadowIds = intersectionData.stoneShadowIds;
  this.stoneIds = intersectionData.stoneIds;
  this.markIds = intersectionData.markIds;
  this.buttons = intersectionData.buttons;

  // TODO(kashomon): What's going on here?
  this.buttonsData = [];
  for (var key in this.buttons) {
    this.buttonsData.push(glift.util.pointFromString(key));
  }
};

glift.displays.board._Intersections.prototype = {
  /**
   * Set the color of a stone. Returns 'this' for the possibility of chaining.
   */
  setStoneColor: function(pt, colorKey) {
    var key = pt.hash();
    if (this.theme.stones[colorKey] === undefined) {
      throw 'Unknown color key [' + colorKey + ']'
    }

    if (this.stoneIds[key] !== undefined) {
      var stoneColor = this.theme.stones[colorKey];
      this.svg.select('#' + this.stoneIds[key])
          .attr('fill', stoneColor.fill)
          .attr('stroke', stoneColor.stroke)
          .attr('stone_color', colorKey)
          .attr('opacity', stoneColor.opacity);
      if (this.stoneShadowIds[key] !== undefined) {
        if (stoneColor.opacity === 1) {
          this.svg.select('#' + this.stoneShadowIds[key]).attr('opacity', 1);
        } else {
          this.svg.select('#' + this.stoneShadowIds[key]).attr('opacity', 0);
        }
      }
    }
    return this;
  },

  addMarkPt: function(pt, mark, label) {
    glift.displays.board.addMark(
        this.divId, this.svg, this.boardPoints, this.theme, pt, mark, label);
    return this;
  },

  clearMarks: function() {
    var elems = glift.enums.svgElements;
    // Some STARPOINTs/BOARD_LINEs may have been 'turned-off' when adding marks.
    // It's easier just to manipulate them as a whole.
    // TODO(kashomon): Is there much of a performance hit for doing this?
    this.svg.selectAll('.' + elems.STARPOINT).attr('opacity', 1);
    this.svg.selectAll('.' + elems.BOARD_LINE).attr('opacity', 1);
    this.svg.selectAll('.' + elems.MARK).remove();
    return this;
  },

  clearStones: function() {
    var elems = glift.enums.svgElements;
    this.svg.selectAll('.' + elems.STONE).attr('opacity', 0)
        .attr('stone_color', 'EMPTY');
    this.svg.selectAll('.' + elems.STONE_SHADOW).attr('opacity', 0);
  },

  clearAll: function() {
    this.clearMarks();
    this.clearStones();
  },

  setEvent: function(event, func) {
    var BUTTON = glift.enums.svgElements.BUTTON;
    this.svg.selectAll('rect' + '.' + BUTTON).data(this.buttonsData)
      .on(event, function(pt) { func(pt); });
  }
};

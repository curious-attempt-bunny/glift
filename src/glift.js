/**
 * @preserve Glift: A Responsive Javascript library for the game Go.
 *
 * @copyright Josh Hoak
 * @license MIT License (see LICENSE.txt)
 * --------------------------------------
 */
(function() {
var glift = window.glift || {};

glift.global = {
  /**
   * Semantic versioning is used to determine the version.
   * See: http://semver.org/
   *
   * Currently in beta.
   */
  version: '0.7.4',
  /**
   * Whether or not fast click is enabled, via Glift.
   */
  fastClickEnabled: false,
  /**
   * Enable fast click.
   */
  enableFastClick: function() {
    if (!glift.global.fastClickEnabled) {
      FastClick.attach(document.body);
      glift.global.fastClickEnabled = true;
    }
  },
  debugMode: false,
  // Options for performanceDebugLevel: none, fine, info
  performanceDebugLevel: 'none',
  // Map of performance timestamps.
  perf: {},
  // The active registry.  Used to determine who has 'ownership' of key-presses.
  // The problem is that key presses have to be captured in a global scope (or
  // at least at the <body> level.  Unfortunate.
  // (not used yet).
  active: {}
};

window.glift = glift;
})();

/**
 * The new Glift SGF parser!
 * Takes a string, returns a movetree.
 */
glift.sgf.parse = function(sgfString) {
  var states = {
    BEGINNING: 1,
    PROPERTY: 2, // e.g., 'AB[oe]' or 'A_B[oe]' or 'AB_[oe]'
    PROP_DATA: 3, // 'AB[o_e]'
    BETWEEN: 4 // 'AB[oe]_', '_AB[oe]'
  };
  var statesToString = {
    1: 'BEGINNING',
    2: 'PROPERTY',
    3: 'PROP_DATA',
    4: 'BETWEEN'
  };
  var syn = {
    LBRACE:  '[',
    RBRACE:  ']',
    LPAREN:  '(',
    RPAREN:  ')',
    SCOLON:  ';'
  };

  var wsRegex = /\s|\n/;
  var propRegex = /[A-Z]/;

  var curstate = states.BEGINNING;
  var movetree = glift.rules.movetree.getInstance();
  var charBuffer = []; // List of characters.
  var propData = []; // List of Strings.
  var branchMoveNums = []; // used for when we pop up.
  var curProp = '';
  var curchar = '';
  var i = 0; // defined here for closing over
  var lineNum = 0;
  var colNum = 0;

  var perror = function(msg) {
    glift.sgf.parseError(lineNum, colNum, curchar, msg);
  };

  var flushCharBuffer = function() {
    var strOut = charBuffer.join("");
    charBuffer = [];
    return strOut;
  };

  var flushPropDataIfNecessary = function() {
    if (curProp.length > 0) {
      movetree.properties().add(curProp, propData);
      propData = [];
      curProp = '';
    }
  };

  var nextChar = function() {
    i++;
    i === sgfString.length ||
        perror("Reached end of input, but expected a character.");
    return sgfString.charAt(i);
  };

  (function() {
    // Run everything inside an anonymous function so we can use 'return' as a
    // fullstop break.
    for (var i = 0; i < sgfString.length; i++) {
      colNum++; // This means that columns are 1 indexed.
      curchar = sgfString.charAt(i);

      if (curchar === "\n" && curstate !== states.PROP_DATA) {
        lineNum++;
        colNum = 0;
        continue;
      }
      // glift.util.logz('i[' + i + '] -- ' + statesToString[curstate]
      //    + ' -- char[' + char + ']');
      switch (curstate) {
        case states.BEGINNING:
          if (curchar === syn.LPAREN || wsRegex.test(curchar)) {
            branchMoveNums.push(movetree.node().getNodeNum()); // Should Be 0.
          } else if (curchar === syn.SCOLON) {
            curstate = states.BETWEEN; // The SGF Begins!
          } else if (wsRegex.test(curchar)) {
            // We can ignore whitespace.
          } else {
            perror("Unexpected character");
          }
          break;
        case states.PROPERTY:
          if (propRegex.test(curchar)) {
            charBuffer.push(curchar);
            if (charBuffer.length > 2) {
              perror("Expected: length two proprety. Found: " + charBuffer);
            }
          } else if (curchar === syn.LBRACE) {
            curProp = flushCharBuffer();
            if (glift.sgf.allProperties[curProp] === undefined) {
              perror('Unknown property: ' + curProp);
            }
            curstate = states.PROP_DATA;
          } else if (wsRegex.test(curchar)) {
            // Should whitespace be allowed here?
            perror('Unexpected whitespace in Property')
          } else {
            perror('Unexpected character');
          }
          break;
        case states.PROP_DATA:
          if (curchar === syn.RBRACE
              && charBuffer[charBuffer.length - 1] === '\\') {
            charBuffer.push(curchar);
          } else if (curchar === syn.RBRACE) {
            propData.push(flushCharBuffer());
            curstate = states.BETWEEN;
          } else {
            charBuffer.push(curchar);
          }
          break;
        case states.BETWEEN:
          if (propRegex.test(curchar)) {
            flushPropDataIfNecessary();
            charBuffer.push(curchar);
            curstate = states.PROPERTY;
          } else if (curchar === syn.LBRACE) {
            if (curProp.length > 0) {
              curstate = states.PROP_DATA; // more data to process
            } else {
              perror("Unexpected token.  Orphan property data.");
            }
          } else if (curchar === syn.LPAREN) {
            flushPropDataIfNecessary();
            branchMoveNums.push(movetree.node().getNodeNum());
          } else if (curchar === syn.RPAREN) {
            flushPropDataIfNecessary();
            if (branchMoveNums.length === 0) {
              while (movetree.node().getNodeNum() !== 0) {
                movetree.moveUp(); // Is this necessary?
              }
              return movetree;
            }
            var parentBranchNum = branchMoveNums.pop();
            while (movetree.node().getNodeNum() !== parentBranchNum) {
              movetree.moveUp();
            }
          } else if (curchar === syn.SCOLON) {
            flushPropDataIfNecessary();
            movetree.addNode();
          } else if (wsRegex.test(curchar)) {
            // Do nothing.  Whitespace can be ignored here.
          } else {
            perror('Unknown token');
          }
          break;
        default:
          perror("Fatal Error: Unknown State!"); // Shouldn't get here.
      }
    }
    if (movetree.node().getNodeNum() !== 0) {
      perror('Expected to end up at start.');
    }
  })();
  return movetree;
};

/**
 * Throw a parser error.  The message is optional.
 */
glift.sgf.parseError =  function(lineNum, colNum, curchar, message) {
  var err = 'SGF Parsing Error: At line [' + lineNum + '], column [' + colNum
      + '], char [' + curchar + '], ' + message;
  glift.util.logz(err); // Should this error be logged this way?
  throw err;
};

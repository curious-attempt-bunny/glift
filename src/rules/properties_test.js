glift.rules.propertiesTest = function() {
  module("Properties Test");
  var properties = glift.rules.properties,
      point = glift.util.point;

  test("Test for GetAllStones", function() {
    var props = properties(),
        p1 = point(0, 0),
        p2 = point(18, 18);
    props.add('AB', p1.toSgfCoord()).add('AB', p2.toSgfCoord());
    ok(props.contains('AB'))
    deepEqual(props.getAllValues('AB').length, 2, "Must have 2 elems");
    var allStones = props.getAllStones();
    deepEqual(allStones.BLACK[0].toString(), "0,0");
    deepEqual(allStones.BLACK[1].toString(), "18,18");
  })

  test("Matches and not Matches", function() {
    var props = properties();
    var p1 = point(0, 0);
    props.add('B', p1.toSgfCoord()).add('GB', '1').add('C', 'foo');
    ok(props.matches({GB: []}), 'Match for GB');

    props = properties();
    props.add('B', p1.toSgfCoord()).add('C', 'foo');
    ok(!props.matches({GB: []}), 'No Match for nonexistent property');

    props = properties();
    props.add('B', p1.toSgfCoord()).add('C', 'foo');
    ok(!props.matches({GBA: []}), 'No Match for property typo');

    props = properties();
    props.add('B', p1.toSgfCoord()).add('C', 'This is correct');
    ok(props.matches({C: ['is correct']}), 'Match for comment substring');

    props = properties();
    props.add('B', p1.toSgfCoord()).add('C', 'This is correct').add('GB', '1');
    ok(props.matches({GB: [], C: ['is zog']}), 'Complex matcher');
  });
};

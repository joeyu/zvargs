var assert = require('assert');
var util = require('util');
var zvargs = require('../zvargs.js');
describe('VArgs', function(){
    describe('#constructor()', function(){
        var spec = [
            {'name': 'int1',    'type': 'number'},
            {'name': 'int2',    'type': 'number', 'optional': true},
            {'name': 'regexp1', 'type': RegExp, 'optional': true},
        ];

        //console.log(args);
        (function () {
            var args = new zvargs.VArgs(arguments, spec);
            var argsParent = arguments;
            //console.log(arguments);

            it(util.inspect(arguments), function(){
                assert.equal(args.int1, 1);
                assert.equal(args.int2, null);
                assert.equal(args.regexp1.toString(), /regexp/.toString());
                assert.equal(args.__extra.toString(), Array.prototype.slice.call(argsParent, 2).toString());
            })
        })(1, /regexp/, 2, 3, 'b', 'c', 'd', 'e', 'f');
    })
});

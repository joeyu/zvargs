var assert = require('assert');
var util = require('util');
var zvargs = require('../zvargs.js');
describe('Arguments', function(){
    describe('#constructor()', function(){
        (function () {
            var args = new zvargs.Arguments(arguments, [
                {'name': 'int1', 'type': 'number'},
                {'name': 'int2', 'type': 'number', 'optional': true},
                {'name': 'str1', 'type': 'string', 'optional': true},
            ]);

            var astr = util.inspect(arguments);        
            console.log(args);

            it(astr, function(){
                assert.equal(args.int1, 1);
                assert.equal(args.str1, 'a');
            })
        })(1, 'a', 2, 3, 'b', 'c', 'd', 'e', 'f');
    })
});

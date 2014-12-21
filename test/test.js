var assert = require('assert');
var util = require('util');
var zvargs = require('../zvargs.js');
describe('VArgs', function(){
    describe('#parse()', function(){
        var proto = "int1:number, [int2:number], [regexp1: RegExp|string]";

        (function () {
            var args = Array.prototype.slice.call(arguments);
            args.splice(1, 0, null);
            arguments  = zvargs.VArgs.parse(arguments, proto);
            var args2 = arguments;

            it("Testing 'string' 'proto' with optional arguments and multi-types", function(){
                assert.equal(args2.toString(), args.toString());
            })
        })(1, /regexp/, 2, 3, 'b', 'c', 'd', 'e', 'f');
    });
    describe('#constructor()', function(){
        var proto = [
            {'name': 'int1',    'type': 'number'},
            {'name': 'int2',    'type': 'number', 'optional': true},
            {'name': 'regexp1', 'type': [RegExp, 'string'], 'optional': true},
        ];

        (function () {
            var self = arguments;
            var args = new zvargs.VArgs(self, proto);

            it("Testing 'Array' 'proto' with optional arguments", function(){
                assert.equal(args.int1, self[0]);
                assert.equal(args.int2, null);
                assert.equal(args.regexp1.toString(), self[1].toString());
                assert.equal(args.__extra.toString(), Array.prototype.slice.call(self, 2).toString());
                //assert.equal(args.__arguments.toString(), Array.prototype.slice.call(self, 0).toString());
            })
        })(1, /regexp/, 2, 3, 'b', 'c', 'd', 'e', 'f');

        (function () {
            var self = arguments;
            var args = new zvargs.VArgs(self, proto);

            it("Testing 'Array' 'proto' with optional arguments and multi-types", function(){
                assert.equal(args.int1, self[0]);
                assert.equal(args.int2, null);
                assert.equal(args.regexp1, self[1]);
                assert.equal(args.__extra.toString(), Array.prototype.slice.call(self, 2).toString());
            })
        })(1, 'Hello', 2, 3, 'b', 'c', 'd', 'e', 'f');
    });
});

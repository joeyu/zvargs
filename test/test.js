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
            var self = arguments;
            //console.log(args.__arguments);

            it(util.inspect(arguments), function(){
                assert.equal(args.int1, 1);
                assert.equal(args.int2, null);
                assert.equal(args.regexp1.toString(), /regexp/.toString());
                assert.equal(args.__extra.toString(), Array.prototype.slice.call(self, 2).toString());
                //assert.equal(args.__arguments.toString(), Array.prototype.slice.call(self, 0).toString());
            })
        })(1, /regexp/, 2, 3, 'b', 'c', 'd', 'e', 'f');
    });
    describe('#constructor()', function(){
        var spec = "int1:number, [int2:number], [regexp1: RegExp]";

        //console.log(args);
        (function () {
            var args = new zvargs.VArgs(arguments, spec);
            var self = arguments;
            //console.log(args.__arguments);

            it(util.inspect(arguments), function(){
                assert.equal(args.int1, 1);
                assert.equal(args.int2, null);
                assert.equal(args.regexp1.toString(), /regexp/.toString());
                assert.equal(args.__extra.toString(), Array.prototype.slice.call(self, 2).toString());
                //assert.equal(args.__arguments.toString(), Array.prototype.slice.call(self, 0).toString());
            })
        })(1, /regexp/, 2, 3, 'b', 'c', 'd', 'e', 'f');
    })
});

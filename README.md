#zvargs

Zhou's node.js module for parsing variable arguments of functions.

Function's variable arguments prototype refers to arguments prototype that mix mandatory arguments and optional arguments. The following is an example:

>function func(arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string, ...);   

Where, the arguments enclosed in the square brackets are optional and may not be passed when the `func` function is called; and, the modifier after ':' of each argument specifies the argument's type (class); and `arg4` are specified with multi-types (i.e. RegExp and string) separated by '|'.

An example of such kind of function is that you have a function called `traverse`, which traverses a directory tree specified by `dir` and applies a callback function specified by `callback` to each of file node under that directory. And the user can also specify some options through an `options` object, which is optional and has default values. The `traverse` function's arguments prototype can thus be defined as follows:

>function traverse(dir:string, [options:object], callback:function);

A parser can use a function's varible arguments prototype to parse and check out the exact arguments when the function is invoked..


##Installation
    $ npm install zvargs

##Usage

```javascript
var zvargs = require('zvargs');
```

<a name="class">
##Class
VArgs

<a name="Methods">
###Methods

Method                                  | Brief
:---------------------------------------|:-----
[`VArgs`](#VArgs.constructor)           |The constructor method.
[`VArgs.parse`](#VArgs.parse)           |The parser function, which is a static method of class `VArgs`


<hr>

[Go back to **Methods**](#Methods)
<a name="VArgs.constructor" />
####VArgs(args, proto)
This constructor parses a function call's passed [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments), which is passed by `args`,  according to the function's variable arguments prototype.

A function's variable arguments prototype can be specified by an array as the `proto` argument passed to this contructor. Each item of `proto` corresponds to one argument of the function's arguments prototype. To reduce typing effort, the `proto` can also be specified as a string. 
  
This constructor starts parsing by picking up `arguments[0]` and checking if the type of it matches that of `proto[0]`. If the two match, it means the first argument of the function variable arguments prototype, which defined by `proto[0]`, is specified as `arguments[0]`, and `arguments[0]` will be stored as the value of a new property `this[proto[0].name]`,  and the constructor moves forward to check `arguments[1]` with `proto[1]`, and so on. If the two don't match, and if `proto[0]` has the `optional` property and its value is `true`, which means `proto[0]` is optional and this function call doesn't specify it, then the constructor will move forward to check `proto[1]`, and so on. The process will continue until the contructor finds a match or meets the end of `proto`.

After all checks complete, an `VArgs` object will store all matched `arguments` in its properties. However, there may be some passed arguments that aren't defined by `proto` and thus have never been checked, e.g. the [`...`] arguments would be optional and unlimited number of instances, and be undefined by `proto`. In such a case, a special `Array` property called `__extra` is used to store those remaining arguments.

All mandatory arguments defined in `proto` must be passed in the function call, otherwise, an error will be thrown out.

#####Arguments
* `args` : `Object`

    The [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments) of the function to parse.

* `proto` : `Array` | `String`

    If `proto` is an array, each item of it defines an argument's type and whether it is optional. The whole array defines all arguments of a function prototype in order.

    Each item of `proto` is an `Object`, which have the following properties:
    
  * `name` : `String`
        
        The name of the argument. If an argument matches the `proto` item, a new property named after the valule of `name` will be added to the `this` object, and its value will be the matched argument.

  * `type` : `built-in type string | Function | Array of built-in type string's and Function's`
  
        This `type` property is used to specify the javascript built-in type or `Object` class of the argument.
        
        If the argument is an `Object` (i.e., `typeof === 'object'`), specifying a `Function` object will allow to more precisely indicate what class it is.

        An `Array` of built-in type string's and `Function`'s can be used to specify the arguments can be any type in that `Array`. 

  * [`optional=false`] : `Boolean`

       This property specifies if the argument is optional. If this property isn't specified, the argument is mandatory by default.

    Example: for a function variable prototype as follows,

    >function func(arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string, ...);   

    The `proto` will be:

    ```javascript
    [
        {'name': 'arg0', 'type':    'number'},
        {'name': 'arg1', 'type':    Array,      'optional': true},
        {'name': 'arg2', 'type':    'string',   'optional': true},
        {'name': 'arg3', 'type':    'function'},
        {'name': 'arg4', 'type':    [RegExp, 'string']},
    ]
    ```
    
    If `proto` is a string, the above example can simply be:

    ```javascript
    "arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string"

    ```

<a name="VArgs.parse" />
####parse(args, proto)

This method is a static function, which acts the similar way as the contructor but returns a new `arguments`. This new `arguments` has all arguments of a function's variable arguments prototype assinged with the corresponding values passed by a function call. 

This method may give a simply way for a function definition to use the passed `arguments`. For instance, for the following function prototype:


>function func(arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp, ...);   

The function definition can simply be:

```javascript
var zvargs = require('zvargs');
function func(arg0, arg1, arg2, arg3, arg4) {
    arguments = zvargs.Args.parse(arguments, "arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string");

    // Then `arg0`, `arg1`, `arg2`, `arg3`, `arg4` can be referenced normally.
    // And the arguments following `arg4` can be referenced by `argument[5]`, `arguments[6]`...
    //
    //...
}
```

#####Return

An `Array` object of `arguments`. The `Array` object has all arguments of a function's variable arguments prototype assigned with the corresponding values of passed by a function call. The optional arguments that were not passed with values will be set to `null`. 

###Examples

```javascript
(function( /* arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string, ...*/ ) {
    var zvargs = require('zvargs');
    var args = new zvargs.VArgs(
        arguments, 
        "arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string"
    );

    console.log(args);
})(
    1, 
    ['hello', 'zvargs'],
    // args2 isn't specified.
    function() {
        if (arg1) console.log(arg1);
    }, 
    /search/,
    'extra_arg0',
    'extra_arg1'
);
```

The above code snippet will print out:

```
{
    'arg0': 1,
    'arg1': ['hello', 'zvargs'],
    'arg2': null,
    'arg3': function() { if (arg1) console.log(arg1); }, 
    'arg4': /search/,
    '__extra': ['extra_arg0', 'extra_arg1']
}
```

Alternatively, another simple approach can be:

```javascript
var zvargs = require('zvargs');
function func(arg0, arg1, arg2, arg3, arg4) {
    arguments = zvargs.Args.parse("arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp|string");

    // Then the new 'arguments' have been exactly what you need.
    console.log(arguments);
}

func(
    1, 
    ['hello', 'zvargs'],
    // args2 isn't specified.
    function() {
        if (arg1) console.log(arg1);
    }, 
    /search/,
    'extra_arg0',
    'extra_arg1'
);
```

The above code snippet will print out:

```
{
    1,                                             // 'arg0'
    ['hello', 'zvargs'],                           // 'arg1' 
    null,                                          // 'arg2' 
    function() { if (arg1) console.log(arg1); },   // 'arg3'     
    /search/,                                      // 'arg4' 
    'extra_arg0',                                  //
    'extra_arg1'                                   //  
}
```


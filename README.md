#zvargs

Zhou's node.js module for parsing variable arguments of functions.

##Installation
    $ npm install zvargs

##Usage

```javascript
var zvargs = require('zvargs');
```

<a name="class">
##Class
Arguments

<a name="Methods">
###Methods

Method                                  | Brief
:---------------------------------------|:-----
[`Arguments`](#Arguments.constructor)   |The constructor method.


<hr>

[Go back to **Methods**](#Methods)
<a name="Arguments.constructor" />
####Arguments(funcArgs, spec)
This constructor parses a function call's passed `arguments`, which is passed by `funcArgs`,  according to the specification of the function variable arguments prototype.

Function variable arguments prototype refers to arguments prototype that mix mandatory arguments and optional arguments. The following is an example:

>function func(arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp, ...);   

where, the modified after ':' is argument type or class, and the arguments enclosed in the square brackets are optional and may not be passed when the `func` function is called.

The specification of a function variable arguments prototype is specified by an array called `spec`, which is passed to this contructor. One item of `spec` corresponds to one argument of the function arguments prototype.
  
This constructor starts parsing by picking up `arguments[0]` and checking if type and class of it matches those of `spec[0]`. If the two match, it means the first argument of the function variable arguments prototype, which defined by `spec[0]`, is specified as `arguments[0]`, and `arguments[0]` will be stored as a new property of `this`,  and the constructior moves forward to check `arguments[1]` with `spec[1]`. If the two don't match, and if `spec[0]` has the `optional` property and its value is `true`, which means `spec[0]` is optional and this function call doesn't specify it, then the constructor will move forward to check `spec[1]`..., the process will continue until the contructor finds a match or meets the end of `spec`.

After all checks complete, an `Arguments` object will store all matched `arguments` in its properties. However, there may be some passed arguments that aren't defined by `spec` and thus have never been checked, e.g. the [`...`] arguments would be optional and unlimited number of instances, and be undefined by `spec`. In such a case, a special `Array` property called '__extra' is used to store those remaining arguments.

#####Arguments
* `funcArgs` : `Object`

    The function's `arguments`.

* `spec` : `Array`

    `spec` is an array, of which each item defines an argument's specification. The whole array defines all arguments of a function prototype in order.

    Each item of `spec` is an `Object`, which have one or more of the following properties:
    
  * `name` : `String`
        
        The name of the argument. If an argument matches the `spec` item, a new property called `name` will be added to the `this` object, and its value will be the matched argument.

  * `type` : `String`
  
        The type of the argument. This property is used to specify the javascript built-in type that `typeof` the argument is. If the type of the argument is `'object'`, the `class` property can be used to more precisely specify what class it is `instanceof`, and this property can be ignored; otherwise, the `class` property isn't applicable. 

  * `class` : `Function` 
  
        If the type of the argument is `object`, this property is used to specify the class that the argument is `instanceof`. If this property is specified, there is no need to specify the `type` property, as it is assumed to be `'object'`.

  * [`optional=false`] : `Boolean`

       This property specifies if the argument is optional. If this property isn't specified, the argument is mandatory by default.

    Example: for a function variable prototype as follows,

    >function func(arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp, ...);   

    The `spec` will be:

    ```javascript
    [
        {'name': 'arg0', 'type':    'number'},
        {'name': 'arg1', 'object':  'Array',    'optional': true},
        {'name': 'arg2', 'type':    'string',   'optional': true},
        {'name': 'arg3', 'type':    'function'},
        {'name': 'arg4', 'object':  'RegExp'},
    ]
    ```



###Examples

```javascript
(function() {
    var zvargs = require('zvargs');
    //function func(arg0:number, [arg1:Array], [arg2:string], arg3:function, arg4:RegExp, ...);   
    var args = new zvargs.Arguments(arguments, [
        {'name': 'arg0', 'type':    'number'},
        {'name': 'arg1', 'object':  'Array',    'optional': true},
        {'name': 'arg2', 'type':    'string',   'optional': true},
        {'name': 'arg3', 'type':    'function'},
        {'name': 'arg4', 'object':  'RegExp'},
    ]);

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
    'extra_arg1',
);
```

The above code snippet will print out:

```
{
    'arg0': 1,
    'arg1': ['hello', 'zvargs'],
    'arg2': function() { if (arg1) console.log(arg1); }, 
    'arg3': /search/,
    '__extra': ['extra_arg0', 'extra_arg1']
}
```




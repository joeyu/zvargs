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

###Methods

Method                                  | Brief
:---------------------------------------|:-----
[`Arguments`](#Arguments.constructor)   |The constructor method.


<hr>

[Go back to **Methods**](#Methods)
<a name="Arguments.constructor" />
####Arguments(funcArgs, spec)
The constructor parses a function's variable arguments according to the specification of the function's prototype.

Variable arguments refer to `arguments` that mix mandatory ones and optional ones. The following is an example:

>function f(arg0, [arg1], [arg2], arg3, arg4, ...);   

where the arguments enclosed in the square brackets are optional.

After parsing, an `Arguments` object will store the arguments in its properties as defined by `spec`. There may be some arguments that aren't defined by `spec`, i.e. the length of `arguments` is lokA special `Array` property called '__extra' is used to store those remaining arguments

#####Arguments
* `funcArgs` : `Object`

    The function's `arguments`.

* `spec` : `Array`

    `spec` is an array, of which each item defines an argument's specification. The whole array defines all arguments of a function prototype in order.

    Each item of `spec` is an `Object`, which have one or more of the following properties:
    
  * `name` : `String`
        
        The name of the argument. If an argument matches the `spec` item, a new property called `name` will be added to the `Arguments` object, and its value will be the matched argument.

  * `type` : `String`
  
        `typeof` the argument. This property is used when the argument is some javascript built-in type other tan 'object'.

  * `class` : `Function` 
  
        If the type of the argument is `object`, this property is used to specify of which class the argument is an instance.

  * [`optional=false`] : `Boolean`

       This property specifies if the argument is optional. If this property isn't specified, the argument is mandatory by default.
        

###Examples

```javascript
(function() { // (int1, [int2], [str1], str2, ...)
    var zvargs = require('zvargs');
    var args = new zvargs.Arguments(arguments, [
        {'name': 'int1', 'type': 'number'},
        {'name': 'int2', 'type': 'number', 'optional': true},
        {'name': 'str1', 'type': 'string', 'optional': true},
        {'name': 'str2', 'type': 'string'},
    ]);

    console.log(args);

)(1, 'a', 'b', 2, 3, 4, 'c', 'd');

```

The above code snippet will print out:

```
{
    'int1': 1,
    'int2': null,
    'str1': 'a',
    'str2': 'b',
    '__extra': [2, 3, 4, 'c', 'd']
}
```




// function (must0, [option0], [option1], must1, [options_extra...])


module.exports.VArgs = VArgs;

function VArgs(args, proto) {
    parse(args, proto, this);
}
VArgs.parse = parse;

function parse(args, proto, thisObj) {
    thisObj = thisObj || {};
    thisObj.__arguments = [];
    var i, j, k;

    if (typeof proto === 'string') {
        proto = proto.split(',').map(function(s) {
            s = s.trim();
            m = s.match(/^(\[)?\s*(\w*)\s*\:([^\]]+)(\])?$/);
            if (m) {
                if (m[1] === '[' && m[4] === ']') {
                    s = {'name': m[2], 'type': m[3], 'optional': true};
                } else {
                    s = {'name': m[2], 'type': m[3]};
                }

                s.type = s.type.split('|').map(function(t) {
                    return t.trim();
                });
                    

                return s;
            }
        });
    }

    for (j = 0; j < proto.length; j ++) {
        if (!(proto[j].type instanceof Array)) {
            proto[j].type = [proto[j].type];
        }

        proto[j].type = proto[j].type.map(function (s) {
            if (   typeof s === 'string'
                && s !== 'number' 
                && s !== 'string' 
                && s !== 'boolean' 
                && s !== 'function' 
                && s !== 'object' 
                && s !== 'symbol'
            ) {
                s = eval(s);
            }

            return s;
        });
        thisObj.__arguments[j] = null;
        thisObj[proto[j].name] = null;
    }

    for (i = j = 0; i < args.length && j < proto.length; i ++) {
        while (j < proto.length) {
            var isMatched = false;

            // Tests type
            for (k = 0; k < proto[j].type.length; k ++ ) {
                if (typeof proto[j].type[k] === 'string') {
                   if (typeof args[i] === proto[j].type[k]) {
                       isMatched = true;
                       break;
                   }
                } else if (proto[j].type[k] instanceof Function) {
                    if (args[i] instanceof proto[j].type[k]) {
                        isMatched = true;
                        break;
                    }
                }
            }

            if (!isMatched) {
               if (proto[j].hasOwnProperty('optional') && proto[j].optional) {
                    ++ j;
                    continue; // to match next proto item.
                } else {
                    throw "Error: mismatching";
                }
            } else {
                // matched
                thisObj.__arguments[j]   = args[i];
                thisObj[proto[j++].name] = args[i];
                break;
            }
        }
    }

    // Checks if all mandatory arguments are passed
    for(;j < proto.length; j++) {
       if (!proto[j].hasOwnProperty('optional') || !proto[j].optional) {
           throw "Error: not all mandatory arguments are passed";
       }
    }


    thisObj.__extra = null;
    // Stores remaining args items in `extra`.
    if (i < args.length) {
        thisObj.__extra = Array.prototype.slice.call(args, i);
        thisObj.__arguments = thisObj.__arguments.concat(thisObj.__extra);
    }

    return thisObj.__arguments;
}


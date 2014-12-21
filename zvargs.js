// function (must0, [option0], [option1], must1, [options_extra...])


module.exports.VArgs = VArgs;

function VArgs(args, proto) {
    parse(args, proto, this);
}
VArgs.parse = parse;

function parse(args, proto, thisObj) {
    thisObj = thisObj || {};
    thisObj.__arguments = [];
    var i, j;

    if (typeof proto == 'string') {
        proto = proto.split(',').map(function(s) {
            s = s.trim();
            m = s.match(/^(\[)?\s*(\w*)\s*\:\s*(\w*)\s*(\])?$/);
            if (m) {
                if (m[1] === '[' && m[4] === ']') {
                    s = {'name': m[2], 'type': m[3], 'optional': true};
                } else {
                    s = {'name': m[2], 'type': m[3]};
                }

                return s;
            }
        });
    }

    for (j = 0; j < proto.length; j ++) {
        if (   proto[j].type !== 'number' 
            && proto[j].type !== 'string' 
            && proto[j].type !== 'boolean' 
            && proto[j].type !== 'function' 
            && proto[j].type !== 'object' 
            && proto[j].type !== 'symbol'
        ) {
            proto[j].type = eval(proto[j].type);
        }
        thisObj.__arguments[j] = null;
        thisObj[proto[j].name] = null;
    }
    
    for (i = j = 0; i < args.length && j < proto.length; i ++) {
        while (j < proto.length) {
            var isMatched = true;

            // test type
            if (typeof proto[j].type === 'string') {
               if (typeof args[i] !== proto[j].type) {
                   isMatched = false;
               }
            } else if ( proto[j].type instanceof Function) {
                if (!(args[i] instanceof proto[j].type)) {
                    isMatched = false;
                }
            }

            if (!isMatched) {
               if (proto[j].hasOwnProperty('optional') && proto[j].optional) {
                    ++ j;
                    continue; // to match next proto item.
                } else {
                    throw "Error: mismatching";
                }
            }

            // matched
            thisObj.__arguments[j] = args[i];
            thisObj[proto[j++].name] = args[i];
            break;
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


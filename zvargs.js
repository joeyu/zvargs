// function (must0, [option0], [option1], must1, [options_extra...])


module.exports.Arguments = Arguments;

function Arguments(args, spec) {
    var i, j;
    for (j = 0; j < spec.length; j ++) {
        this[spec[j].name] = null;
    }
    
    for (i = j = 0; i < args.length && j < spec.length; i ++) {
        while (j < spec.length) {
            var isMatched = true;

            // test type
            if (spec[j].hasOwnProperty('type') && typeof args[i] !== spec[j]['type']) {
                isMatched = false;
            }
            
            // test class
            if (isMatched && spec[j].hasOwnProperty('class') && !(args[i] instanceof spec[j]['class'])) {
                isMatched = false;
            }
            
            if (!isMatched) {
               if (spec[j].hasOwnProperty('optional') && spec[j].optional) {
                    ++ j;
                    continue; // to match next spec item.
                } else {
                    throw "Error: mismatching";
                }
            }

            // matched
            this[spec[j++].name] = args[i];
            break;
        }
    }

    // Checks if all mandatory arguments are passed
    for(;j < spec.length; j++) {
       if (!spec[j].hasOwnProperty('optional') || !spec[j].optional) {
           throw "Error: not all mandatory arguments are passed";
           continue;
       }
    }


    this.__extra = null;
    // Stores remaining args items in `extra`.
    if (i < args.length) {
        this.__extra = Array.prototype.slice.call(args, i);
    }
}

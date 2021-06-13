'use strict';

var helperProc = {
    //todo this doesnt work - returns list of [key, value] instead of dict
    sort_obj: function (obj) {
        var items = Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });

// Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        return items;
    }
}

module.exports = helperProc;

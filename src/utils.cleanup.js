'use strict';

var cleanupProc = {
    run: function (Game, Memory) {
        for (var i in Memory.creeps) {
            if (!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
    }
}

module.exports = cleanupProc;
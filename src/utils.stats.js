'use strict';

const helperProc = require('utils.helper');

var statsProc = {

    creepsReport: function (obj = undefined) { //todo maybe dont just not include creep types w/ 0 alive
        var creeps = {};
        // if object given, get creeps in that object's room
        if (obj != undefined) {
            var census = Game.getObjectById(obj.id).room.find(FIND_MY_CREEPS);
        } else { // if not given, get all creeps
            var census = _.filter(Game.creeps)
        }
        for (var creep in census) {
            creep = census[creep]
            var c_role = undefined
            if ('role' in creep.memory) {
                c_role = creep.memory.role;
            }
            if (!creeps[c_role]) {
                creeps[c_role] = 0;
            }
            creeps[c_role]++;
        }
        return creeps;
    },

    numCreeps: function (obj) {
        return _.filter(obj.room.find(FIND_MY_CREEPS)).length
    }
}

module.exports = statsProc;

'use strict';

const helperProc = require('utils.helper');

var infoProc = {

    desiredDist: function (obj) {
        return {
            'miner': _.filter(obj.room.find(FIND_SOURCES)).length, //_.filter(obj.room.find(FIND_STRUCTURES), function (s) {return s.structureType == STRUCTURE_CONTAINER}).length, //todo maybe switch back to FIND_SOURCES
            'hauler': _.filter(obj.room.find(FIND_SOURCES)).length //_.filter(obj.room.find(FIND_STRUCTURES), function (s) {return s.structureType == STRUCTURE_CONTAINER}).length
        }
    },

    getCreepPriority: function () {
        var dist = {
            'miner': 0.90,
            'hauler': 0.80
             //todo change this - bandaid
        };
        //todo reimplement using sort_obj here
        return dist //helperProc.sort_obj(dist);
    },

    getBlueprints: function () {
        /*
        BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600}
        */

        return {
            'miner': {
                'blueprint': [WORK, WORK, WORK, WORK, WORK, MOVE],
                'cost': 550
            },
            'hauler': {
                'blueprint': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
                'cost': 550
            }
        };
    }
}

module.exports = infoProc;
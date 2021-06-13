'use strict';

const harvesterProc = require('role.harvester')
const minerProc = require('role.miner')
const haulerProc = require('role.hauler')
const spawnerProc = require('base.spawner')
const bannerProc = require('game.banners')
const cleanupProc = require('utils.cleanup')

module.exports.loop = function () {

    bannerProc.run(Game.rooms);
    cleanupProc.run(Game, Memory)

    for (var c in Game.creeps) {
        var creep = Game.creeps[c];
        if (creep.memory.role && creep.memory.role === 'miner') {
            minerProc.run(creep);
        } else if (creep.memory.role && creep.memory.role === 'hauler') {
            haulerProc.run(creep);
        } else {
            harvesterProc.run(creep);
        } // todo make this less hardcoded/ account for new roles
    }

    for (var s in Game.spawns) {
        var spawn = Game.spawns[s];
        spawnerProc.run(spawn);
    }

}


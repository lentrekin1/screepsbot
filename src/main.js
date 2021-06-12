'use strict';

const harvesterProc = require('role.harvester')
const spawnerProc = require('base.spawner')
const bannerProc = require('game.banners')
const cleanupProc = require('utils.cleanup')

module.exports.loop = function () {

    bannerProc.run(Game.rooms);
    cleanupProc.run(Game, Memory)

    for (var c in Game.creeps) {
        var creep = Game.creeps[c];
        harvesterProc.run(creep);
    }

    for (var s in Game.spawns) {
        var spawn = Game.spawns[s];
        spawnerProc.run(spawn);
    }

}


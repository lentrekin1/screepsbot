'use strict';

const statsProc = require('utils.stats');
const infoProc = require('utils.info');

var queueProc = {
    getQueue: function (spawn) {
        var queue = [];

        var creepReport = statsProc.creepsReport(spawn);
        var desiredDist = infoProc.desiredDist(spawn);
        var priority = infoProc.getCreepPriority();
        var blueprints = infoProc.getBlueprints();
        var numCreeps = statsProc.numCreeps(spawn);

        var creeps = [];
        //todo order creeps of same priority by time to live

        // get array of creeps in order of priority
        for (var role in priority) {
            for (var c in Game.creeps) {
                var creep = Game.creeps[c];
                if (creep.memory.role === role) {
                    creeps.push(creep);
                }
            }
        }

        //if no creeps, add harvester to queue first
        //todo maybe change/remove this
        if (!creepReport.hauler && (!creepReport.harvester || creepReport.harvester <= 0)) {
            queue.push(blueprints['harvester'])
        }

        // any classes w/ none alive added to queue second (in order of priority)
        for (var role in priority) {
            //console.log(creepReport[role], desiredDist[role], role)
            if ((!creepReport[role] && role !== 'harvester') || creepReport[role] < desiredDist[role]) {
                queue.push(blueprints[role]);
            }
        }

        // any creeps that will die soon added third
        for (var c in creeps) {
            var creep = creeps[c];
            if (creep.ticksToLive <= creep.memory.ticksToReplace) {
                queue.push(blueprints[creep.memory.role]);
            }
        }

        return queue;
    }
}

module.exports = queueProc;
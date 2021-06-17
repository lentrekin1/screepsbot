'use strict';

//const statsProc = require('utils.stats');
//const infoProc = require('utils.info');
const queueProc = require('utils.queue')

var spawnerProc = {
    run: function (spawn) {
        if (!spawn.spawning) {
            var queue = queueProc.getQueue(spawn);

            for (var q in queue) {
                var role = queue[q]
                if (spawn.room.energyAvailable >= role.cost) {
                    var result = spawn.spawnCreep(role.blueprint, role.role + Game.time, {memory: {role: role.role}});
                    if (result !== OK) {
                        console.log(`Unknown result from spawn.spawnCreep(${role.role}): ${result}`)
                    }
                    break;
                }
            }

            //old spawn algorithm
            /*var creepReport = statsProc.creepsReport(spawn);
            var desiredDist = infoProc.desiredDist(spawn);
            var priority = infoProc.getCreepPriority();
            var blueprints = infoProc.getBlueprints();
            var numCreeps = statsProc.numCreeps(spawn);

            //todo make this better
            if (!creepReport.hauler && (!creepReport.harvester || creepReport.harvester <= 0)) {
                result = spawn.spawnCreep([WORK, MOVE, CARRY], 'harvester' + Game.time, {memory: {role: 'harvester'}})
                if (result != OK) {
                    console.log(`Unknown result from spawn.spawnCreep(harvester): ${result}`)
                }
            }

            for (var role in priority) {
                // if none of this type exsists or not enough
                //console.log(`role ${role} creepreport ${creepReport[role]} desired ${desiredDist[role]}`)
                if ((!creepReport[role] && role !== 'harvester') || creepReport[role] < desiredDist[role]) {
                    if (spawn.room.energyAvailable >= blueprints[role].cost) {
                        var result = spawn.spawnCreep(blueprints[role].blueprint, role + Game.time, {memory: {role: role}});
                        if (result !== OK) {
                            console.log(`Unknown result from spawn.spawnCreep(${role}): ${result}`)
                        }
                    }
                    break;
                }
            }*/
        }
    }
}

module.exports = spawnerProc;
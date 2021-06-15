'use strict';

const statsProc = require('utils.stats');
const infoProc = require('utils.info');

var spawnerProc = {
    run: function (spawn) {
        if (!spawn.spawning) {
            // todo make spawning algorithm better
            var creepReport = statsProc.creepsReport(spawn);
            var desiredDist = infoProc.desiredDist(spawn);
            var priority = infoProc.getCreepPriority();
            var blueprints = infoProc.getBlueprints();
            var numCreeps = statsProc.numCreeps(spawn);

            //todo make this better
            if (!creepReport.hauler && creepReport.harvester <= 0) {
                result = spawn.spawnCreep([WORK, MOVE, CARRY], 'harvester' + Game.time, {memory: {role: 'harvester'}})
                if (result != OK) {
                    console.log(`Unknown result from spawn.spawnCreep(harvester): ${result}`)
                }
            }
            //console.log(JSON.stringify(creepReport))
            //console.log(JSON.stringify(desiredDist))
            //console.log(JSON.stringify(priority))
            //todo make it so track creep life time and spawn so that miner will show up just as other miner dies
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
            }
        }
    }
}

module.exports = spawnerProc;
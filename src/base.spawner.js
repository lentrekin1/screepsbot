'use strict';

const statsProc = require('utils.stats');
const infoProc = require('utils.info');

var spawnerProc = {
    run: function (spawn) {
        if (!spawn.spawning) {
            // var num_creeps = _.filter(spawn.room.find(FIND_MY_CREEPS)).length;
            // todo make spawning algorithm better

            var creepReport = statsProc.creepsReport(spawn);
            var desiredDist = infoProc.desiredDist(spawn);
            var priority = infoProc.getCreepPriority();
            var blueprints = infoProc.getBlueprints();
            var numCreeps = statsProc.numCreeps(spawn);

            //todo make this better
            if (numCreeps === 0) {
                result = spawn.spawnCreep([WORK, MOVE, CARRY], 'harvester' + Game.time)
                if (result != OK) {
                    console.log(`Unknown result from spawn.spawnCreep(harvester): ${result}`)
                }
            }

            //todo make it so track creep life time and spawn so that miner will show up just as other miner dies
            for (var role in priority) {
                //todo when can i use [] vs .
                // if none of this type exsists or not enough
                if (!creepReport[role] || creepReport[role] < desiredDist[role]) {
                    if (spawn.room.energyAvailable >= blueprints[role].cost) {
                        var result = spawn.spawnCreep(blueprints[role].blueprint, role + Game.time, {memory: {role: role}});
                        if (result != OK) {
                            console.log(`Unknown result from spawn.spawnCreep(${role}): ${result}`)
                        }
                    }
                    break;
                }
            }

            // old spawning algorithm
            /*if (num_creeps <= 0 && spawn.room.energyAvailable >= 250) {
                result = spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'harvester' + Game.time);
            } else if (num_creeps < 15 && spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
                if (spawn.room.energyCapacityAvailable >= 350) {
                    result = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], 'harvester' + Game.time);
                } else {
                    result = spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], 'harvester' + Game.time);
                }
            }*/
        }
    }
}

module.exports = spawnerProc;
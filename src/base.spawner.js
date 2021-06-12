'use strict';

var spawnerProc = {
    run: function (spawn) {
        if (!spawn.spawning) {
            var result = undefined;
            var num_creeps = _.filter(spawn.room.find(FIND_MY_CREEPS)).length; // todo this is how to get room-specific creeps
            // todo make spawning algorithm better
            if (num_creeps <= 0 && spawn.room.energyAvailable >= 250) {
                result = spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'harvester' + Game.time);
            } else if (num_creeps < 15 && spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
                if (spawn.room.energyCapacityAvailable >= 350) {
                    result = spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], 'harvester' + Game.time);
                } else {
                    result = spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], 'harvester' + Game.time);
                }
            }

            if (result != undefined && result != 0) {
                console.log('Unexpected spawn result: ' + result);
            }
        }
    }
}

module.exports = spawnerProc;
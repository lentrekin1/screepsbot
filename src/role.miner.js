'use strict';

var minerProc = {
    run: function (creep) {
        var target = undefined

        if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target);
        } else {
            // if not assigned to energy source, find an open one
            sources: //todo add check to see if container by source
                for (var source in creep.room.find(FIND_SOURCES).reverse()) { //todo remove the reverse() - bandaid to make sure first miner goes to source w/ container already built
                    for (var c in creep.room.find(FIND_MY_CREEPS)) {
                        if (c.Memory.role === 'miner' && c.Memory.target && c.Memory.target == source.id) {
                            continue sources;
                        }
                    }
                    target = source;
                    creep.memory.target = target.id;
                    break;
                }
        }

        if (target) {
            if (creep.isNearTo(target)) {
                var result = creep.harvest(target);
                if (result != OK) {
                    console.log(`[${creep.name}] (miner) Unknown result from creep.harvest(${source}): ${result}`);
                }
            } else {
                creep.moveTo(target);
            }
        } else {
            // no open sources found, shouldn't have spawned
            // todo add creep.suicide here when sure this script works
            console.log(`[${creep.name}] (miner) no open sources found`);
        }
    }
}

module.exports = minerProc;
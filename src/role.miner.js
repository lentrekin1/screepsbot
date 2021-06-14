'use strict';

var minerProc = {
    run: function (creep) {
        var target = undefined
        if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target);
        } else {
            // if not assigned to energy source, find an open one
            var creeps = creep.room.find(FIND_MY_CREEPS)
            var sources = creep.room.find(FIND_SOURCES).reverse()
            sources: //todo add check to see if container by source
                for (var s in sources) { //todo remove the reverse() - bandaid to make sure first miner goes to source w/ container already built
                    var source = sources[s]
                    for (var c in creeps) {
                        var thisCreep = creeps[c]
                        if (thisCreep.memory.role && thisCreep.memory.role === 'miner' && thisCreep.memory.target && thisCreep.memory.target == source.id) {
                            continue sources;
                        }
                    }
                    target = source;
                    creep.memory.target = target.id;
                    break;
                }
        }

        if (target) {
            if (creep.pos.isNearTo(target)) {
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
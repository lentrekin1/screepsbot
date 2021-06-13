'use strict';

var haulerProc = {
    run: function (creep) {
        // todo source should remain constant for life of hauler creep - change?
        if (creep.memory.filling && _.sum(creep.carry) >= creep.carryCapacity) {
            creep.memory.filling = false;
            //delete creep.memory.source;
        } else if (!creep.memory.filling && creep.carry.energy <= 0) {
            creep.memory.filling = true;
            delete creep.memory.target;
        }

        if (creep.memory.filling) {
            var source = undefined;
            if (creep.memory.source) {
                source = Game.getObjectById(creep.memory.source);
            } else {
                var source_opts = _.filter(creep.room.find(FIND_STRUCTURES), function (s) {return s.structureType === STRUCTURE_CONTAINER});
                //source_opts.concat(_.filter(creep.room.find(FIND_RUINS), function (r) {
                //    return r.store.getCapacity(RESOURCE_ENERGY) > 0
                //})); //todo maybe re-add ruins to harvesting options
                //todo add what to do if no containers found
                sources:
                for (var s in source_opts) {
                    for (var c in creep.room.find(FIND_MY_CREEPS)) {
                        if (c.memory.role === 'hauler' && c.memory.source && c.memory.source == s.id) {
                            continue sources;
                        }
                    }
                    source = s;
                    creep.memory.source = source.id;
                    break;
                }
            }

            if (source) {
                if (creep.pos.isNearTo(source)) {
                    var result = creep.withdraw(source, RESOURCE_ENERGY);
                    if (result != OK) {
                        console.log(`[${creep.name}] Unknown result from creep.harvest(${source}): ${result}`);
                    }
                } else {
                    creep.moveTo(source);
                }
            } else {
                // no unclaimed sources, creep shouldn't have spawned
                // todo add creep.suicide here when sure this script works
                console.log(`[${creep.name}] (hauler) no open sources found`);
            }
        } else {
            if (creep.memory.target && Game.getObjectById(creep.memory.target) !== undefined) {
                var target = Game.getObjectById(creep.memory.target)
            } else {
                //todo add track time until room controller downgrade and prevent,
                // track when next spawn needed and make sure spawner has enough energy,
                // track if constuction availible and go to if so
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) { // if not max energy in room, choose closest unfilled spawn/extension and go there
                    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: function (s) {return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity}});
                } else if (creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)) { // find closest construction and go there
                    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                } else { // if nothing else, target room controller
                    var target = _.filter(creep.room.find(FIND_MY_STRUCTURES), function (s) {return s.structureType == STRUCTURE_CONTROLLER});
                }
                creep.memory.target = target.id;
            }

            if (target.energyCapacity) {
                var is_close = creep.pos.isNearTo(target);
            } else {
                var is_close = creep.pos.inRangeTo(target, 2)
            }

            if (is_close) {
                if (target.energyCapacity) {
                    result = creep.transfer(target, RESOURCE_ENERGY);
                    if (result == OK || result == ERR_FULL) {
                        delete creep.memory.target;
                    } else {
                        console.log(`[${creep.name}] (hauler) Unknown result from creep.transfer(${target}, ${RESOURCE_ENERGY}): ${result}`);
                    }
                } else if (target.progress != undefined && target.isPowerEnabled == undefined) {
                    result = creep.build(target);
                    if (result == OK) {
                        delete creep.memory.target;
                    } else {
                        console.log(`[${creep.name}] (hauler) Unknown result from creep.build(${target}): ${result}`);
                    }
                } else {
                    result = creep.upgradeController(target);
                    if (result != OK) {
                        console.log(`[${creep.name}] (hauler) Unknown result from creep.upgradeController(${target}): ${result}`);
                    }
                    if (!creep.pos.inRangeTo(target, 2)) {
                        creep.moveTo(target);
                    }
                }
            } else {
                creep.moveTo(target)
            }
        }
    }
}

module.exports = haulerProc;
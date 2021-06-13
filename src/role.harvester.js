'use strict';

var harvesterProc = {
    run: function (creep) {
        if (creep.memory.filling && _.sum(creep.carry) >= creep.carryCapacity) {
            creep.memory.filling = false;
            delete creep.memory.source;
        } else if (!creep.memory.filling && creep.carry.energy <= 0) {
            creep.memory.filling = true;
            delete creep.memory.target;
        }

        if (creep.memory.filling) {
            if (creep.memory.source) {
                var source = Game.getObjectById(creep.memory.source);
            } else {
                /*var source_opts = creep.room.find(FIND_SOURCES_ACTIVE);
                source_opts.concat(_.filter(creep.room.find(FIND_RUINS), function (r) {
                    return r.store.getCapacity(RESOURCE_ENERGY) > 0
                }));

                source = _.sample(source_opts); //todo optimize this to not just be random*/

                source = Game.spawns['Spawn1'].pos.findClosestByPath(FIND_SOURCES_ACTIVE); //todo change this - bandaid

                creep.memory.source = source.id;
            }

            if (creep.pos.isNearTo(source)) {
                var result = creep.harvest(source);
                if (result != OK) {
                    // todo maybe change this to actually detect source type before trying to get energy
                    result = creep.withdraw(source, RESOURCE_ENERGY); // if harvest() didnt work, probably ruin, try withdraw()
                    if (result != OK) {
                        // todo had check if result == -7 here, why? and should i still have?
                        console.log(`[${creep.name}] Unknown result from creep.withdraw(${source}): ${result}`);
                    }
                }
            } else {
                creep.moveTo(source);
            }
        } else {
            if (creep.memory.target && Game.getObjectById(creep.memory.target) !== undefined) {
                var target = Game.getObjectById(creep.memory.target)
            } else {
                // todo clean up this section when selecting target
                var target = undefined
                if (_.filter(creep.room.find(FIND_MY_CREEPS)).length < 4) { // todo make it so get creeps in creep's specific room
                    target = _.sample(_.filter(creep.room.find(FIND_STRUCTURES), function (s) {
                        return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity
                    }));
                }
                if (target == undefined) {
                    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if (target == undefined) {
                        target = _.sample(_.filter(creep.room.find(FIND_STRUCTURES), function (s) {
                            return ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION)
                                && s.energy < s.energyCapacity) || s.structureType == STRUCTURE_CONTROLLER
                        }));
                    }
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
                    } else { //todo make all console.logs like below
                        console.log(`[${creep.name}] Unknown result from creep.transfer(${target}, ${RESOURCE_ENERGY}): ${result}`);
                    }
                } else if (target.progress != undefined && target.isPowerEnabled == undefined) {
                    result = creep.build(target);
                    if (result == OK) {
                        delete creep.memory.target;
                    } else {
                        console.log(`[${creep.name}] Unknown result from creep.build(${target}): ${result}`);
                    }
                } else {
                    result = creep.upgradeController(target);
                    if (result != OK) {
                        console.log(`[${creep.name}] Unknown result from creep.upgradeController(${target}): ${result}`);
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

module.exports = harvesterProc;
'use strict';
// this type should never spawn - backup in case something goes wrong
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
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                creep.memory.source = source.id;
            }

            if (creep.pos.isNearTo(source)) {
                if (source.store.getCapacity(RESOURCE_ENERGY)) {
                    var result = creep.harvest(source);
                } else {
                    var result = creep.withdraw(source, RESOURCE_ENERGY);
                }
                if (result != OK) {
                    console.log(`[${creep.name}] Unknown result from creep.withdraw(${source}): ${result}`);
                }
            } else {
                creep.moveTo(source);
            }
        } else {
            if (creep.memory.target && Game.getObjectById(creep.memory.target) !== undefined) {
                var target = Game.getObjectById(creep.memory.target)
            } else {
                // harvesters exist solely to fill up spawner so other creeps can be spawned
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: function (s) {return (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && s.energy < s.store.getCapacity(RESOURCE_ENERGY)}});
                creep.memory.target = target.id;
            }

            var is_close = creep.pos.isNearTo(target);

            if (is_close) {
                result = creep.transfer(target, RESOURCE_ENERGY);
                if (result == OK || result == ERR_FULL) {
                    delete creep.memory.target;
                } else {
                    console.log(`[${creep.name}] Unknown result from creep.transfer(${target}, ${RESOURCE_ENERGY}): ${result}`);
                }
            } else {
                creep.moveTo(target)
            }
        }
    }
}

module.exports = harvesterProc;
'use strict';
// this type should never spawn - backup in case something goes wrong

const statsProc = require('utils.stats');
const infoProc = require('utils.info');

var harvesterProc = {
    run: function (creep) {
        //creep should recycle when creepReport == desiredDist
        var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
        var creepReport = statsProc.creepsReport(spawn);
        var desiredDist = infoProc.desiredDist(spawn);

        outer:
        for (var i;i<1;i++) {
            for (var c in creepReport) {
                console.log(creepReport.c, desiredDist.c)
                if (creepReport.c !== desiredDist.c) {
                    break outer;
                }
            }
            if (creep.isNearTo(spawn)) {
                var result = spawn.recycleCreep(creep)
                if (result != OK) {
                    console.log(`[${creep.name}] Unknown result from spawn.recycle(): ${result}`);
                }
                break;
            } else {
                creep.moveTo(spawn)
                break;
            }
        }

        if (creep.memory.filling && _.sum(creep.carry) >= creep.carryCapacity) {
            creep.memory.filling = false;
            delete creep.memory.source;
        } else if (!creep.memory.filling && creep.carry.energy <= 0) {
            creep.memory.filling = true;
            delete creep.memory.target;
        }
        //todo add recycle harvesters once other creeps spawned
        if (creep.memory.filling) {
            if (creep.memory.source && Game.getObjectById(creep.memory.source)) { //todo add check if source/target still exists for everything
                var source = Game.getObjectById(creep.memory.source);
            } else { //todo implement necessary changes from harvester in hauler
                var source_opts = creep.room.find(FIND_DROPPED_RESOURCES).concat(creep.room.find(FIND_SOURCES_ACTIVE));
                var source = source_opts[0]
                // find closest source in list
                for (var s in source_opts) {
                    var currSource = source_opts[s];
                    if (creep.pos.findPathTo(currSource).length < creep.pos.findPathTo(source).length) {
                        source = currSource;
                    }
                }
                creep.memory.source = source.id;
            }

            if (creep.pos.isNearTo(source)) {
                if (source.store && source.store.getCapacity(RESOURCE_ENERGY)) {
                    var result = creep.harvest(source);
                } else if (source.amount) {
                    var result = creep.pickup(source);
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
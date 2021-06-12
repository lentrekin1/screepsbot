'use strict';

var bannerProc = {
    run: function (rooms) {
        for (var r in rooms) {
            var room = rooms[r];
            new RoomVisual(r).text('Energy in this room: ' + room.energyAvailable + ', out of a possible ' + room.energyCapacityAvailable, 0, 1, {
                'align': 'left',
                'font': 1
            });
        }
    }
}

module.exports = bannerProc;
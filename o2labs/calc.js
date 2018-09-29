const _ = require('lodash')
const MAX_ASSETS_LENGTH = 160; // in seconds
var v = { '1': [ { mediaId: 'mediaId4', duration: 50 } ],
'2': [ { mediaId: 'mediaId4', duration: 50 } ],
'3': [ { mediaId: 'mediaId4', duration: 50 } ],
'4': [ { mediaId: 'mediaId1', duration: 50 } ],
'5': [ { mediaId: 'mediaId1', duration: 50 } ],
'6': [ { mediaId: 'mediaId1', duration: 50 } ],
'7': [ { mediaId: 'mediaId1', duration: 50 } ],
'8': [ { mediaId: 'mediaId1', duration: 40 } ],
'9': [ { mediaId: 'mediaId1', duration: 50 } ],
'10': [ { mediaId: 'mediaId1', duration: 50 } ], }

function getNextFreeSlot(v) {
    let keys = Object.keys(v);
    if(!keys.length) return 1;
    let f = {}

    keys.map(i => {
        const vk = _.sumBy(v[i], "duration")
        f[i] = vk;
    })

    var sortable = [];
    for (var slotIndex in f) {
        sortable.push([slotIndex, f[slotIndex]]);
    }
    const same = sortable.filter(s => s[1] !== sortable[0][1])

    if(same.length === 0) {
        sortable.sort(function(a, b) {
            return Number(b[0]) - Number(a[0]);
        });
        const minimumDurationSlot = Number(sortable[0][0]);
        if(minimumDurationSlot === 10) {
            return 1;
        }
    } else {
        sortable.sort(function(a, b) {
            return a[1] - b[1];
        });
    }
    const minimumDurationSlot = Number(sortable[0][0]);
    if(sortable.length === 10) {
        return minimumDurationSlot;
    } else {
        return minimumDurationSlot + 1; 
    }
}



console.log(getNextFreeSlot(v))
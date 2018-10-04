const _ = require('lodash')
const MAX_SLOTS_IN_AN_HOUR = 10 // will get change depends on MAX_SLOT_DURATION

var v = [
    {
        date: "2018-10-21",
        screenId: 1,
        play: {
            5: { // hour
                1: [ // slot max duration 360 seconds
                    {
                        mediaId: "mediaId5",
                        duration: 60
                    }
                ]
            },
            6: { // hour
                1: [ // slot max duration 360 seconds
                    {
                        mediaId: "mediaId5",
                        duration: 60
                    }
                ]
            }
        }
    },
    {
        date: "2018-10-21",
        screenId: 2,
        play: {
            5: {
                1: [ // slot max duration 360 seconds
                    {
                        mediaId: "mediaId4",
                        duration: 70
                    }
                ]
            }
        }
    }
]
function regeneratePreSchedule () {
    var preSc = {}
    v.map(sc => {
        const scPlay = {...sc.play}
        if(preSc[sc.date]){
            const dup = {...preSc[sc.date]};
            const ks = _.uniq([...Object.keys(dup), ...Object.keys(sc.play)]);
            console.log({ks})
            ks.map(k => {
                if(dup[k] && scPlay[k]) {
                    const dupDuration = getHourDuration(dup[k])
                    const sc_h_Duration = getHourDuration(scPlay[k])
                    scPlay[k] = dupDuration > sc_h_Duration ? {...dup[k]} : {...scPlay[k]};
                } else if(!scPlay[k] && dup[k]) {
                    scPlay[k] = {...dup[k]}
                }
            })
        }
        preSc[sc.date] = scPlay    
    })
    return preSc;
}

function getHourDuration(hour) {
    let hour_duration = 0;
    for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
        const slot = hour[i] || [];
        if (slot.length > 0) {
            hour_duration  += _.sumBy(slot, 'duration')
        }
    }
    return hour_duration;
}
return;

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
const moment = require('moment')
const _ = require("lodash")

const MAX_ASSETS_LENGTH = 360; // in seconds
const MAX_FREQUENCY_ASSETS_LENGTH = 3600 // in seconds
const MAX_SLOT_DURATION = 360 // in seconds
const MAX_SLOTS_IN_AN_HOUR = 10 // will get changed as MAX_SLOT_DURATION

var data = {
    assets: {
        "mediaId1": 10,
        "mediaId2": 100,
        "mediaId3": 150,
    },
    hours: [1, 4, 5, 6],
    frequency: 3
}

/**
 * 1) check assets length is not more than 360 seconds
 * 2) check frequency * assets length not more than 3600 (in future it might become 3000) seconds
 * 3) create schedule
 */

const assetsLength = _.sum(Object.values(data.assets))

try {
    if (assetsLength > MAX_ASSETS_LENGTH) {
        throw new Error("Assets length should not be greater than 360")
    }
    const frequency_assets_length = (Number(data.frequency) * assetsLength);
    if (frequency_assets_length > MAX_FREQUENCY_ASSETS_LENGTH) {
        throw new Error("frequency * assets length should not be more than 3600")
    }
    let availableSlots = {};
    let schedule = {
        4: { // hour
            1: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 60
                },
                {
                    mediaId: "mediaId5",
                    duration: 300
                }
            ],
            2: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            3: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            4: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 100
                }
            ],
            5: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            6: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            7: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            8: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            9: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
            10: [ // slot max duration 360 seconds
                {
                    mediaId: "mediaId4",
                    duration: 160
                }
            ],
        }
    }
    data.hours.map(h => {
        schedule[h] = schedule[h] || {};
        availableSlots[h] = [];
        let rFrequency = Number(data.frequency);
        let cFrequency = 0;
        for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
            if (cFrequency !== rFrequency) {
                const slot = schedule[h][i] || [];
                let pushAsset = true;
                if (slot.length > 0) {
                    const sc_h_slot_duration = _.sumBy(slot, 'duration');

                    if (sc_h_slot_duration >= MAX_SLOT_DURATION) {
                        pushAsset = false;
                    } else {
                        const sc_h_slot_remaining_duration = MAX_SLOT_DURATION - sc_h_slot_duration;
                        if(sc_h_slot_remaining_duration < assetsLength) {
                            pushAsset = false;
                        }
                    }

                }
                if (pushAsset) {
                    availableSlots[h].push(i)
                    cFrequency++;
                }
            }
        }
    })
    console.log(availableSlots)
} catch (e) {
    console.log({ STEP1_ERROR: e.message })
}


















// const previous = [
//     {
//         assets: {
//             "mediaId4": 10,
//             "mediaId5": 100,
//         },
//         hours: [4, 5, 6],
//         frequency: 2
//     },
//     {
//         assets: {
//             "mediaId5": 10,
//         },
//         hours: [4, 5, 6],
//         frequency: 30
//     }
// ]

// const prevSchedule = {
//     4: { // hour
//         1: [ // slot max duration 360 seconds
//             {
//                 mediaId: "mediaId4",
//                 duration: 10
//             },
//             {
//                 mediaId: "mediaId5",
//                 duration: 100
//             }
//         ],
//         2: [
//             {
//                 mediaId: "mediaId4",
//                 duration: 10
//             },
//             {
//                 mediaId: "mediaId5",
//                 duration: 100
//             }
//         ]
//     }
// }

const moment = require('moment')
const _ = require("lodash")

const MAX_ASSETS_LENGTH = 360; // in seconds
const MAX_FREQUENCY_ASSETS_LENGTH = 3600 // in seconds
const MAX_SLOT_DURATION = 360 // in seconds
const MAX_SLOTS_IN_AN_HOUR = 10 // will get changed as MAX_SLOT_DURATION
const MAX_SLOT_AVIALABLE_HOUR_DURATION = 3600

var data = {
    assets: {
        "mediaId1": 10,
        "mediaId2": 100,
        "mediaId3": 150,
    },
    startDate:"2018-10-21",
    endDate: "2018-10-23",
    hours: [1, 4, 5, 6]
}
const assetsLength = _.sum(Object.values(data.assets))

try {
    if (assetsLength > MAX_ASSETS_LENGTH) {
        throw new Error("Assets length should not be greater than 360")
    }
    let preSchedule = [
		{
	    	date: "2018-10-21",
	        play: {
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
		        },
		        5: { // hour
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
		},
		{
	    	date: "2018-10-23",
	        play: {
	        	6: {
	        		1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId4",
		                    duration: 60
		                },
		                {
		                    mediaId: "mediaId5",
		                    duration: 300
		                }
		            ]
	        	}
	        }
	    }
    ]
    let formattedPreSchedule = {}
    
    let frequencyByDate = {}

    preSchedule.map(ps => {
    	formattedPreSchedule[ps.date] = ps.play;
    })

    var a = moment(data.startDate);
	var b = moment(data.endDate);

    for (let m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
	  let cDate = m.format('YYYY-MM-DD');
	  getAvailableSlotsForADate(cDate)
	}

	function getAvailableSlotsForADate(date) {
		let availableSlots = {};
    	let schedule = formattedPreSchedule[date];
    	frequencyByDate[date] = 0;
		if(schedule) {
			data.hours.map(h => {
		        schedule[h] = schedule[h] || {};
		        availableSlots[h] = [];
		        for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
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
		            }
		        }
		    })
		    console.log({[`Slots Available for ${date}`]: availableSlots})
		}
		else {
			console.log(`All slots available in ${date}`)
			frequencyByDate[date] = 10;
		}
	}

    
}catch(e) {
	console.log({fre_Error: e.message})
}
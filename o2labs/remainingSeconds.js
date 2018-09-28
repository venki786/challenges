const moment = require('moment')
const _ = require("lodash")

const MAX_ASSETS_LENGTH = 360; // in seconds
const MAX_FREQUENCY_ASSETS_LENGTH = 3600 // in seconds
const MAX_SLOT_DURATION = 360 // in seconds
const MAX_SLOTS_IN_AN_HOUR = 10 // will get change depends on MAX_SLOT_DURATION
const MAX_SLOT_AVIALABLE_HOUR_DURATION = 3600

var data = {
    startDate:"2018-10-21",
    endDate: "2018-10-23"
}

try {
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
    
    preSchedule.map(ps => {
    	formattedPreSchedule[ps.date] = ps.play;
    })

    let startDate = moment(data.startDate);
	let endDate = moment(data.endDate);
	let result = {};
    for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
	  let cDate = m.format('YYYY-MM-DD');
	  result[cDate] = getAvailableSlotDurationByDate(cDate)
	}

	function getAvailableSlotDurationByDate(date) {
		let availableSlots = {};
		let schedule = formattedPreSchedule[date];
		if(!schedule) {
			for (var i = 0; i < 24; i++) {
				availableSlots[i] = MAX_SLOT_AVIALABLE_HOUR_DURATION 	
			}
		} else {
			for (var h = 0; h < 24; h++) {
				schedule[h] = schedule[h] || {};
				if(!schedule[h]) {
					availableSlots[h] = MAX_SLOT_AVIALABLE_HOUR_DURATION;
				} else {
					let hourDuration = MAX_SLOT_AVIALABLE_HOUR_DURATION;
					for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
			            const slot = schedule[h][i] || [];
			            if (slot.length > 0) {
			                const sc_h_slot_duration = _.sumBy(slot, 'duration');
		                    hourDuration = hourDuration - sc_h_slot_duration;
		                }
		            }
		            availableSlots[h] = hourDuration;
				}
			}
		}
		return availableSlots;
	}

	console.log({result})

} catch(e) {
	console.log(e.message)
}
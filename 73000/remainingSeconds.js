const moment = require('moment')
const _ = require("lodash")

const MAX_ASSETS_LENGTH = 360; // in seconds
const MAX_FREQUENCY_ASSETS_LENGTH = 3600 // in seconds
const MAX_SLOT_DURATION = 360 // in seconds
const MAX_SLOTS_IN_AN_HOUR = 10 // will get change depends on MAX_SLOT_DURATION
const MAX_SLOT_AVIALABLE_HOUR_DURATION = 3600

var data = {
    startDate:"2018-10-21",
	endDate: "2018-10-23",
	screens: [ 1, 2, 3 ]
}

try {
	let preSchedule = [ // Retrieved this data based in schedule where screens in [1,2,3] and date between startDate & endDate
		{
			date: "2018-10-21",
			screenId: 1,
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
		            ]
		        },
		        5: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId5",
		                    duration: 10
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
		                    duration: 60
		                }
		            ]
	        	}
	        }
	    }
	]

	function regeneratePreSchedule (v) {
		var preSc = {}
		v.map(sc => {
			const scPlay = {...sc.play}
			if(preSc[sc.date]){
				const dup = {...preSc[sc.date]};
				const ks = _.uniq([...Object.keys(dup), ...Object.keys(sc.play)]);
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

    let formattedPreSchedule = regeneratePreSchedule(preSchedule);
	
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

	function getPlayDuration(schedule) {
		let sc_h_duration = {};
		for (var h = 0; h < 24; h++) {
			if(schedule[h]) {
				for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
					const slot = schedule[h][i] || [];
					if (slot.length > 0) {
						sc_h_duration[h] = _.sumBy(slot, 'duration')
					}
				}
			}
		}
		return sc_h_duration;
	}

} catch(e) {
	console.log(e.message)
}
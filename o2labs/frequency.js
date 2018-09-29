const moment = require('moment')
const _ = require("lodash")

const MAX_ASSETS_LENGTH = 360; // in seconds
const MAX_FREQUENCY_ASSETS_LENGTH = 3600 // in seconds
const MAX_SLOT_DURATION = 360 // in seconds
const MAX_SLOTS_IN_AN_HOUR = 10 // will get changed as MAX_SLOT_DURATION
const MAX_SLOT_AVIALABLE_HOUR_DURATION = 3600

var data = {
    assets: {
        "mediaId1": 50,
        //"mediaId2": 150,
        //"mediaId3": 150,
    },
    startDate:"2018-10-21",
    endDate: "2018-12-23",
    hours: [1, 4, 5, 6]
}
const assetsLength = _.sum(Object.values(data.assets))

try {
    if (assetsLength > MAX_ASSETS_LENGTH) {
        throw new Error("Assets length should not be greater than 360")
    }
	//let preSchedule = [];
	let preSchedule = [
		{
	    	date: "2018-10-21",
	        play: {
		        4: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId4",
		                    duration: 70
		                }
		            ]
		        },
		        5: {
		            1: [ 
		                {
		                    mediaId: "mediaId4",
		                    duration: 10
		                }
		            ]
		        }
		    }
		},
		{
	    	date: "2018-10-23",
	        play: {
	        	6: {
	        		1: [ 
		                {
		                    mediaId: "mediaId4",
		                    duration: 10
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

	let startDate = moment(data.startDate);
	let endDate = moment(data.endDate);
	
	let defaultFrequency = Math.floor(MAX_SLOT_DURATION / assetsLength);

    for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
	  let cDate = m.format('YYYY-MM-DD');
	  getAvailableSlotsByDate(cDate)
	}

	function getAvailableSlotsByDate(date) {
		let availableSlots = {};
    	let schedule = formattedPreSchedule[date];
    	if(!schedule) {
			frequencyByDate[date] = defaultFrequency * MAX_SLOTS_IN_AN_HOUR;
		} else {
			let frequencyByHour = {};
			data.hours.map(h => {
				if(!schedule[h]) {
					frequencyByHour[h] = defaultFrequency;
				} else {
					let frequencyBySlot = {};
					for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
						if(schedule[h][i]) {
							const sc_h_slot_duration = _.sumBy(schedule[h][i], 'duration');
							const sc_h_slot_available_duration = MAX_SLOT_DURATION - sc_h_slot_duration;
							if (assetsLength > sc_h_slot_available_duration) {
								frequencyBySlot[i] = 0;
							} else {
								frequencyBySlot[i] = Math.floor(sc_h_slot_available_duration / assetsLength);
							}
						} else {
							frequencyBySlot[i] = defaultFrequency;
						}
					}
					//console.log({[`${date}: Hour :${h}`]: frequencyBySlot})
					frequencyByHour[h] = _.min(Object.values(frequencyBySlot))
				}
			});
			console.log({[`${date}`]: frequencyByHour})
			frequencyByDate[date] = _.min(Object.values(frequencyByHour)) * MAX_SLOTS_IN_AN_HOUR;
		}
	}
	console.log({frequencyByDate})

    
}catch(e) {
	console.log({fre_Error: e.message})
}
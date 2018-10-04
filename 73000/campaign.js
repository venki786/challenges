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
        //"mediaId2": 150,
        //"mediaId3": 150,
    },
    startDate: "2018-10-21",
    endDate: "2018-10-23",
    hours: [1, 4, 5, 6],
    frequency: 3
}
const assetsLength = _.sum(Object.values(data.assets))

try {
    if (assetsLength > MAX_ASSETS_LENGTH) {
        throw new Error("Assets length should not be greater than 360")
    }
    //let preSchedule = [];
    let preSchedule = [ // Retrieved this data based in schedule where screens in [1,2,3] and date between startDate & endDate
		{
			date: "2018-10-21",
			screenId: 1,
	        play: {
		        4: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId4",
		                    duration: 10
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
		                    duration: 70
		                }
		            ]
		        }
		    }
		},
		{
			date: "2018-10-21",
			screenId: 2,
	        play: {
				4: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId4",
		                    duration: 20
		                },
		                {
		                    mediaId: "mediaId5",
		                    duration: 300
		                }
		            ]
		        },
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

    let frequencyByDate = {}

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
        if (!schedule) {
            frequencyByDate[date] = defaultFrequency * MAX_SLOTS_IN_AN_HOUR;
        } else {
            let frequencyByHour = {};
            data.hours.map(h => {
                if (!schedule[h]) {
                    frequencyByHour[h] = defaultFrequency;
                } else {
                    let frequencyBySlot = {};
                    for (let i = 1; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
                        if (schedule[h][i]) {
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
            console.log({ [`${date}`]: frequencyByHour })
            frequencyByDate[date] = _.min(Object.values(frequencyByHour)) * MAX_SLOTS_IN_AN_HOUR;
        }
    }
    // console.log({frequencyByDate})

    // insert campaign

    const currentMinFrequency = _.min(Object.values(frequencyByDate));

    // console.log({currentMinFrequency})

    if (data.frequency > currentMinFrequency) {
        throw new Error("Given Frequency is greater than Available Frequency")
    } else {
        for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
            let cDate = m.format('YYYY-MM-DD');
            mergeSlots(cDate)
        }
        function mergeSlots(date) {
            formattedPreSchedule[date] = formattedPreSchedule[date] || {}
            data.hours.map(h => {
                formattedPreSchedule[date][h] = formattedPreSchedule[date][h] || {};
                let cFrequency = 0;
                while (cFrequency < data.frequency) {
                    let i = getNextFreeSlot(formattedPreSchedule[date][h]);
                    for (i; i <= MAX_SLOTS_IN_AN_HOUR; i++) {
                        if (cFrequency < data.frequency) {
                            formattedPreSchedule[date][h][i] = formattedPreSchedule[date][h][i] || [];
                        }
                        Object.keys(data.assets).map(m => {
                            if (cFrequency < data.frequency) {
                                formattedPreSchedule[date][h][i].push({ mediaId: m, duration: data.assets[m] })
                                // console.log({[`${date}:${h}:${i}`]: {mediaId: m, duration: data.assets[m]}})
                                ++cFrequency;
                            }
                        })
                    }
                }
            })
        }
    }

    console.log(formattedPreSchedule["2018-10-21"]["4"])

    function getNextFreeSlot(v) {
        let keys = Object.keys(v);
        if (!keys.length) return 1;
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

        if (same.length === 0) {
            sortable.sort(function (a, b) {
                return Number(b[0]) - Number(a[0]);
            });
            const minimumDurationSlot = Number(sortable[0][0]);
            if (minimumDurationSlot === 10) {
                return 1;
            }
        } else {
            sortable.sort(function (a, b) {
                return a[1] - b[1];
            });
        }
        const minimumDurationSlot = Number(sortable[0][0]);
        if (sortable.length === 10) {
            return minimumDurationSlot;
        } else {
            return minimumDurationSlot + 1;
        }
    }

    let result = [];


} catch (e) {
    console.log({ fre_Error: e.message })
}
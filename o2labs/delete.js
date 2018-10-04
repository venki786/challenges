const moment = require('moment')
const _ = require("lodash")

const MAX_ASSETS_LENGTH = 360; // in seconds
const MAX_FREQUENCY_ASSETS_LENGTH = 3600 // in seconds
const MAX_SLOT_DURATION = 360 // in seconds
const MAX_SLOTS_IN_AN_HOUR = 10 // will get changed as MAX_SLOT_DURATION
const MAX_SLOT_AVIALABLE_HOUR_DURATION = 3600

var campaign = {
    assets: {
        "mediaId1": 10,
        //"mediaId2": 150,
        //"mediaId3": 150,
    },
    startDate: "2018-10-21",
    endDate: "2018-10-22",
    hours: [4, 5],
    frequency: 2
}

try {
    let preSchedule = [ // Retrieved this data based in schedule where screens in [1,2,3] and date between startDate & endDate
		{
			date: "2018-10-21",
			play: {
		        4: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                },
		                {
		                    mediaId: "mediaId5",
		                    duration: 300
		                }
                    ],
                    2: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                }
		            ]
		        },
		        5: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId5",
		                    duration: 70
                        },
                        {
		                    mediaId: "mediaId1",
		                    duration: 10
		                },
                    ],
                    2: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                }
		            ]
		        }
		    }
		},
		{
			date: "2018-10-22",
			play: {
				4: { // hour
		            1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                },
		                {
		                    mediaId: "mediaId5",
		                    duration: 300
		                }
                    ],
                    2: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                }
		            ]
		        },
	        	5: {
	        		1: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                }
                    ],
                    2: [ // slot max duration 360 seconds
		                {
		                    mediaId: "mediaId1",
		                    duration: 10
		                }
		            ]
	        	}
	        }
	    }
    ]

    let fPreSchedule = {}

    preSchedule.map(ps => {
        fPreSchedule[ps.date] = fPreSchedule[ps.date] || {}
        fPreSchedule[ps.date] = ps.play 
    })

    let arrageCampaignSchedules = {}
    
    let mediaIds = Object.keys(campaign.assets);

    let startDate = moment(campaign.startDate);
    let endDate = moment(campaign.endDate);

    for (let m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
        let cDate = m.format('YYYY-MM-DD')
        campaign.hours.map(h => {
            const vReq = fPreSchedule[cDate][h]
            const vt = {}
            for(let i = campaign.frequency;i > 0; i--){
                
                Object.keys(vReq).reverse().map((slot) => {
                    const slotData = vReq[slot]
                    slotData.filter((d, index) => {
                        if(mediaIds.includes(d.mediaId) && campaign.assets[d.mediaId] === d.duration) {
                            return false
                        }
                        return true;
                    })
                })
            }
        })
    }

    console.log(fPreSchedule["2018-10-21"]["4"]["1"])

} catch(e) {
    console.log(e)
}
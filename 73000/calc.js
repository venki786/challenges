var _ = require("lodash")
var venki = {
    "1": [
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 10
        }
    ],
    "2": [
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 10
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 50
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 25
        }
    ],
    "3": [
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 10
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 25
        }
    ],
    "4": [
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 25
        }
    ],
    "5": [
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        }
    ],
    "6": [
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        },
        {
            "mediaId": "5b9f934b419b8d1b4c769c40",
            "duration": 30
        }
    ]
}

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
    if(sortable.length !== 10) {
        sortable.sort(function (a, b) {
            return Number(b[0]) - Number(a[0]);
        });
        return Number(sortable[0][0]) + 1;
    } else {
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
}



console.log(getNextFreeSlot(venki))
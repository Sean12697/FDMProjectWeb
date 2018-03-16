window.addEventListener('load', init);


function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'uploads/data.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// Give it the whole data and property you want
function trunk(JSON, prop) {
    return JSON.map(a => a[prop]);
}

// Pass trunkated data (from array of objects, to the array)
function getUnique(data) {
    return unique = data.filter(function (item, pos) {
        return data.indexOf(item) == pos;
    });
}

// Pass whole array (["London", "London", "London", "Liverpool"]) and array from getUnique, for ["London", "Manchester", "Liverpool"] might return [31, 40, 1]
function getUniqueCount(data, arr) {
    var nums = [];
    for (var i = 0; i < arr.length; i++) nums.push(0);
    for (var i = 0; i < data.length; i++) for (var j = 0; j < arr.length; j++) if (data[i] == arr[j]) nums[j]++;
    return nums;
}

function init() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        //console.log(data);
        // Call shit here

        var type = document.getElementById("type").value;
        var label = document.getElementById("dataOne").value;
        var label2 = document.getElementById("dataTwo").value;

        var all = trunk(data, label);
        var all2 = trunk(data, label2);
        var legends = getUnique(all);
        var legends2 = getUnique(all2);
        var unique = getUniqueCount(all, legends);
        var unique2 = getUniqueCount(all2, legends2);
        //console.log(legends);
        //console.log(unique);
        
        main(type, label, legends, unique, label2, legends2, unique2, []);

        //main(document.getElementById("type").value, data.map(a => a[document.getElementById("legend").value]), data.map(a => a[document.getElementById("axisX").value]), data.map(a => a[document.getElementById("axisY").value]));
    });
}

document.getElementById("type").addEventListener("change", init);
document.getElementById("dataOne").addEventListener("change", init);
document.getElementById("dataTwo").addEventListener("change", init);
document.getElementById("reportBtn1").addEventListener("click", timeOnSite);
document.getElementById("reportBtn2").addEventListener("click", universityPlacement);
document.getElementById("reportBtn3").addEventListener("click", subjectJob);
document.getElementById("reportBtn4").addEventListener("click", classJob);

function subjectJob() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        subjectJobChart(data);
    });
}

function subjectJobChart(data) {

}

function universityPlacement() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        universityPlacementChart(data);
    });
}

function universityPlacementChart(data) {

    replaceChart();
    var ctx = document.getElementById("myChart");

    var unis = trunk(data, "University of Study");
    var placement = trunk(data, "Operating Location Name");
    var uniqueUnis = getUnique(unis);
    var uniquePlacement = getUnique(placement);

    var bc = [];
    for (var i = 0; i < uniqueUnis.length; i++) bc.push('rgba(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) + ', 0.2)');

    var datasets = [];
    for (var i = 0; i < uniquePlacement.length; i++) {

        datasets.push({
            label: uniquePlacement[i],
            data: overlapArr(data, uniquePlacement[i]), // tots
            backgroundColor: bc,
            borderWidth: 2
        });
    }
    
    console.log(datasets);

    
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: uniqueUnis,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]

            }
        }
    });
}


// return overlapped, [10, 20, 10], numbers for each uni in a placement 
function overlapArr(data, placementLocation) {
    var unis = trunk(data, "University of Study");
    var placements = trunk(data, placementLocation);
    var uniqueUnis = getUnique(unis);

    var nums = [];
    for (var i = 0; i < uniqueUnis.length; i++) nums.push(0);

    for (var i = 0; i < unis.length; i++) {
        for (var j = 0; j < placements.length; j++) {
            for (var t = 0; t < uniqueUnis.length; t++) {
                if (uniqueUnis[t] == unis[i] && placements[j] == placementLocation) {
                    nums[t]++;
                }
            }
        }
    }
}

function classJob() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        classJobChart(data);
    });
}

function classJobChart(data) {

}

function returnLengthOfTimeArr() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        // ON SERVICE TIME
        var start = trunk(data, "Start Date");
        var end = trunk(data, "End Date");
        var diff = [];
        for (var i = 0; i < start.length; i++) diff.push(datediff(parseDate(start[i]), parseDate(end[i])));
        //console.log(start);
        //console.log(end);
        //console.log(diff);
        return diff;
    });
}

function timeOnSite() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        // ON SERVICE TIME
        var start = trunk(data, "Start Date");
        var end = trunk(data, "End Date");
        var diff = [];
        for (var i = 0; i < start.length; i++) diff.push(datediff(parseDate(start[i]), parseDate(end[i])));
        //console.log(start);
        //console.log(end);
        //console.log(diff);
        timeOnSiteChart(data, diff);
    });
}

function replaceChart() {
    document.getElementById("chartDisplay").innerHTML = "";
    document.getElementById("chartDisplay").insertAdjacentHTML('beforeend', '<canvas id="myChart"></canvas>');
}

function timeOnSiteChart(data, times) {
    replaceChart();
    var ctx = document.getElementById("myChart").getContext('2d');
    
    var degrees = trunk(data, "Degree Subject");

    var unqiueDegrees = getUnique(degrees);
    var uniqueCount = getUniqueCount(degrees, unqiueDegrees);

    var totals = [];
    for (var i = 0; i < unqiueDegrees.length; i++) totals.push(0);
    for (var i = 0; i < degrees.length; i++) for (var j = 0; j < unqiueDegrees.length; j++) if (degrees[i] == unqiueDegrees[j]) totals[j] += times[i];

    var avg = [];
    for (var i = 0; i < uniqueCount.length; i++) avg.push(Math.round(totals[i] / uniqueCount[i]));

    var bc = [];
    for (var i = 0; i < unqiueDegrees.length; i++) bc.push('rgba(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) + ', 0.2)');

    console.log(degrees);
    console.log(unqiueDegrees);
    console.log(uniqueCount);
    console.log(times);
    console.log(totals);
    console.log(avg);

    var myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: unqiueDegrees,
            datasets: [{
                label: "Days spent on Site",
                data: avg, // Avg time Arr
                backgroundColor: bc,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function main(type, label, legend, dataOne, label2, legend2, dataTwo) {

    var bc = [];
    for (var i = 0; i < dataOne.length; i++) bc.push('rgba(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) +', 0.2)');
    for (var i = 0; i < dataTwo.length; i++) bc.push('rgba(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) + ', 0.2)');
    
    replaceChart();
    var ctx = document.getElementById("myChart").getContext('2d');

    var myChart = new Chart(ctx, {
        type: type,
        data: {
            //labels: legend,
            labels: legend2,
            datasets: [{
                label: label, 
                data: dataOne,
                backgroundColor: bc,
                borderWidth: 1
            },
            {
                label: label2,
                data: dataTwo,
                backgroundColor: bc,
                borderWidth: 1,
                }]
        },
        options: {
            
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
            }]
            }
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1] - 1, mdy[0]);
}

function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

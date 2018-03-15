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

        // ON SERVICE TIME
        var start = trunk(data, "Start Date");
        var end = trunk(data, "End Date");
        var diff = [];
        for (var i = 0; i < start.length; i++) diff.push(datediff(parseDate(start[i]), parseDate(end[i])));
        //console.log(start);
        //console.log(end);
        //console.log(diff);

        doShit(type, label, legends, unique, label2, legends2, unique2, []);

        //doShit(document.getElementById("type").value, data.map(a => a[document.getElementById("legend").value]), data.map(a => a[document.getElementById("axisX").value]), data.map(a => a[document.getElementById("axisY").value]));
    });
}

document.getElementById("type").addEventListener("change", init);
document.getElementById("dataOne").addEventListener("change", init);
document.getElementById("dataTwo").addEventListener("change", init);

function doShit(type, label, legend, dataOne, label2, legend2, dataTwo) {
    
    var ctx = document.getElementById("myChart").getContext('2d');
    var bc = [];
    for (var i = 0; i < dataOne.length; i++) bc.push('rgba(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) +', 0.2)');
    for (var i = 0; i < dataTwo.length; i++) bc.push('rgba(' + getRandomInt(255) + ', ' + getRandomInt(255) + ', ' + getRandomInt(255) + ', 0.2)');

    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: legend,
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

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

function init() {
    loadJSON(function (response) {
        var data = JSON.parse(response);
        console.log(data);
        // Call shit here
        doShit(document.getElementById("type").value, data.map(a => a[document.getElementById("legend").value]), data.map(a => a[document.getElementById("axisX").value]), data.map(a => a[document.getElementById("axisY").value]));
    });
}

document.getElementById("type").addEventListener("change", init);
document.getElementById("legend").addEventListener("change", init);
document.getElementById("axisX").addEventListener("change", init);
document.getElementById("axisY").addEventListener("change", init);
init();

function doShit(type, legend, axisX, axisY) {
    
    console.log(legend);
    console.log(axisX);
    console.log(axisY);
    
    var ctx = document.getElementById("myChart").getContext('2d');

    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: legend,
            datasets: [{
                label: '# of Votes',
                data: axisX,
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
                borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
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
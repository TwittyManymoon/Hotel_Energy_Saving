
/* Index */
var data

/* API - Edit here */
const api_powers = "http://127.0.0.1:8080/charts_customer"


/* Get data from server */
function initDataAndCB(cb) {
    console.log(api_powers)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText)
            cb();
        }
    };
    xhttp.open("GET", api_powers, true);
    xhttp.send();

}

/* Initialize webpage */
$(function () {
    initDataAndCB(assignValue)
});

/* Query data from 'power' */
function assignValue() {

    // charts
    data = Object.values(data)
    var data_Timestamp = []
    var data_Air = []
    var data_Outlet = []
    var data_Light = []

    for (var i = data.length - 1; i >= 0; i--) {
        data_Timestamp.push(data[i].Timestamp.slice(11, 16))
        data_Air.push(data[i].Air)
        data_Outlet.push(data[i].Outlet)
        data_Light.push(data[i].Light)
    }

    // comboBarLineChart
    var ctx1 = document.getElementById("LineChart1").getContext('2d');
    var comboBarLineChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: data_Timestamp, // real time
            datasets: [{
                type: 'line',
                label: 'Air Conditioner',
                backgroundColor: '#91F263',
                borderColor: '#91F263',
                borderWidth: 3,
                fill: false,
                data: data_Air, // real time

            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    var ctx2 = document.getElementById("LineChart2").getContext('2d');
    var comboBarLineChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: data_Timestamp, // real time
            datasets: [{
                type: 'line',
                label: 'Outlet',
                backgroundColor: '#0396A6',
                borderColor: '#0396A6',
                borderWidth: 3,
                fill: false,
                data: data_Outlet, // real time
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    var ctx3 = document.getElementById("LineChart3").getContext('2d');
    var comboBarLineChart = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: data_Timestamp, // real time
            datasets: [{
                type: 'line',
                label: 'Lightning',
                backgroundColor: '#025159',
                borderColor: '#025159',
                borderWidth: 3,
                fill: false,
                data: data_Light, // real time
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
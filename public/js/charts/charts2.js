$(function () {
    // request data from API
    // TODO: deploy to the server
    // $.get('http://127.0.0.1:8080/dashboard_customer',  // url
    //     function (data, textStatus, jqXHR) {
    //         $("#row_1_air").text(data.Air)
    //         $("#row_1_outlet").text(data.Outlet)
    //         $("#row_1_lights").text(data.Lights)

    //         // charts

    //     });
    var time_1 = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
    var data_1 = [12, 19, 3, 5, 2, 3, 13, 17, 11, 8, 11, 9]

    // comboBarLineChart
    var ctx1 = document.getElementById("LineChart1").getContext('2d');
    var comboBarLineChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: time_1, // real time
            datasets: [{
                type: 'line',
                label: 'Air Conditioner',
                backgroundColor: '#91F263',
                borderColor: '#91F263',
                borderWidth: 3,
                fill: false,
                data: data_1, // real time

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
            labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // real time
            datasets: [{
                type: 'line',
                label: 'Outlet',
                backgroundColor: '#0396A6',
                borderColor: '#0396A6',
                borderWidth: 3,
                fill: false,
                data: [12, 19, 3, 5, 2, 3, 13, 17, 11, 8, 11, 9], // real time
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
            labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"], // real time
            datasets: [{
                type: 'line',
                label: 'Lightning',
                backgroundColor: '#025159',
                borderColor: '#025159',
                borderWidth: 3,
                fill: false,
                data: [12, 19, 3, 5, 2, 3, 13, 17, 11, 8, 11, 9], // real time
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
});
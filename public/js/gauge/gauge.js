
/* Index */
var data

/* API - Edit here */
const api_powers = "http://127.0.0.1:8080/api/dashboard_customer"


/* Get data from server */
function initDataAndCB(cb) {
    console.log(api_powers)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText)
            console.log(data[0].Outlet)
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
    // gauge
    var $linearGauge1 = $("#lineargauge1");

    $linearGauge1.igLinearGauge({
        width: '100%',
        height: '80px',
        ranges: [
            {
                brush: '#EFEFEF',
                name: 'bad',
                startValue: 0,
                endValue: 20
            },
            {
                brush: '#FC7D6D',
                name: 'acceptable',
                startValue: 20,
                endValue: 35
            },
            {
                brush: '#FF5D48',
                name: 'good',
                startValue: 35,
                endValue: 100
            }
        ],
        value: data[0].Air,
        needleStrokeThickness: 2,
        formatLabel: function (evt, ui) {
            ui.label += " Watt";
        }
    });

    var $linearGauge2 = $("#lineargauge2");

    $linearGauge2.igLinearGauge({
        width: '100%',
        height: '80px',
        ranges: [
            {
                brush: '#EFEFEF',
                name: 'bad',
                startValue: 0,
                endValue: 20
            },
            {
                brush: '#F5CA76',
                name: 'acceptable',
                startValue: 20,
                endValue: 35
            },
            {
                brush: '#F1B53D',
                name: 'good',
                startValue: 35,
                endValue: 100
            }
        ],
        value: data[0].Outlet,
        needleStrokeThickness: 2,
        formatLabel: function (evt, ui) {
            ui.label += " Watt";
        }
    });

    var $linearGauge3 = $("#lineargauge3");

    $linearGauge3.igLinearGauge({
        width: '100%',
        height: '80px',
        ranges: [
            {
                brush: '#EFEFEF',
                name: 'bad',
                startValue: 0,
                endValue: 20
            },
            {
                brush: '#8FC9D9',
                name: 'acceptable',
                startValue: 20,
                endValue: 35
            },
            {
                brush: '#3DB9DC',
                name: 'good',
                startValue: 35,
                endValue: 100
            }
        ],
        value: data[0].Light,
        needleStrokeThickness: 2,
        formatLabel: function (evt, ui) {
            ui.label += " Watt";
        }
    });

}
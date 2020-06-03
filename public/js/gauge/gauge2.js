// #91F263
// #0396A6
// #025159
$(function () {

    // TODO: deploy to the server
    $.get('http://127.0.0.1:8080/dashboard_customer',  // url
        function (data, textStatus, jqXHR) {
            $("#row_1_air").text(data.Air)
            $("#row_1_outlet").text(data.Outlet)
            $("#row_1_light").text(data.Light)
            alert(data.Outlet)

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
                value: 5,
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
                value: 5,
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
                value: 5,
                needleStrokeThickness: 2,
                formatLabel: function (evt, ui) {
                    ui.label += " Watt";
                }
            });
        });
});

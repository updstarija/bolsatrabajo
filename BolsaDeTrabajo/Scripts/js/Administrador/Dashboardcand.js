var direct = window.location.href.split('/');
var urlBas = window.location.origin + "/" + direct[3];
$(document).ready(function () {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset-utf-8",
        dataType: "json",
        url: urlBas + "/DashboardCand",
        success: function (data) {
            graficoscand(data);
        }
    })
});
$("#cargandoindex").show();
$("#dashboardcand").hide();
function graficoscand(data) {
    $("#cargandoindex").hide();
    $("#dashboardcand").show();
        Highcharts.chart('dashboardcand', {

            chart: {
                type: 'lollipop'
            },

            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. {xDescription}, {point.y}.'
                }
            },

            legend: {
                enabled: false
            },

            subtitle: {
                text: '2022'
            },

            title: {
                text: 'Cantidades Totales',
                style: {
                    fontSize: '40px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },

            tooltip: {
                shared: true
            },

            xAxis: {
                type: 'category'
            },

            yAxis: {
                title: {
                    text: 'Cantidad'
                }
            },

            series: [{
                name: 'Cantidad',
                data: data,

            }]

        });
}
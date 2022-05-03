var direct = window.location.href.split('/');
var urlBas = window.location.origin + "/" + direct[3];
$(document).ready(function () {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset-utf-8",
        dataType: "json",
        url: urlBas + "/DashboardAdmin",
        success: function (data) {
            graficosadmin(data);
        }
    })
});
$("#cargandoindex").show();
$("#dashboardadmin").hide();

function graficosadmin(data) {
    $("#cargandoindex").hide();
    $("#dashboardadmin").show();
    Highcharts.chart('dashboardadmin', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Administradores',
            style: {
                fontSize: '40px',
                fontFamily: 'Verdana, sans-serif'
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: 0,
                style: {
                    fontSize: '20px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidad'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Cantidad',
            data: data,
            dataLabels: {
                enabled: true,
                rotation: 0,
                color: '#132BD5',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '20px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]

    });
}
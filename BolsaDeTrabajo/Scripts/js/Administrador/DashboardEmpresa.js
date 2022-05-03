var direct = window.location.href.split('/');
var urlBas = window.location.origin + "/" + direct[3];
$(document).ready(function () {
    console.log(urlBas);
    console.log("empresa");
    $.ajax({
        type: "GET",
        contentType: "application/json; charset-utf-8",
        dataType: "json",
        url: urlBas+"/DashboardEmpresa",
        success: function (data) {
            graficosempresa(data);
        }
    })
});
$("#cargandindex").show();
$("#dashboardempresa").hide();
function graficosempresa(data) {
    $("#cargandoindex").hide();
    $("#dashboardempresa").show();
    Highcharts.chart('dashboardempresa', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Empresas',
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
            name: 'Population',
            data: data,
            dataLabels: {
                enabled: true,
                rotation: 0,
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '20px',
                    fontFamily: 'Verdana, sans-serif',
                }
            }
        }]

    });
}
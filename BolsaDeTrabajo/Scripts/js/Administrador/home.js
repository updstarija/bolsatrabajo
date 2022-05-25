$(document).ready(function () {
    $("#cargandoEmpresas").show();
    $("#myChartEmpresas").hide();
    $("#cargandoCandidatos").show();
    $("#myChartCandidatos").hide();
    $("#cargandoAdministradores").show();
    $("#myChartAdministradores").hide();
    $("#cargandoTotal").show();
    $("#myChartTotal").hide();
    StatisticsEmpresas();
    StatisticsAdministradores();
    StatisticsCandidatos();
    StatisticsTotal();
});

function StatisticsEmpresas() {
    $.getJSON(urlOficial + 'Administradores/StatisticsEmpresas', function (o) {
    const ctx = document.getElementById('myChartEmpresas').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Empresas'],
                datasets: [
                    {
                        label: 'Aprobadas',
                        data: [o.activa],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Rechazadas',
                        data: [o.desaprobada],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
    $("#cargandoEmpresas").hide();
    $("#myChartEmpresas").show();
}

function StatisticsCandidatos() {
    $.getJSON(urlOficial + 'Administradores/StatisticsCandidatos', function (o) {
        const ctx = document.getElementById('myChartCandidatos').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Candidatos'],
                datasets: [
                    {
                        label: 'Aprobados',
                        data: [o.activo],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Rechazados',
                        data: [o.inicativo],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
    $("#cargandoCandidatos").hide();
    $("#myChartCandidatos").show();
}

function StatisticsAdministradores() {
    $.getJSON(urlOficial + 'Administradores/StatisticsAdministradores', function (o) {
        const ctx = document.getElementById('myChartAdministradores').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Administradores'],
                datasets: [
                    {
                        label: 'Activos',
                        data: [o.activo],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Deshabilitados',
                        data: [o.inicativo],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
    $("#cargandoAdministradores").hide();
    $("#myChartAdministradores").show();
}

function StatisticsTotal() {
    $.getJSON(urlOficial + 'Administradores/StatisticsTotal', function (o) {
        const ctx = document.getElementById('myChartTotal').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Cantidad total'],
                datasets: [
                    {
                        label: 'Empresas',
                        data: [o.empresas],
                        backgroundColor: [
                            'rgba(41, 128, 185, 0.2)'
                        ],
                        borderColor: [
                            'rgba(41, 128, 185, 1)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Candidatos',
                        data: [o.candidatos],
                        backgroundColor: [
                            'rgba(243, 156, 18, 0.2)'
                        ],
                        borderColor: [
                            'rgba(243, 156, 18, 1)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Administradores',
                        data: [o.administradores],
                        backgroundColor: [
                            'rgba(17, 122, 101, 0.2)'
                        ],
                        borderColor: [
                            'rgba(17, 122, 101, 1)'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: 'Total',
                        data: [o.total],
                        backgroundColor: [
                            'rgba(52, 73, 94, 0.2)'
                        ],
                        borderColor: [
                            'rgba(52, 73, 94, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
    $("#cargandoTotal").hide();
    $("#myChartTotal").show();
}
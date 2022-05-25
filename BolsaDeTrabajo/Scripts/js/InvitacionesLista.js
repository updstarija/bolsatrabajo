tabla = $('#tInvitacionesIndex').DataTable({
    columns: [
        { title: "#", width: '5%' },
        { title: "Fecha", width: '10%' },
        { title: "Empresa", width: '20%' },
        { title: "Empleo", width: '25%' },
        { title: "Curriculum", width: '20%' },
        { title: "Mensaje", width: '10%' },
        {
            title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosInvitacionesC' onchange='FiltrarInvitacionesC()'><option value='Todos'>Todos</option><option value='Visto'>Vistos</option><option value='Pendiente'>Pendientes</option></select></div>", width: '15%'
        }
    ],
});
$("#cargandoinvitacines").show();
$("#contenidoTInvitaciones").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    $.getJSON(urlOficial + 'Invitaciones/getLista', function (obj) {
        Listar(obj);
    });
    $("#filtrosInvitacionesC").val("Todos");
}
function Listar(obj) {
    $("#cargandoinvitacines").show();
    $("#contenidoTInvitaciones").hide();

    tabla.destroy();
    tabla = $("#tInvitacionesIndex").DataTable({
        data: obj,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },
        columns: [
            {
                data: "atrib1", width: '5%'
            },
            {
                data: "atrib2", width: '10%'
            },
            {
                data: "atrib3", width: '20%'
            },
            {
                data: "atrib4", width: '25%'
            },
            {
                data: "atrib5", width: '20%'
            },
            {
                data: "atrib6", width: '10%',
            },
            {
                data: "atrib7", width: '10%',
                sortable: false
            },
        ]
    });
    $("#cargandoinvitacines").hide();
    $("#contenidoTInvitaciones").show();
}

function FiltrarInvitacionesC() {
    var estado = $("#filtrosInvitacionesC").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        $.getJSON(urlOficial + 'Invitaciones/getListaFiltros', { cadena: estado }, function (data) {
            Listar(data);
        });
    }
}
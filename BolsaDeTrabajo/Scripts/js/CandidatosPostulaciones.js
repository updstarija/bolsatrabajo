tabla = $('#tPostulacionesC').DataTable({
    columns: [
        { title: "#", width: '5%' },
        { title: "Registro", width: '10%' },
        { title: "Empleo", width: '25%' },
        { title: "Empresa", width: '20%' },
        { title: "Curriculo", width: '20%' },
        { title: "Estado", width: '10%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosPostulacionesCandidato' onchange='FiltrarPostulaciones()'><option value='Aceptado'>Aceptados</option><option value='Pendiente'>Pendientes</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoPostulaciones").show();
$("#contenidoTPostulaciones").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    urlE = "https://localhost:44351/Candidatos";
    $.getJSON(urlE + '/getTablePostulaciones', function (obj) {
        Listar(obj);
    });
    $("#filtrosPostulacionesCandidato").val("Todos");
}

function Listar(obj) {
    $("#cargandoPostulaciones").show();
    $("#contenidoTPostulaciones").hide();

    tabla.destroy();
    tabla = $("#tPostulacionesC").DataTable({
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
                data: "atrib3", width: '25%'
            },
            {
                data: "atrib4", width: '20%'
            },
            {
                data: "atrib5", width: '20%'
            },
            {
                data: "atrib6", width: '10%'
            },
            {
                data: "atrib7", width: '10%',
                sortable: false
            }
        ]
    });
    $("#cargandoPostulaciones").hide();
    $("#contenidoTPostulaciones").show();
}
function FiltrarPostulaciones() {
    urlE = "https://localhost:44351/Candidatos";
    var estado = $("#filtrosPostulacionesCandidato").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        $.getJSON(urlE + '/getTablePostulacionesByEstado', { Estado: estado }, function (data) {
            Listar(data);
        });
    }
}

function CancelarPostulacion(IdPostulante) {
    urlE = "https://localhost:44351/Postulantes";
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Cancelar Postulación',
        theme: 'modern',
        content: '¿Esta Seguro que desea cancelar la postulación?',
        type: 'orange',
        typeAnimated: true,
        animation: 'rotateYR',
        closeAnimation: 'scale',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-orange',
                action: function () {
                    var formData = new FormData();
                    formData.append("Estado", "Cancelado");
                    formData.append("IdPostulante", IdPostulante);
                    $.ajax({
                        url: urlE + '/ActualizarEstado',
                        type: 'POST',
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            if (data.Tipo == 1) {
                                Actualizar();
                                Toast("success", data.Msj);
                            }
                        }
                    });
                }
            },
            close: {
                text: 'Cancelar',
                action: function () {
                }
            }
        }
    });
}
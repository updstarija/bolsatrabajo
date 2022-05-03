$(document).ready(function () {
    CargarNotificaciones();
});

var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function showMenuCuenta() {
    $("#Cuenta").animate({
        height: 'toggle'
    }, 1500);
}
function hideMenuCuenta() {
    $('#Cuenta').fadeOut(1500);
}

function CargarNotificaciones() {
    urlN = "https://localhost:44351/Notificaciones";
    urlI = "https://localhost:44351/Invitaciones";
    console.log(urlI);
    $.getJSON(urlN + '/getNotificaciones', function (data) {
        $("span[id=NroNotificaciones]").text(data.NotificacionesPendientes);
        if (data.Notificacion.length == 0) {
            $("#Notificacion").html("");
            var vacio = `<p class="text-center">No hay notificaciones para ver </p>`;
            $("#Notificacion").append(vacio);
        }
        else {
            $("#Notificacion").html("");
            for (var i = 0; i < data.Notificacion.length; i++) {
                var obj = data.Notificacion[i];
                if (obj.Estado == "Visto") {
                    var notificaciones = `
                      <div class="mb-3"id="content">`;
                }
                if (obj.Estado == "Pendiente") {
                    var notificaciones = `
                <div class="mb-3" style="background-color: #E4E4E4;" id="content">`;
                }

                notificaciones += `<div id="contentIcono">`;
                if (obj.Tipo == "Invitacion") {
                    notificaciones += `<i class="fas fa-users"></i>`;
                }
                else if (obj.Tipo == "Postulacion") {
                    notificaciones += `<i class="fas fa-check-circle"></i>`;
                }
                else if (obj.Tipo == "Empleo") {
                    notificaciones += `<i class="fas fa-business-time"></i>`;
                }

                notificaciones += `</div>`;
                notificaciones += `<div id="descripcion">
                    <div id="linea">
                    <h4>${obj.Titulo}</h4>
                    </div>
                    <div id="conentdescripcion">
                    <p>${obj.Descripcion}</p>
                    <p>Fecha: ${obj.FechaRegistro} <a href="${urlI}/Lista"><i class="fas fa-eye ico-blue ico-animation tooltip-test" title="VER MAS"></i></a></p>
                    </div>
                    </div>
                    </div>`;
                $("#Notificacion").append(notificaciones);
            }
            //<p>Fecha: ${obj.FechaRegistro} <a href="${urlE}/Lista?Id=${obj.Id}"><i class="fas fa-eye ico-blue ico-animation tooltip-test" title="VER MAS"></i></a></p>
        }
    });
}

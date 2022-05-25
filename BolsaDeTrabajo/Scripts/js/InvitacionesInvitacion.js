$(document).ready(function () {
    var id = $("#idValor").val();
    CargarDatos(id);
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function CargarDatos(id) {
    $.getJSON(urlOficial + 'Invitaciones/getInvitacion', { Id: id }, function (data) {
        var obj = data;
        if (obj != null) {
            VerMensaje(obj.Mensaje);
            CargarCurriculum(obj.Curriculum);
        }
    });
}

function VerMensaje(obj) {
    $("#viewMensaje").html('');
    var mensaje = `
        <h2 class="text-center mb-5">${obj.Asunto}</h2>
        <div style="display:flex">
        <p style="flex:10%;margin-left:30px;"><b>Emisor:</b> ${obj.Emisor}</p>
        <p style="flex:10%;"><b>Fecha Recibida:</b> ${obj.FechaRegistro}</p>
        </div>
        <div style="margin-left:30px;margin-right:30px; margin-bottom:40px;margin-top:15px;">
        <p style="text-align:justify">${obj.Texto}</p>
        </div>`;
    $("#viewMensaje").append(mensaje);
}

function CargarCurriculum(obj) {
    $("#IdCurriculum").html('');
    var curriculum = `<option selected value="${obj.DatosPersonalesC.idCurriculum}">${obj.InformacionGeneral.tituloIG}</option>`;
    $("#IdCurriculum").append(curriculum);
}

function verEmpleo(id, idcur) {
    $("#DetalleEmpleo").html('');
    $.getJSON(urlOficial + 'Empleos/getEmpleo', { Id: id }, function (obj) {
        var empleo = `
        <div class="row">
        <div class="col-12 col-sm-4">
        <div class="infoEmpresa shadow-lg p-3 mb-5 bg-white rounded">
        <h6>Información de:</h6>
        <h5 class="text-center font-weight-bold mt-3">${obj.Empresa.NombreEmpresa}</h5>
        <div class="d-flex justify-content-center mt-3">
        <img id="foto" class="img-fluid" src="data:image;base64,${obj.Empresa.Perfil.Foto}" alt="">
        </div>
        <p class="text-center mt-3">${obj.Ciudad}, ${obj.EstadoRegion}, ${obj.Pais}</p>`;
        if (obj.Empresa.Perfil.TelefonoCelular != null) {
            empleo += `<p><b>Telefono Celular:</b> ${obj.Empresa.Perfil.TelefonoCelular}</p>`;
        }
        if (obj.Empresa.Perfil.TelefonoFijo != null) {
            empleo += `<p><b>Telefono Fijo:</b> ${obj.Empresa.Perfil.TelefonoFijo}</p>`;
        }
        empleo += `<p><b>Pagina Web:</b></p>
        <a href="${obj.Empresa.SitioWeb}" target="_blank">${obj.Empresa.SitioWeb}</a>
        </div>
        </div>
        <div class="col-12 col-sm-8">
        <div class="infoEmpleo shadow-lg p-3 mb-5 bg-white rounded">
        <div class="d-flex justify-content-center justify-content-md-end">
        <button type="button" id="btnPostularEmpleo" class="btn btn-Blue font-weight-bold" data-toggle="modal" data-target="#PostulacionCIModal">Postular a este Empleo <i class="fas fa-angle-double-right"></i></button>
        </div>
        <h3 class="font-weight-bold text-center">${obj.Titulo}</h3>
        <div class="row">
        <div class="col-12 col-sm-6">
        <input type="hidden" name="IdDE" id="IdDE" value="${obj.Id}" />
        <p><b>Id Empleo:</b> ${obj.Id}</p>`;
        var cad = "";
        for (var i = 0; i < obj.Categorias; i++) {
            cad += obj.Categorias[i].Nombre + " ";
        }
        empleo += `<p><b>Categorias:</b> ${cad}</p>
        <p><b>Sueldo:</b> ${obj.RangoSueldos}</p>
        <p><b>Publicado:</b> ${obj.FechaRegistro}</p>
        </div>
        <div class="col-12 col-sm-6">
        <p><b>Ubicacion:</b> ${obj.Ciudad}, ${obj.EstadoRegion}, ${obj.Pais}</p>
        <p><b>Contrato:</b> ${obj.Contrato}</p>
        <p><b>Expiración:</b> ${obj.FechaExpiracion}</p>
        <p><b>Teletrabajo:</b> ${obj.Teletrabajo}</p>
        </div>
        </div>
        <hr />
        <h3>Descripción del Trabajo</h3>
        <p class="mt-3">${obj.Descripcion}</p>
        </div>
        </div>
        </div>`;
        $("#DetalleEmpleo").append(empleo);
        VerificarPostulacion(id, idcur);
    });
}

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    $("#CaracteresDispDE").html(tot + " / " + maxCaracteres);
}

function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validationRPCI');
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}

function RegistrarPostulacion() {
    if (VerificarFormulario() == true) {
        var obj = {
            PretencionSalarial: $("#PretencionSalarial").val(),
            IdCurriculum: $("#IdCurriculum").val(),
            IdEmpleo: $("#IdDE").val(),
            CartaPresentacion: $("#CartaPresentacion").val()
        }
        $.ajax({
            url: urlOficial + 'Postulantes/Guardar',
            type: 'POST',
            data: JSON.stringify(obj),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.Tipo == 1) {
                    $("#PostulacionCIModal").modal('hide');
                    Toast("success", data.Msj);
                    setTimeout(function () {
                        window.location.href = urlOficial + 'Invitaciones/Lista';
                    }, 3000);
                }
            }
        });
        var id = $("#idValor").val();
        $.getJSON(urlOficial + 'Invitaciones/cambiodeestado', { Id: id }, function (data) {
            console.log(data);
        });
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
}

function EnviarMensaje() {
    if ($("#ContenidoMensaje").val() != "") {
        var id = $("#idValor").val();
        var mensaje = $("#ContenidoMensaje").val();
        $.getJSON(urlOficial + 'Invitaciones/enviarMensaje', { mensajeR: mensaje, Id: id }, function (data) {
            if (data.Tipo == 1) {
                $("#MensajeModal").modal('hide');
                Toast("success", data.Msj);
                setTimeout(function () {
                    window.location.href = urlOficial + 'Invitaciones/Lista';
                }, 3000);
            }
        });
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
}

function VerificarPostulacion(idemp, idcur) {
    $.getJSON(urlOficial + 'Postulantes/verificarPostulacion', { IdEmpleo: idemp, IdCurriculum: idcur }, function (data) {
        if (data == true) {
            $("#btnPostularEmpleo").prop('disabled', true);
            $("#btnPostularEmpleo").text("Usted ya se postulo a este empleo");
            $("#btnPostularEmpleo").removeClass(" btn-Blue");
        }
    });
}
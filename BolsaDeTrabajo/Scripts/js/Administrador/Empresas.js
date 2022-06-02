//Validacion de inputs
$(function () {
    $('#nombre_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú0123456789-()""');
    $('#NIT_empresa').validacion('0123456789');
    $('#nombre_persona_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#ciudad_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()');
    $('#direccion_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()-/.0123456789');
    $('#sitio_web_empresa').validacion(' .:abcdefghijklmnñopqrstuvwxyzáéíóú0123456789//');
    $('#telefonoCelular').validacion('0123456789');
    $('#telefonoFijo').validacion(' -0123456789');
    $('#descripcion_empresa').validacion(' .,:;abcdefghijklmnñopqrstuvwxyzáéíóú0123456789""()');
    $('#correo_empresa').validacion(' .abcdefghijklmnñopqrstuvwxyzáéíóú0123456789@');
}); 

tabla = $('#tEmpresasC').DataTable({
    columns: [
        { title: "Registro", width: '10%' },
        { title: "NIT", width: '10%' },
        { title: "Empresa", width: '10%' },
        { title: "Representante", width: '10%' },
        { title: "Departamento", width: '10%' },
        { title: "Estado", width: '10%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='estadoEmpresa' onchange='FiltrarEmpresas()'><option value='Activo'>Activas</option><option value='Desaprobado'>Desaprobadas</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoEmpresas").show();
$("#contenidoTEmpresas").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    $.ajax({
        url: urlOficial + 'Administradores/getTableEmpresas',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (obj) {
            Listar(obj);
            $("#estadoEmpresa").val("Todos");
        }
    });
}

function Listar(obj) {
    $("#cargandoEmpresas").show();
    $("#contenidoTEmpresas").hide();
    tabla.destroy();
    tabla = $("#tEmpresasC").DataTable({
        data: obj,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },
        columns: [
            {
                data: "atrib2", width: '10%',
                sortable: false
            },
            {
                data: "atrib3", width: '10%',
            },
            {
                data: "atrib4", width: '10%',
            },
            {
                data: "atrib6", width: '10%',
            },
            {
                data: "atrib7", width: '10%',
            },
            {
                data: "atrib8", width: '5%',
                sortable: false
            },
            {
                data: "atrib9", width: '10%',
                sortable: false
            }
        ]
    });
    $("#cargandoEmpresas").hide();
    $("#contenidoTEmpresas").show();
}

function FiltrarEmpresas() {
    var estado = $("#estadoEmpresa").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        var o = { Estado: estado };
        $.ajax({
            url: urlOficial + 'Administradores/getTableEmpresasByEstado',
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            data: o,
            success: function (obj) {
                Listar(obj);
            }
        });
        //$.getJSON(urlE + '/getTableEmpresasByEstado', { Estado: estado }, function (data) {
        //    Listar(data);
        //});
    }
}

function ActualizarEstado(Select, IdEmpresa) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Modificar Estado',
        theme: 'modern',
        content: 'Se modificara el estado de la empresa, ¿Esta Seguro?',
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
                    var idSelect = Select.id;
                    formData.append("Estado", $("#" + idSelect).val());
                    formData.append("IdEmpresa", IdEmpresa);
                    //$.ajax({
                    //    url: '/Administradores/getTableEmpresasByEstado',
                    //    type: 'GET',
                    //    contentType: 'application/json',
                    //    dataType: 'json',
                    //    data: o,
                    //    success: function (obj) {
                    //        Listar(obj);
                    //    }
                    //});
                    $.ajax({
                        url: urlOficial + 'Administradores/EditarEstadoEmpresa',
                        type: 'POST',
                        data: formData,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        success: function (data) {
                            console.log(data);
                            if (data.Tipo == 1) {
                                Toast("success", data.Msj);
                            }
                        }
                    });
                }
            },
            close: {
                text: 'Cancelar',
                action: function () {
                    var idSelect = Select.id;
                    var valor = $("#" + idSelect).val();
                    valor = valor == "Activo" ? "Desaprobado" : "Activo";
                    $("#" + idSelect).val(valor);
                }
            }
        }
    });
}

function cargarInfoEmpresa(obj) {
    $("#seccionEmpresa").html("");
    var content = `
        <div class="row">
            <div class="col-12 col-sm-6">
                <p class="text-center text-sm-left"><i class="fas fa-calendar-day"></i><b>
                        Registro:
                    </b>${obj.Perfil.FechaRegistro}</p>
            </div>
            <div class="col-12 col-sm-6">
                <p class="text-center text-sm-right"><i class="fas fa-calendar-day"></i><b>
                        Actualización: </b>${obj.Perfil.FechaActualizacion}</p>
            </div>
        </div>
        <h3 class="text-center"><b>${obj.NombreEmpresa}</b></h3>
        <div class="row  text-center text-sm-left py-2">
            <div class="col-12 col-sm-6 col-md-12">
                <div class="d-flex justify-content-center align-items-center">
                    <img src="data:image;base64,${obj.Perfil.Foto}" class="border rounded shadow mb-2 bg-white rounded" alt="">
                </div>`;
                    if (obj.SitioWeb != "") {
                        content += `<p class="text-center"><a href="${obj.SitioWeb}" target="_blank">${obj.SitioWeb}</a></p>`;
                    }
    content += `
            <hr />
            </div>
            <div class="col-12 col-sm-6 col-md-6">
                <p><i class="fas fa-building"></i><b> Nit: </b> ${obj.NIT}</p>
                <p><i class="fas fa-user-tie"></i><span class="font-weight-bold"> </span> ${obj.NombrePersonaResponsable}</p>`;
                    if (obj.Perfil.TelefonoCelular != "") {
                        content += `<p><i class="fas fa-mobile-alt"></i> ${obj.Perfil.TelefonoCelular}</p>`;
                    }
                    if (obj.Perfil.TelefonoFijo != "") {
                        content += `<p><i class="fas fa-tty"></i> ${obj.Perfil.TelefonoFijo}</p>`;
                    }
                    content += `
            </div>
            <div class="col-12 col-sm-6 col-md-6">
                <p><i class="fas fa-globe-americas"></i><span class="font-weight-bold"> Pais: </span>${obj.Perfil.Pais}</p>
                <p><i class="fas fa-sitemap"></i><span class="font-weight-bold"> Departamento: </span>${obj.Perfil.EstadoRegion}
                </p>
                <p><i class="fas fa-city"></i><span class="font-weight-bold"> Ciudad: </span>${obj.Perfil.Ciudad}</p>
            </div>
            <div class="col-12 col-sm-12 col-md-12">
                <hr />
                <h5 class="mt-2">Descripción:</h5>
                <p class="text-justify">${obj.Perfil.Descripcion}</p>
                <p class="text-center"><i class="fas fa-info-circle"></i><span class="font-weight-bold"> ESTADO: </span>${obj.Perfil.Estado}
                </p>
            </div>
        </div>`;
    $("#seccionEmpresa").append(content);
}

function VerEmpresa(IdEmpresa) {
    var o = { Id: IdEmpresa };
    $.ajax({
        url: urlOficial + 'Empresas/getEmpresa',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: o,
        success: function (obj) {
            cargarInfoEmpresa(obj);
            $("#ModalEmpresa").modal("show");
        }
    });
    //$.getJSON(urlE + '/getEmpresa', { Id: IdEmpresa }, function (obj) {
    //    cargarInfoEmpresa(obj);
    //    $("#ModalEmpresa").modal("show");
    //});
}

function Limpiar() {
    $("#btnEmpresaGuardar").prop("disabled", false);
    $("#foto").attr("hidden", "hidden");
    $("#contImg").removeAttr("hidden", "hidden");
    $("#ModalRegistrarEmpresa").modal('show');
    $('#formRegistrarEmpresa').trigger("reset");
    $("#formRegistrarEmpresa").removeClass('was-validated');
    $("#divClave").removeClass('d-none');
    document.getElementById("imagen").required = true;
    document.getElementById("clave").required = true;
    $("#estadoCorreo").attr("hidden", "hidden");
    $("#correo_empresa").removeClass("border border-danger");
    $("#estadoUrl").attr("hidden", "hidden");
    $("#sitio_web_empresa").removeClass("border border-danger");
    $("#estadoNumero").attr("hidden", "hidden");
    $("#telefonoCelular").removeClass("border border-danger");
    //$('#miFormulario')[0].reset();
}
const MAXIMO_TAMANIO_BYTES = 1000000;

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDisponiblesEmpresa');
    p[0].innerText = tot + " / " + maxCaracteres;
}

document.getElementById("imagen").onchange = function (e) {
    $("#contImg").attr("hidden", "hidden");
    $("#foto").removeAttr("hidden", "hidden");
    var size = e.target.files[0].size;
    if (size <= MAXIMO_TAMANIO_BYTES) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            var img = document.getElementById('foto');
            img.src = reader.result;
        }
    }
    else {
        $("#imagen").val(null);
        var img = document.getElementById('foto');
        img.src = "";
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Imagen',
            theme: 'modern',
            content: 'El tamaño de la imagen debe ser menor a 1 mb',
            type: 'orange',
            typeAnimated: true,
            animation: 'rotateYR',
            closeAnimation: 'scale',
            buttons: {
                warning: {
                    text: 'Ok',
                    btnClass: 'btn-warning',
                    action: function () {
                    }
                }
            }
        });
    }
};

function verificarCorreo(valor) {
    var correo = $("#correo_empresa").val();
    var expreRegular = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    var esValido = expreRegular.test(correo);
    if (esValido == false && correo.length > 0) {
        $("#estadoCorreo").removeAttr("hidden", "hidden");
        $("#correo_empresa").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "su correo no es valido");
        }
    } else {
        $("#estadoCorreo").attr("hidden", "hidden");
        $("#correo_empresa").removeClass("border border-danger");
    }
    return esValido;
}

function verificarURL(valor) {
    var url = $("#sitio_web_empresa").val();
    var expreRegular = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var esValido = expreRegular.test(url);
    if (url.length > 0) {
        if (esValido == false) {
            $("#estadoUrl").removeAttr("hidden", "hidden");
            $("#sitio_web_empresa").addClass("border border-danger");
            if (valor == 1) {
                Toast("error", "su sitio web no es valido");
            }
        } else {
            $("#estadoUrl").attr("hidden", "hidden");
            $("#sitio_web_empresa").removeClass("border border-danger");
        }
        return esValido;
    } else {
        $("#estadoUrl").attr("hidden", "hidden");
        $("#sitio_web_empresa").removeClass("border border-danger");
        return true;
    }
}

function verificarCelular(valor) {
    var celu = $("#telefonoCelular").val();
    if (celu.length > 0 && celu.length < 8) {
        $("#estadoNumero").removeAttr("hidden", "hidden");
        $("#telefonoCelular").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "Su número de celular no es valido");
        }
        return false;
    } else {
        $("#estadoNumero").attr("hidden", "hidden");
        $("#telefonoCelular").removeClass("border border-danger");
        return true;
    }
}

function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validation-empresa');
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}
$("#formRegistrarEmpresa").on('submit', function (e) {
    e.preventDefault();
    if (VerificarFormulario() == true) {
        if (verificarCorreo(1) == true && verificarURL(1) == true && verificarCelular(1) == true) {
            var form = new FormData(this);
            form.append("pais_empresa", "Bolivia");
            $.ajax({
                url: urlOficial + 'Empresas/Guardar',
                type: 'POST',
                data: form,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Tipo == 1 || data.Tipo == 4) {
                        $("#btnEmpresaGuardar").prop("disabled", true);
                        Toast("success", data.Msj);
                        $("#ModalRegistrarEmpresa").modal('hide');
                        Actualizar();
                    }
                    else if (data.Tipo == 5) {
                        Toast("error", data.Msj);
                    }
                    else {
                        Toast("error", data.Msj);
                    }
                }
            });
        }
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
});

function CargarDatosEmpresa(IdEmpresa) {
    $("#btnEmpresaGuardar").prop("disabled", false);
    $("#contImg").attr("hidden", "hidden");
    $("#foto").removeAttr("hidden", "hidden");
    $("#estadoCorreo").attr("hidden", "hidden");
    $("#correo_empresa").removeClass("border border-danger");
    $("#estadoUrl").attr("hidden", "hidden");
    $("#sitio_web_empresa").removeClass("border border-danger");
    $("#estadoNumero").attr("hidden", "hidden");
    $("#telefonoCelular").removeClass("border border-danger");
    var o = { Id: IdEmpresa };
    $.ajax({
        url: urlOficial + 'Empresas/getEmpresa',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: o,
        success: function (obj) {
            $("#formRegistrarEmpresa").removeClass('was-validated');
            document.getElementById("imagen").required = false;
            $("#NIT_empresa").val(obj.NIT);
            $("#nombre_empresa").val(obj.NombreEmpresa);
            $("#id_empresa").val(obj.Id);
            $("#direccion_empresa").val(obj.Direccion);
            $("#sitio_web_empresa").val(obj.SitioWeb);
            $("#nombre_persona_empresa").val(obj.NombrePersonaResponsable);

            $("#telefonoCelular").val(obj.Perfil.TelefonoCelular);
            $("#telefonoFijo").val(obj.Perfil.TelefonoFijo);
            $("#pais_empresa").val(obj.Perfil.Pais);
            $("#estadoregion").val(obj.Perfil.EstadoRegion);
            $("#ciudad_empresa").val(obj.Perfil.Ciudad);
            $("#descripcion_empresa").val(obj.Perfil.Descripcion);
            $("#correo_empresa").val(obj.Perfil.Usuario.Correo);
            document.getElementById("clave").required = false;
            $("#divClave").addClass('d-none');
            $("#clave").val("");
            var img = document.getElementById('foto');
            img.src = "data:image;base64," + obj.Perfil.Foto;
        }
    });

    //$.getJSON(urlE + '/getEmpresa', { Id: IdEmpresa }, function (obj) {
    //    $("#formRegistrarEmpresa").removeClass('was-validated');
    //    document.getElementById("imagen").required = false;
    //    $("#NIT_empresa").val(obj.NIT);
    //    $("#nombre_empresa").val(obj.NombreEmpresa);
    //    $("#id_empresa").val(obj.Id);
    //    $("#direccion_empresa").val(obj.Direccion);
    //    $("#sitio_web_empresa").val(obj.SitioWeb);
    //    $("#nombre_persona_empresa").val(obj.NombrePersonaResponsable);

    //    $("#telefonoCelular").val(obj.Perfil.TelefonoCelular);
    //    $("#telefonoFijo").val(obj.Perfil.TelefonoFijo);
    //    $("#pais_empresa").val(obj.Perfil.Pais);
    //    $("#estadoregion").val(obj.Perfil.EstadoRegion);
    //    $("#ciudad_empresa").val(obj.Perfil.Ciudad);
    //    $("#descripcion_empresa").val(obj.Perfil.Descripcion);
    //    $("#correo_empresa").val(obj.Perfil.Usuario.Correo);
    //    document.getElementById("clave").required = false;
    //    $("#divClave").addClass('d-none');
    //    $("#clave").val("");
    //    var img = document.getElementById('foto');
    //    img.src = "data:image;base64," + obj.Perfil.Foto;
    //});
}
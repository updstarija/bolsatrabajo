/*validaciones de entrada*/
$(function () {
    $('#Nombre').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#Apellido').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#NroDocumento').validacion(' abcdefghijklmnñopqrstuvwxyz-0123456789');
    $('#Descripcion').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú0123456789.:;()""');
    $('#Pais').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#EstadoRegion').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#Ciudad').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()');
    $('#TelefonoCelular').validacion('0123456789');
    $('#Direccion').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()/.0123456789');
    $('#Correo').validacion('abcdefghijklmnñopqrstuvwxyzáéíóú0123456789@.');
});

tabla = $('#tAdministradores').DataTable({
    columns: [
        { title: "Registro", width: '10%' },
        { title: "Nombre", width: '20%' },
        { title: "Documento", width: '15%' },
        { title: "FechaNac", width: '10%' },
        { title: "<i class='fas fa-restroom'></i>", width: '5%' },
        { title: "Correo", width: '15%' },
        { title: "Estado", width: '10%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='estadoAdministrador' onchange='FiltrarUsuarios()'><option value='Activo'>Activos</option><option value='Inactivo'>Inactivos</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoAdministradores").show();
$("#contenidoTAdministradores").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    $.getJSON(urlOficial + 'Administradores/getTableAdmins', function (obj) {
        Listar(obj);
    });
    $("#estadoAdministrador").val("Todos");
}

function Listar(obj) {
    $("#cargandoAdministradores").show();
    $("#contenidoTAdministradores").hide();

    tabla.destroy();
    tabla = $("#tAdministradores").DataTable({
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
                data: "atrib3", width: '20%',
            },
            {
                data: "atrib4", width: '15%',
            },
            {
                data: "atrib5", width: '10%',
            },
            {
                data: "atrib6", width: '5%',
                sortable: false
            },
            {
                data: "atrib7", width: '15%',
            },
            {
                data: "atrib8", width: '10%',
                sortable: false
            },
            {
                data: "atrib9", width: '10%',
                sortable: false
            }
        ]
    });
    $("#cargandoAdministradores").hide();
    $("#contenidoTAdministradores").show();
}
function FiltrarUsuarios() {
    var estado = $("#estadoAdministrador").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        $.getJSON(urlOficial + 'Administradores/getTableAdminsByEstado', { Estado: estado }, function (data) {
            Listar(data);
        });
    }
}

function ActualizarEstado(Select, IdAdministrador) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Modificar Estado',
        theme: 'modern',
        content: 'Se modificara el estado del Administrador, ¿Esta Seguro?',
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
                    formData.append("IdAdministrador", IdAdministrador);
                    $.ajax({
                        url: urlOficial + 'Administradores/EditarEstadoAdmin',
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
                    valor = valor == "Activo" ? "Inactivo" : "Activo";
                    $("#" + idSelect).val(valor);
                }
            }
        }
    });
}
/*seguir************************************************/
var validarKey = true;
var validarClaves = false;

function Limpiar() {
    $("#estadoCorreo").attr("hidden", "hidden");
    $("#Correo").removeClass("border border-danger");
    $("#estadoNumero").attr("hidden", "hidden");
    $("#telefonoCelular").removeClass("border border-danger");
    $("#btnGuardarAdmin").prop("disabled", false);
    $("#foto").attr("hidden", "hidden");
    $("#contImg").removeAttr("hidden", "hidden");
    $("#ModalRegistrarAdministrador").modal('show');
    $('#FormAdministrador').trigger("reset");
    $("#FormAdministrador").removeClass('was-validated');
    document.getElementById("imagen").required = true;
    $("#divbtnMostrarCampos").html("");
    $("#divClave").html("");
    var contentClave = `
                        <div class="col-12 col-md-6 mt-3">
                            <label for="Clave">Contraseña:</label>
                            <input type="password" class="form-control" id="Clave" name="Clave" required>
                            <div class="invalid-feedback">¡Campo Vacio!</div>
                        </div>
                        <div class="col-12 col-md-6 mt-3">
                            <label for="confirmClave">Confirmar Contraseña:</label>
                            <input type="password" class="form-control" id="confirmClave" name="confirmClave" required>
                            <div id="clave2" class="invalid-feedback">Las contraseñas no coinciden</div>
                        </div>`;
    $("#divClave").append(contentClave);
}
const MAXIMO_TAMANIO_BYTES = 1000000;

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispDescripcion');
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

function verificarClave() {
    if ($("#Clave").val() == $("#confirmClave").val()) {
        return true;
    }
    else return false;
}

function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}

function verificarCorreo(valor) {
    console.log(valor);
    var correo = $("#Correo").val();
    var expreRegular = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    var esValido = expreRegular.test(correo);
    if (esValido == false && correo.length > 0) {
        $("#estadoCorreo").removeAttr("hidden", "hidden");
        $("#Correo").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "su correo no es valido");
        }
    } else {
        $("#estadoCorreo").attr("hidden", "hidden");
        $("#Correo").removeClass("border border-danger");
    }
    return esValido;
}

function verificarCelular(valor) {
    var celu = $("#TelefonoCelular").val();
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

$("#FormAdministrador").on('submit', function (e) {
    e.preventDefault();
    if (VerificarFormulario() == true && verificarClave() == true) {
        if (verificarCorreo(1) == true && verificarCelular(1) == true) {
            $.ajax({
                url: urlOficial + 'Administradores/GuardarAdmin',
                type: 'POST',
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Tipo == 1) {
                        $("#btnGuardarAdmin").prop("disabled", true);
                        Toast("success", data.Msj);
                        $("#ModalRegistrarAdministrador").modal('hide');
                        Actualizar();
                    }
                    else if (data.Tipo == 4) {
                        $("#btnGuardarAdmin").prop("disabled", true);
                        Toast("success", data.Msj);
                        $("#ModalRegistrarAdministrador").modal('hide');
                        setTimeout(function () {
                            window.location.href = urlOficial + 'Login/Logout';
                        }, 3000);
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

function CargarDatosAdministrador(IdAdministrador) {
    $("#estadoCorreo").attr("hidden", "hidden");
    $("#Correo").removeClass("border border-danger");
    $("#estadoNumero").attr("hidden", "hidden");
    $("#telefonoCelular").removeClass("border border-danger");
    $("#btnGuardarAdmin").prop("disabled", false);
    $("#contImg").attr("hidden", "hidden");
    $("#foto").removeAttr("hidden", "hidden");
    $.getJSON(urlOficial + 'Administradores/getAdmin', { Id: IdAdministrador }, function (obj) {

        $('#FormAdministrador').trigger("reset");
        $("#FormAdministrador").removeClass('was-validated');
        document.getElementById("imagen").required = false;
        $("#divbtnMostrarCampos").html("");
        var contendivbtnMostrarCampos = `
                            <div class="mt-2">
                                <button id="btnMostrarCampos" type="button" class="btn btn-Blue" onclick="MostrarCampos()">Cambiar Contraseña</button>
                                <button id="btnOcultarCampos" type="button" class="btn btn-danger d-none" onclick="OcultarCampos()">Cancelar</button>
                            </div>`;
        $("#divbtnMostrarCampos").append(contendivbtnMostrarCampos);
        $("#divClave").html("");
        $("#divClave").addClass('d-none');

        $("#IdAdministrador").val(obj.Id);
        $("#Nombre").val(obj.Nombre);
        $("#Apellido").val(obj.Apellido);
        $("#TipoDeDocumento").val(obj.TipoDeDocumento);
        $("#NroDocumento").val(obj.NroDocumento);
        $("#FechaNacimiento").val(obj.FechaNacimientoDate);
        $("#Descripcion").val(obj.Perfil.Descripcion);
        $("#Pais").val(obj.Perfil.Pais);
        $("#EstadoRegion").val(obj.Perfil.EstadoRegion);
        $("#Ciudad").val(obj.Perfil.Ciudad);
        $("#Direccion").val(obj.Direccion);
        $("#Profesion").val(obj.Profesion);
        $("#Sexo").val(obj.Sexo);
        $("#TelefonoCelular").val(obj.Perfil.TelefonoCelular);
        $("#TelefonoFijo").val(obj.Perfil.TelefonoFijo);
        $("#Correo").val(obj.Perfil.Usuario.Correo);
        var img = document.getElementById('foto');
        img.src = "data:image;base64," + obj.Perfil.Foto;
    });
}

function MostrarCampos() {
    $('#divClave').removeClass('d-none');
    $('#btnMostrarCampos').addClass('d-none');
    $('#btnOcultarCampos').removeClass('d-none');

    $('#divClave').html("");
    var contentClave = `
                        <div class="col-12 col-md-6">
                            <label for="Clave">Contraseña:</label>
                            <input type="password" class="form-control" id="Clave" name="Clave" required>
                            <div class="invalid-feedback">¡Campo Vacio!</div>
                        </div>
                        <div class="col-12 col-md-6">
                            <label for="confirmClave">Confirmar Contraseña:</label>
                            <input type="password" class="form-control" id="confirmClave" name="confirmClave" required>
                            <div id="clave2" class="invalid-feedback">Las contraseñas no coinciden</div>
                        </div>`;
    $("#divClave").append(contentClave);
    validarClaves = true;
}

function OcultarCampos() {
    $('#divClave').html("");
    $('#divClave').addClass('d-none');
    $("#divbtnMostrarCampos").html("");
    var contendivbtnMostrarCampos = `
                            <div class="mt-2">
                                <button id="btnMostrarCampos" type="button" class="btn btn-primary" onclick="MostrarCampos()">Cambiar Contraseña</button>
                                <button id="btnOcultarCampos" type="button" class="btn btn-danger d-none" onclick="OcultarCampos()">Cancelar</button>
                            </div>`;
    $("#divbtnMostrarCampos").append(contendivbtnMostrarCampos);
    validarClaves = false;
}

function cargarInfoAdmin(obj) {
    $("#seccionAdministrador").html("");
    var content = `
<div id="contenidoDetalle1">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="shadow p-3 mb-5 bg-white rounded">
                            <h3 class='font-weight-bold'>Datos personales</h3>
                            <div class="mt-4">
                                <div class="mt-4">
                                    <div class="row">
                                        <div class="col-sm-6">
                                           <img style="width:200px; height:200px; min-width:200px; min-height:200px; width:200px; height:200px" src="data:image;base64,${obj.Perfil.Foto}" alt="" />
                                        </div>
                                        <div class="col-sm-6 mt-3">
                                            <p><span class='font-weight-bold'>Nombre: </span>${obj.Nombre + " " + obj.Apellido}</p>
                                            <p><span class='font-weight-bold'>FechaNac.: </span>${obj.FechaNacimiento}</p>
                                            <p><span class='font-weight-bold'>Nro Documento: </span>${obj.NroDocumento}</p>
                                            <p><span class='font-weight-bold'>Sexo: </span>${obj.Sexo}</p>
                                        </div>
                                        <div class="col-sm-12 mt-3">
                                            <p><span class='font-weight-bold'>Profesión:</span>${obj.Profesion}</p>`;
                                            if (obj.Perfil.TelefonoCelular != "") {
                                                content += `<p><span class='font-weight-bold'>Telefono Celular:</span>${ obj.Perfil.TelefonoCelular }</p> `;
                                            }
                                            if (obj.Perfil.TelefonoFijo != "") {
                                                content += `<p><span class='font-weight-bold'>Telefono Fijo:</span>${ obj.Perfil.TelefonoFijo }</p >`;
                                            }
                                    content += `
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="shadow p-3 bg-white rounded">
                            <h3 class='font-weight-bold mt-1'>Datos Generales</h3>
                                <div class="row">
                                    <div class="col-sm-6">
                                        <p><span class='font-weight-bold'>Fecha Registro: </span></br>${obj.Perfil.FechaRegistro}</p>
                                        <p><span class='font-weight-bold'>Pais: </span>${obj.Perfil.Pais}</p>
                                        <p><span class='font-weight-bold'>Estado Region: </span>${obj.Perfil.EstadoRegion}</p>
                                    </div>
                                    <div class="col-sm-6">
                                        <p><span class='font-weight-bold'>Fecha Actualización: </span></br>${obj.Perfil.FechaActualizacion}</p>
                                        <p><span class='font-weight-bold'>Ciudad:</span>${obj.Perfil.Ciudad}</p>
                                        <p><span class='font-weight-bold'>Dirección: </span>${obj.Direccion}</p>
                                    </div>
                                </div>
                        </div>
                        <div class="shadow p-3 mt-3 bg-white rounded">
                            <p><span class='font-weight-bold'>Descripción: </span>${obj.Perfil.Descripcion}</p>
                        </div>
                    </div>
                    <div class="col-sm-12 mt-2">
                        <div class="shadow p-3 bg-white rounded d-flex justify-content-center w-100">
                            <p><i class="fas fa-info-circle"></i><span class="font-weight-bold"> ESTADO: </span>${obj.Perfil.Estado}</p>
                        </div>
                    </div>
                </div>
            </div>`;
    $("#seccionAdministrador").append(content);
}

function VerAdministrador(IdEmpresa) {
    $.getJSON(urlOficial + 'Administradores/getAdmin', { Id: IdEmpresa }, function (obj) {
        cargarInfoAdmin(obj);
        $("#ModalAdministrador").modal("show");
    });
}
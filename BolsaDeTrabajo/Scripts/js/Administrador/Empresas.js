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
    urlE = "https://localhost:44351/Administradores";
    $.getJSON(urlE + '/getTableEmpresas', function (obj) {
        Listar(obj);
    });
    $("#estadoEmpresa").val("Todos");
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
    urlE = "https://localhost:44351/Administradores";
    var estado = $("#estadoEmpresa").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        $.getJSON(urlE + '/getTableEmpresasByEstado', { Estado: estado }, function (data) {
            Listar(data);
        });
    }
}

function ActualizarEstado(Select, IdEmpresa) {
    urlE = "https://localhost:44351/Administradores";
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
                    $.ajax({
                        url: urlE + '/EditarEstadoEmpresa',
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
                <p class="text-center text-sm-left"><i class="fas fa-calendar-day"></i><span class="font-weight-bold">
                        REGISTRO:
                    </span>${obj.Perfil.FechaRegistro}</p>
            </div>
            <div class="col-12 col-sm-6">
                <p class="text-center text-sm-right"><i class="fas fa-calendar-day"></i><span class="font-weight-bold">
                        ACTUALIZACIÓN: </span>${obj.Perfil.FechaActualizacion}</p>
            </div>
        </div>
        <h1 class="text-center font-weight-bold">${obj.NombreEmpresa}</h1>
        <div class="d-flex justify-content-center align-items-center h-100 w-100">
            <img src="data:image;base64,${obj.Perfil.Foto}" class="img-fluid" alt="">
        </div>

        <div class="row  text-center text-sm-left py-2">
            <div class="col-12 col-sm-6 col-md-4">
                <p><i class="fas fa-building"></i><span class="font-weight-bold"> NIT: </span> ${obj.NIT}</p>
                <p><i class="fas fa-user-tie"></i><span class="font-weight-bold"> </span> ${obj.NombrePersonaResponsable}</p>
    `;
    if (obj.SitioWeb != "") {
        content += `<p><i class="fas fa-globe"></i><span class="font-weight-bold"> SITIO: </span> ${obj.SitioWeb}</p>`;
    }
    content += `
                <p><i class="fas fa-map-marked-alt"></i> Av/Principal</p>
            </div>
            <div class="col-12 col-sm-6 col-md-4">
                <p><i class="fas fa-file-signature"></i><span class="font-weight-bold"> TIPO: </span>${obj.Perfil.Tipo}</p>
                <p><i class="fas fa-globe-americas"></i><span class="font-weight-bold"> PAIS: </span>${obj.Perfil.Pais}</p>
                <p><i class="fas fa-sitemap"></i><span class="font-weight-bold"> DEPARTAMENTO: </span>${obj.Perfil.EstadoRegion}
                </p>
                <p><i class="fas fa-city"></i><span class="font-weight-bold"> CIUDAD: </span>${obj.Perfil.Ciudad}</p>
            </div>
            <div class="col-12 col-sm-6 col-md-4">`;
    if (obj.Perfil.TelefonoCelular != "") {
        content += `<p><i class="fas fa-mobile-alt"></i> ${obj.Perfil.TelefonoCelular}</p>`;
    }
    if (obj.Perfil.TelefonoFijo != "") {
        content += `<p><i class="fas fa-tty"></i> ${obj.Perfil.TelefonoFijo}</p>`;
    }
    content += `
            </div>
        </div>
        <h4>Descripción:</h4>
        <p class="text-justify">${obj.Perfil.Descripcion}</p>
        <p class="text-center"><i class="fas fa-info-circle"></i><span class="font-weight-bold"> ESTADO: </span>${obj.Perfil.Estado}
        </p>
    `;
    $("#seccionEmpresa").append(content);
}

function VerEmpresa(IdEmpresa) {
    urlE = "https://localhost:44351/Empresas";
    $.getJSON(urlE + '/getEmpresa', { Id: IdEmpresa }, function (obj) {
        cargarInfoEmpresa(obj);
        $("#ModalEmpresa").modal("show");
    });
}

function Limpiar() {
    $("#foto").attr("hidden", "hidden");
    $("#contImg").removeAttr("hidden", "hidden");
    $("#ModalRegistrarEmpresa").modal('show');
    $('#formRegistrarEmpresa').trigger("reset");
    $("#formRegistrarEmpresa").removeClass('was-validated');
    $("#divClave").removeClass('d-none');
    document.getElementById("imagen").required = true;
    document.getElementById("clave").required = true;
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
    urlE = "https://localhost:44351/Empresas";
    e.preventDefault();
    if (VerificarFormulario() == true) {
        var form = new FormData(this);
        form.append("pais_empresa", "Bolivia");
        $.ajax({
            url: urlE + '/Guardar',
            type: 'POST',
            data: form,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Tipo == 1 || data.Tipo == 4) {
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
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
});

function CargarDatosEmpresa(IdEmpresa) {
    urlE = "https://localhost:44351/Empresas";
    $("#contImg").attr("hidden", "hidden");
    $("#foto").removeAttr("hidden", "hidden");
    $.getJSON(urlE + '/getEmpresa', { Id: IdEmpresa }, function (obj) {
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
    });
}
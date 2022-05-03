tabla = $('#tCandidatosIndex').DataTable({
    columns: [
        { title: "Registro", width: '10%' },
        { title: "Nombre", width: '20%' },
        { title: "NroDocumento", width: '13%' },
        { title: "Cuidad", width: '13%' },
        { title: "Mas Info.", width: '9%' },
        { title: "Ver Curriculums", width: '10%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosCandidatos' onchange='filtrarCandidatosC()'><option value='Activo'>Activo</option><option value='Inactivo'>Inactivo</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandocandidatos").show();
$("#contenidoTcandidatos").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    urlE = "https://localhost:44351/Administradores";
    $.getJSON(urlE + '/getTableCandidatos', function (obj) {
        console.log(obj);
        Listar(obj);
    });
    $("#filtrosCandidatos").val("Todos");
}
function Listar(obj) {
    $("#cargandocandidatos").show();
    $("#contenidoTcandidatos").hide();
    tabla.destroy();
    tabla = $("#tCandidatosIndex").DataTable({
        data: obj,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },

        columns: [

            {
                data: "atrib2", width: '10%'
            },
            {
                data: "atrib3", width: '20%'
            },
            {
                data: "atrib4", width: '13%'
            },
            {
                data: "atrib5", width: '13%'
            },
            {
                data: "atrib6", width: '9%',
                sortable: false,
            },
            {
                data: "atrib7", width: '10%',
                sortable: false,
            },
            {
                data: "atrib8", width: '10%',
                sortable: false
            },
        ]
    });
    $("#cargandocandidatos").hide();
    $("#contenidoTcandidatos").show();
}

function filtrarCandidatosC() {
    urlE = "https://localhost:44351/Administradores";
    var val = $("#filtrosCandidatos").val();
    if (val == "Todos") {
        Actualizar()
    }
    else {
        $.getJSON(urlE + '/FiltrarCandidatos', { Filtro: val }, function (obj) {
            console.log(obj);
            Listar(obj);
        });
    }
}
function verdetallecandidato(id) {
    $("#contenidoDetalle1").html("");
    urlE = "https://localhost:44351/Administradores";
    $.getJSON(urlE + '/getCandidato', { Id: id }, function (obj) {
        console.log(obj);
        var agregar = `
             <div class="shadow p-3 mb-5 bg-white rounded">
                    <div class="row">
                        <div class="col-sm-12 mb-4">
                             <h4 class=" font-weight-bold">Datos personales</h4>
                        </div>
                        <div class="col-sm-5">
                            <div id="perfilfotografia">
                                <img id="foto" style="width:250px; height:250px;max-width:250px; max-height:250px; min-width:250px; min-height:250px;" src="data:image;base64,${obj.perfil.Foto}" alt="" />
                            </div>
                        </div>
                        <div class="col-sm-7">
                            <p><span class="font-weight-bold">Nombre: </span>${obj.Nombre + " " + obj.Apellido}</p>
                            <p><span class="font-weight-bold">Nacionalidad: </span>${obj.Nacionalidad}</p>
                            <p><span class="font-weight-bold">Tipo Documento: </span>${obj.TipoDeDocumento}</p>
                            <p><span class="font-weight-bold">Nro Documento: </span>${obj.NroDocumento}</p>
                            <p><span class="font-weight-bold">Fecha Nacimiento: </span>${obj.FechaNacimiento}</p>
                            <p><span class="font-weight-bold">Telefono Celular: </span>${obj.perfil.TelefonoCelular}</p>
                            <p><span class="font-weight-bold">Profecion/Ocupación:</span>${obj.ProfesionOcupacion}</p>
                        </div>
                    </div>
                </div>
                <div class="shadow p-3 mb-5 bg-white rounded">
                    <div class="row">
                        <div class="col-sm-12 mb-4">
                             <h4 class="font-weight-bold">Datos Generales</h4>
                        </div>
                        <div class="col-sm-5">
                            <p><span class="font-weight-bold">Fecha Registro: </span>${obj.perfil.FechaRegistro}</p>
                            <p><span class="font-weight-bold">Ciudad:</span>${obj.perfil.Ciudad}</p>
                            <p><span class="font-weight-bold">Pais: </span>${obj.perfil.Pais}</p>
                            <p><span class="font-weight-bold">Estado Region: </span>${obj.perfil.EstadoRegion}</p>
                            <p><span class="font-weight-bold">Tipo:</span>${obj.perfil.Estado}</p>
                        </div>
                        <div class="col-sm-7">
                            <p><span class="font-weight-bold">Estado Civil: </span>${obj.EstadoCivil}</p>
                            <p><span class="font-weight-bold">Licencia Vehiculo: </span>${obj.LicenciaVehiculo}</p>
                            <p><span class="font-weight-bold">Licencia Motocicleta: </span>${obj.LicenciaMotocicleta}</p>
                            <p><span class="font-weight-bold">Direccion: </span>${obj.Direccion}</p>
                        </div>
                        <div class="col-sm-12">
                            <p><span class="font-weight-bold">Descripción:</span>${obj.perfil.Descripcion}</p>
                        <div>
                    </div>
                </div>`;
        $("#contenidoDetalle1").append(agregar);

    });
}
function CambioEstado(Select, id) {
    urlE = "https://localhost:44351/Administradores";
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Modificar Estado',
        theme: 'modern',
        content: 'Se modificara el estado del Candidato, ¿Esta Seguro?',
        type: 'orange',
        typeAnimated: true,
        animation: 'rotateYR',
        closeAnimation: 'scale',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-orange',
                action: function () {
                    var val = $(`#cambioestadoC${id}`).val();
                    $.getJSON(urlE + '/cambioEstado', { Id: id, Estado: val }, function (obj) {
                        if (obj.Tipo == 1) {
                            Toast("success", obj.Msj);
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

tabla = $('#tPostulacionesC').DataTable({
    columns: [
        { title: "#", width: '5%' },
        { title: "Registro", width: '10%' },
        { title: "Empleo", width: '25%' },
        { title: "Empresa", width: '20%' },
        { title: "Ciudad", width: '20%' },
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
        var id = $("#idValor").val();
        Actualizar(id);
    }, 1000);
});

function Actualizar(id) {
    $.getJSON(urlOficial + 'Administradores/GetPostulaciones', { Id: id }, function (obj) {
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
    var estado = $("#filtrosPostulacionesCandidato").val();
    var id = $("#idValor").val();
    if (estado == "Todos") {

        Actualizar(id);
    }
    else {
        $.getJSON(urlOficial + 'Administradores/GetPostulacionesByEstado', { Id: id, Estado: estado }, function (data) {
            Listar(data);
        });
    }
}
function verdetalleEmpleo(id) {
    $("#DetalleEmpleo").html('');
    $.getJSON(urlOficial + 'Empleos/getEmpleo', { Id: id }, function (obj) {
        console.log(obj);
        var empleo = `
        <div class="row">
        <div class="col-12 col-sm-4">
        <div class="infoEmpresa shadow p-3 mb-5 bg-body rounded">
        <h5 class="text-center font-weight-bold">${obj.Empresa.NombreEmpresa}</h5>
        <div class="d-flex justify-content-center mt-3">
        <img id="foto" height="150" class="img-fluid" src="data:image;base64,${obj.Empresa.Perfil.Foto}" alt="">
        </div>
        <p class="text-center mt-3 ">${obj.Ciudad}, ${obj.EstadoRegion}, ${obj.Pais}</p>`;
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
        <div class="infoEmpleo shadow p-3 mb-5 bg-body rounded">
        <div class="d-flex justify-content-center justify-content-md-end">       
        </div>
        <h3 class="font-weight-bold text-center mb-3">${obj.Titulo}</h3>
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
        <h3 class="font-weight-bold mb-3">Descripción del Trabajo</h3>
        <p>${obj.Descripcion}</p>
        </div>
        </div>
        </div>`;
        $("#DetalleEmpleo").append(empleo);
    });
}

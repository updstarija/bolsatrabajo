tabla1 = $('#tInvitacionesFD').DataTable({
    columns: [
        { title: "<p class='text-center m-0 p-0'>#</p>", width: '5%' },
        { title: "Registro", width: '15%' },
        { title: "Invitado", width: '25%' },
        { title: "Curriculum", width: '15%' },
        { title: "Nacionalidad", width: '15%' },
        { title: "Sexo", width: '10%' },
        { title: "Estado", width: '5%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtroinvitacionFD' onchange='FiltrarInvitacionFD()'><option value='Aceptado'>Aceptados</option><option value='Pendiente'>Pendientes</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoinvitacinesFD").show();
$("#contenidoTInvitacionesFD").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        ActualizarFD();
    }, 1000);
});

function ActualizarFD() {
    urlE = "https://localhost:44351/Invitaciones";
    $.getJSON(urlE +'/getInvitacionFD', function (obj) {
        ListarFD(obj);
    });
}

function ListarFD(obj) {
    $("#cargandoinvitacinesFD").show();
    $("#contenidoTInvitacionesFD").hide();

    tabla1.destroy();
    tabla1 = $("#tInvitacionesFD").DataTable({
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
                data: "atrib3", width: '15%'
            },
            {
                data: "atrib4", width: '15%'
            },
            {
                data: "atrib5", width: '15%'
            },
            {
                data: "atrib6", width: '10%'
            },
            {
                data: "atrib7", width: '10%',
                sortable: false
            },
            {
                data: "atrib8", width: '5%',
                sortable: false
            },
        ]
    });
    $("#cargandoinvitacinesFD").hide();
    $("#contenidoTInvitacionesFD").show();
}
function verdetallecurriculum(id) {
    urlE = "https://localhost:44351/Curriculos";
    $.getJSON(urlE +'/getDetalleCurriculo', { Id: id }, function (obj) {
        cargarInfoCurriculum(obj);
    });
}
function imprimirCurriculum(id) {
    urlE = "https://localhost:44351/Curriculos";

    $.getJSON(urlE +'/getDetalleCurriculo', { Id: id }, function (obj) {
        cargarInfoCurriculum(obj);
        Imprimir();
    });
}

function Imprimir() {
    $.print('#seccionCurriculumC');
}

function cargarInfoCurriculum(obj) {
    $("#seccionCurriculumC").html("");
    var content = `
<div class="container" id="ContentCurriculo">
<div id="perfilFoto">
<h1>${obj.DatosPersonalesC.nombreDP + " " + obj.DatosPersonalesC.apellidoDP}</h1>
<p>${obj.InformacionGeneral.Carrera.Nombre}</p>
<div class="divFoto">
<div id="foto" style="background-image: url(data:image;base64,${obj.DatosPersonalesC.imagenDP});">
</div>
</div>
</div>
<div id="presentacion">
<p>${obj.InformacionGeneral.presentacionBiografiaIG}</p>
</div>
<div class="content">
<div id="contacto">
<h2>Contacto</h2>
<p><i class="fas fa-phone-square-alt"></i>${" +591 " + obj.DatosPersonalesC.movilDP}</p>
<p><i class="fas fa-envelope"></i> ${obj.DatosPersonalesC.correoDP}</p>
<p><i class="fas fa-map-marker-alt"></i> ${obj.InformacionGeneral.estadoRegionIG}</p>
</div>`;

    if (obj.ListIdiomaSuperior.length != 0) {
        content += `
<div id="idiomas">
<h2>Idiomas</h2>`;
        for (var i = 0; i < obj.ListIdiomaSuperior.length; i++) {
            content += `
<p id="NombreIdioma">${obj.ListIdiomaSuperior[i].nombreIS}</p>
<p>Lectura: ${obj.ListIdiomaSuperior[i].lecturaIS}, Escritura: ${obj.ListIdiomaSuperior[i].escrituraIS}, Nivel: ${obj.ListIdiomaSuperior[i].nivelOralIS}</p>`;
        }
        content += `</div > `;
    }
    content += `
<div id="Educacion">
<h2>Educación</h2>
<p>${obj.EducacionSecundaria.ColegioInstitucionED}</p>
<p>${obj.EducacionSecundaria.fechaInicioED + " - " + obj.EducacionSecundaria.fechaFinED}</p>
<p>${obj.EducacionSecundaria.paisED}</p>
</div>`;
    if (obj.ListHabilidades.length != 0) {
        content += ` <div id="Habilidades">
<h2> Habilidades</h2>`;
        for (var i = 0; i < obj.ListHabilidades.length; i++) {
            var textAnios = obj.ListHabilidades[i].aniosExperienciaH == "1" ? "año" : "años";
            content += `
<p>${obj.ListHabilidades[i].nombreH} - ${obj.ListHabilidades[i].aniosExperienciaH} ${textAnios}</p>`;
        }
        content += `</div>`;
    }

    content += `</div > `;
    if (obj.ListExperienciaLaboral.length != 0) {
        content += `<div id="Experiencia">
<h2>Experiencia Laboral</h2>`;
        for (var i = 0; i < obj.ListExperienciaLaboral.length; i++) {
            content += `<div id="listExperiencias">
<h5>${obj.ListExperienciaLaboral[i].nombreEmpresaEL + " - " + obj.ListExperienciaLaboral[i].paisEL}</h5>
<h6>${obj.ListExperienciaLaboral[i].cargoEmpresaEL}</h6>
<p>${obj.ListExperienciaLaboral[i].descripcionEL}</p>
<p style="color: #010C3D">${obj.ListExperienciaLaboral[i].fechaInicioEL + " - " + obj.ListExperienciaLaboral[i].fechaFinEL}</p>
</div>`;
        }
        content += `</div>`;
    }
    content += ` <div id="Cursos">`;
    if (obj.ListEducacionSuperior.length != 0) {
        content += ` <div id="tituloCursos">
<h2>Cursos o Seminarios</h2>
</div>`;
        for (var i = 0; i < obj.ListEducacionSuperior.length; i++) {
            content += `
<div id="subcursos">
<p>Universidad/Instituto: </p><span>${obj.ListEducacionSuperior[i].universidadInstitucionES} </span><br />
<p>Nombre: </p><span>${obj.ListEducacionSuperior[i].ccsES}</span><br />
<p>Nivel: </p><span>${obj.ListEducacionSuperior[i].nivelEstudioES}</span><br />
<p>Pais:</p> <span>${obj.ListEducacionSuperior[i].paisES}</span><br />
</div>`;
        }
    }
    content += `</div></div>`;
    $("#seccionCurriculumC").append(content);
}

function FiltrarInvitacionFD() {
    urlE = "https://localhost:44351/Invitaciones";
    var estado = $("#filtroinvitacionFD").val();
    if (estado == "Todos") {
        ActualizarFD();
    }
    else {
        $.getJSON(urlE +'/getByEstadoFD', { cadena: estado }, function (data) {
            ListarFD(data);
        });
    }
}


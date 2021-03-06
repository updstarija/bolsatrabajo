
tabla = $('#tPostulantes').DataTable({
    columns: [
        { title: "#", width: '5%' },
        { title: "Candidato", width: '35%' },
        { title: "Registro", width: '15%' },
        { title: "Nacionalidad", width: '15%' },
        { title: "<i class='fas fa-restroom'></i>", width: '5%' },
        { title: "Estado", width: '10%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosPostulantesS' onchange='FiltrarPostulantes()'><option value='Aceptado'>Aceptados</option><option value='Pendiente'>Pendientes</option><option value='Todos'>Todos</option></select></div>", width: '15%' }
    ],
});

var ListaPostulantes = null;
$("#cargando").show();
$("#contenido").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    $.getJSON(urlOficial + 'Administradores/ListaPostulantesByEmpleo', { IdEmpleo: $("#IdEmpleo").val() }, function (o) {
        Listar(o);
    });
    $("#filtrosPostulantesS").val("Todos");
}
function Listar(obj) {
    $("#cargando").show();
    $("#contenido").hide();
    tabla.destroy();
    tabla = $("#tPostulantes").DataTable({
        data: obj,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },
        columns: [
            {
                data: "atrib1", width: '5%'
            },
            {
                data: "atrib3", width: '35%'
            },
            {
                data: "atrib2", width: '15%',
                sortable: false
            },
            {
                data: "atrib4", width: '15%'
            },
            {
                data: "atrib5", width: '5%'
            },
            {
                data: "atrib6", width: '10%'
            },
            {
                data: "atrib7", width: '15%',
                sortable: false
            }
        ]
    });
    $("#cargando").hide();
    $("#contenido").show();
}

function FiltrarPostulantes() {
    var estado = $("#filtrosPostulantesS").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        var formData = new FormData();
        formData.append("Estado", estado);
        formData.append("IdEmpleo", $("#IdEmpleo").val());
        $.ajax({
            url: urlOficial + 'Administradores/ListaPostulantesByEstado',
            type: 'POST',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                Listar(data);
            }
        });
    }
}

function cargarInfoCurriculum(obj) {
    $("#seccionCurriculumC").html("");
    var content = `
    <div class="container"><h3 class="text-color-blue font-weight-bolder">Curriculum:</h3></div>
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

function cargarInfoPostulante(postulante) {
    $("#seccionPostulanteC").html("");
    var contentPostulante = `
        <div class="container">
        <h3 class="text-color-blue font-weight-bolder">Postulante:</h3>
        <p><span class="text-color-blue"><i class="fas fa-calendar-day"></i> Registro:</span>
            ${postulante.FechaRegistro}</p>
        <p class="text-color-blue"><i class="fas fa-envelope-open-text"></i> Carta:</p>
        <div class="text-justify">
            <p>${postulante.CartaPresentacion}</p>
        </div>
    `;
    if (postulante.PretencionSalarial != "") {
        contentPostulante += `
        <p><span class="text-color-blue"><i class="fas fa-money-bill-wave"></i> Pretención
                Salarial:</span> ${postulante.PretencionSalarial}</p>
        `;
    }
    contentPostulante += "</div>";

    $("#seccionPostulanteC").append(contentPostulante);
    cargarInfoCurriculum(postulante.Curriculum);
}
function VerPostulante(idPostulante) {
    $.getJSON(urlOficial + 'Postulantes/GetById', { IdPostulante: idPostulante }, function (obj) {
        cargarInfoPostulante(obj);
        $("#ModalPostulante").modal("show");
    });
}

function VerCurriculum(idPostulante) {
    $.getJSON(urlOficial + 'Postulantes/GetById', { IdPostulante: idPostulante }, function (obj) {
        cargarInfoPostulante(obj);
        $.print('#ContentCurriculo');
    });
}

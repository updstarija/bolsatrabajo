tabla = $('#tcurriculumscandidato').DataTable({
    columns: [
        { title: "#", width: '5%' },
        { title: "Registro", width: '10%' },
        { title: "Titulo", width: '20%' },
        { title: "Contrato", width: '13%' },
        { title: "Pretencion Salarial", width: '13%' },
        { title: "Mas detalles.", width: '19%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosCurriculums' onchange='FiltrosCurriculumsC()'><option value='Activo'>Activos</option><option value='Inactivo'>Inactivos</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoCurriculums").show();
$("#contenidoTcurriculums").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        var id = $("#idValor").val();
        Actualizar(id);
    }, 1000);
});
function Actualizar(id) {
    urlE = "https://localhost:44351/Administradores";
    $.getJSON(urlE + '/getCurriculums', { Id: id }, function (obj) {
        Listar(obj);
    });
    $("#filtrosCurriculums").val("Todos");
}
function Listar(obj) {
    $("#cargandoCurriculums").show();
    $("#contenidoTcurriculums").hide();
    tabla.destroy();
    tabla = $("#tcurriculumscandidato").DataTable({
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
                data: "atrib3", width: '20%'
            },
            {
                data: "atrib4", width: '13%'
            },
            {
                data: "atrib5", width: '13%'
            },
            {
                data: "atrib6", width: '19%',
                sortable: false,
            },
            {
                data: "atrib7", width: '10%',
                sortable: false
            },
        ]
    });
    $("#cargandoCurriculums").hide();
    $("#contenidoTcurriculums").show();
}

function FiltrosCurriculumsC() {
    urlE = "https://localhost:44351/Administradores";
    var val = $("#filtrosCurriculums").val();
    var id = $("#idValor").val();
    if (val == "Todos") {
        Actualizar(id);
    }
    else {
        $.getJSON(urlE + '/FiltrarCurriculums', { Id: id, Filtro: val }, function (obj) {
            Listar(obj);
        });
    }

}
function verdetallecurriculums(id) {
    urlE = "https://localhost:44351/Curriculos";
    $.getJSON(urlE + '/getDetalleCurriculo', { Id: id }, function (obj) {
        cargarInfoCurriculum(obj);
    });
}
function imprimirCurriculum(id) {
    urlE = "https://localhost:44351/Curriculos";
    $.getJSON(urlE + '/getDetalleCurriculo', { Id: id }, function (obj) {
        cargarInfoCurriculum(obj);
        Imprimir();
    });
}
function Imprimir() {
    $.print('#seccionCurriculumC');
}
function CambioEstadoCurriculumCandidato(Select, id) {
    urlE = "https://localhost:44351/Administradores";
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Modificar Estado',
        theme: 'modern',
        content: 'Se modificara el estado del Curriculum, ¿Esta Seguro?',
        type: 'orange',
        typeAnimated: true,
        animation: 'rotateYR',
        closeAnimation: 'scale',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-orange',
                action: function () {
                    var val = $(`#cambioCurriculums${id}`).val();
                    $.getJSON(urlE + '/cambioEstadoCurriculum', { Id: id, Estado: val }, function (obj) {
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
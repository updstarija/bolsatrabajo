
$("#loadPostulacion").show();
$("#contentPostulacion").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        var IdPostulante = $("#IdPostulante").val();
        VerPostulante(IdPostulante);
    }, 1000);
});

function cargarInfoCurriculum(obj) {
    $("#divCurriculum").html("");
    var content = `
    <div class="container p-4 mb-4"><h3 class="text-color-blue font-weight-bolder">Curriculum:</h3></div>
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
    $("#divCurriculum").append(content);
}
function CargarMensajeEmpresa(Mensaje) {
    $("#divMensajeEmpresa").html("");
    var contentMensaje = `
        <div class="container p-4 mb-4">
        <h3 class="text-color-blue font-weight-bolder">Mensaje de Empresa:</h3>
        <p><span class="text-color-blue"><i class="fas fa-calendar-day"></i> Registro:</span>
            ${Mensaje.FechaRegistro}</p>
        <p class="text-color-blue"><i class="fas fa-envelope-open-text"></i> Texto:</p>
        <div class="text-justify">
            <p>${Mensaje.Texto}</p>
        </div>
    `;
    contentMensaje += "</div>";
    $("#divMensajeEmpresa").append(contentMensaje);
}
function cargarInfoPostulante(postulante) {
    $("#divPostulacion").html("");
    var contentPostulante = `
        <div class="container p-4 mb-4">
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
    $("#divPostulacion").append(contentPostulante);
    if (postulante.IdMensaje != null) {
        CargarMensajeEmpresa(postulante.Mensaje);
    }
    cargarInfoCurriculum(postulante.Curriculum);
    cargarEmpleo(postulante.Empleo);
    $("#loadPostulacion").hide();
    $("#contentPostulacion").show();
}
function cargarEmpleo(obj) {
    $("#DetalleEmpleo").html('');
    var empleo = `
        <div class="row p-4 mb-4">
        <div class="container"><h3 class="text-color-blue font-weight-bolder">Empleo:</h3></div>
        <div class="col-12 col-sm-4 pr-0">
        <div class="infoEmpresa shadow-lg p-3 mb-5 bg-white rounded">
        <h6>Información de:</h6>
        <h5 class="text-center font-weight-bold">${obj.Empresa.NombreEmpresa}</h5>
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
        <p>${obj.Empresa.SitioWeb}</p>
        </div>
        </div>
        <div class="col-12 col-sm-8">
        <div class="infoEmpleo shadow-lg p-3 mb-5 bg-white rounded">
        <div class="d-flex justify-content-center justify-content-md-end">
        </div>
        <h3 class="font-weight-bold text-center">${obj.Titulo}</h3>
        <div class="row mt-3">
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
        <h3 class="mt-3">Descripción del Trabajo</h3>
        <p>${obj.Descripcion}</p>
        </div>
        </div>
        </div>`;
    $("#DetalleEmpleo").append(empleo);
}

function VerPostulante(idPostulante) {
    urlE = "https://localhost:44351/Postulantes";
    $.getJSON(urlE + '/GetById', { IdPostulante: idPostulante }, function (obj) {
        cargarInfoPostulante(obj);
    });
}
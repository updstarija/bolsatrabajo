$(function () {
    CargarDatos();
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function Listar(lista) {
    $("#itemsCurriculosC").html("");
    var c = 0;
    for (var i = 0; i < lista.length; i++) {
        c++;
        var obj = lista[i];
        var content = `
                    <tr>
                        <td>
                            ${c}
                        </td>
                        <td>
                            ${obj.InformacionGeneral.tituloIG}
                        </td>
                        <td>
                            ${obj.InformacionGeneral.FechaRegistro}
                        </td>
                        <td>
                            ${obj.InformacionGeneral.FechaActualizacion}
                        </td>
                        <td>
                            ${obj.InformacionGeneral.Carrera.Nombre}
                        </td>
                        <td class="w-auto">
                            <select class="custom-select" id="Curriculo${obj.DatosPersonalesC.idCurriculum}" name="privacidadIG[]" onchange="ActualizarPrivacidad('Curriculo${obj.DatosPersonalesC.idCurriculum}',${obj.DatosPersonalesC.idCurriculum})">
                                <option value="0">Solamente a las empresas que postulo</option>
                                <option value="1">Publico</option>
                            </select>
                        </td>
                        <td>
                            <div class="d-flex flex-nowrap">
                                <a class='btn tooltip-test px-1' title='EDITAR' class="mr-1" href="${urlOficial}Curriculos/Editar?id=${obj.DatosPersonalesC.idCurriculum}"><i class="fas fa-edit ico-gray ico-animation fa-lg"></i></a>
                               <button type="button" class='btn tooltip-test px-1' title='ELIMINAR' onclick=EliminarCurriculum('${obj.DatosPersonalesC.idCurriculum}')><i class="fas fa-trash ico-gray ico-animation fa-lg"></i></button>
                                <button  type='button'class='btn tooltip-test px-1' title='VER' data-toggle='modal' data-target='#ModalCurriculo' onclick='VerCurriculo(" ${obj.DatosPersonalesC.idCurriculum}")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button>
                            </div>
                        </td>
                    </tr>
        `;
        $("#itemsCurriculosC").append(content);
        $("#Curriculo" + obj.DatosPersonalesC.idCurriculum + "").val(obj.InformacionGeneral.privacidadIG);
    }
}
//


function CargarDatos() {
    $.getJSON(urlOficial + 'Curriculos/getCurriculos', function (data) {
        if (data.TotalRegistro != 0) {
            Listar(data.curriculums);
        }
    });
}
function ActualizarPrivacidad(idSelect, idCurriculum) {
    var formData = new FormData();
    formData.append("privacidad", $("#" + idSelect).val());
    formData.append("IdCurriculum", idCurriculum);
    $.ajax({
        url: urlOficial + 'Curriculos/EditarPrivacidad',
        type: 'POST',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.Tipo == 1) {
                Toast("success", data.Msj);
            }
        }
    });
}

function EliminarCurriculum(id) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Eliminar Curriculum',
        theme: 'modern',
        content: 'Se eliminara el curriculum permanentemente, ¿Esta Seguro?',
        type: 'red',
        typeAnimated: true,
        animation: 'rotateYR',
        closeAnimation: 'scale',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-red',
                action: function () {
                    $.getJSON(urlOficial + 'Curriculos/EliminarCurriculo', { Id: id }, function (data) {
                        if (data.Tipo == 1) {
                            Toast("success", data.Msj);
                            actualizar();
                        }
                    });
                }
            },
            close: {
                text: 'Cancelar',
                action: function () {
                }
            }
        }
    });
}
function actualizar() { location.reload(true); }

function cargarInfoCurriculum(obj) {
    $("#seccionCurriculoC").html("");
    var content = `<div class="container pt-2" style="position:relative;"><h3 class="text-color-blue font-weight-bolder">Curriculum:</h3><button type='button' class='btn btn-float-right-Blue tooltip-test' title='IMPRIMIR' onclick='ImprimirCurriculum()'><i class='fas fa-print ico-animation fa-lg'></i></i></button></div>
    <hr/>
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
    $("#seccionCurriculoC").append(content);
}

function VerCurriculo(IdCurriculo) {
    $.getJSON(urlOficial + 'Curriculos/getDetalleCurriculo', { Id: IdCurriculo }, function (obj) {
        cargarInfoCurriculum(obj);
        $("#ModalCurriculo").modal("show");
    });
}

function ImprimirCurriculum() {
    $("#ModalCurriculo").modal('hide');
    $.print('#ContentCurriculo');
}
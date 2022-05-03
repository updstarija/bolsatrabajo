tabla = $('#tPostulantes').DataTable({
    columns: [
        { title: "<p class='text-center m-0 p-0'>#</p>", width: '5%' },
        { title: "Registro", width: '15%' },
        { title: "Candidato", width: '35%' },
        { title: "Nacionalidad", width: '15%' },
        { title: "Sexo", width: '10%' },
        { title: "Aceptado", width: '5%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosPostulantesS' onchange='FiltrarPostulantes()'><option value='Aceptado'>Aceptados</option><option value='Pendiente'>Pendientes</option><option value='Todos'>Todos</option></select></div>", width: '15%' }
    ],
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

var ListaPostulantes = null;
$("#cargando").show();
$("#contenido").hide();
$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
    estadoEmpleo();
});

function estadoEmpleo() {
    urlE = "https://localhost:44351/Empleos";
    var IdEmpleo = $("#IdEmpleo").val();
    $.getJSON(urlE + '/getEmpleo', { Id: IdEmpleo }, function (data) {
        var obj = data;
        if (obj != null) {
            if (obj.Estado == "Inactivo") {
                $("#divBtnConcluirEmpleo").addClass('d-none');
                $("#btnConcluirEmpleo").addClass('d-none');
            }
            else {
                $("#divBtnConcluirEmpleo").removeClass('d-none');
                $("#btnConcluirEmpleo").removeClass('d-none');
            }
        }
    });
}

function Actualizar() {
    urlE = "https://localhost:44351/Postulantes";
    $.getJSON(urlE + '/GetList', { IdEmpleo: $("#IdEmpleo").val() }, function (o) {
        Listar(o);
    });
    $("#filtrosPostulantesS").val("Todos");
}
function Listar(obj) {
    $("#cargando").show();
    $("#contenido").hide();
    var list = new Array();
    for (var i = 0; i < obj.length; i++) {
        var o = {
            id: obj[i][0],
            fechaRegistro: obj[i][1],
            nombre: obj[i][2],
            nacionalidad: obj[i][3],
            sexo: obj[i][4],
            Aceptado: obj[i][6],
            Actions: obj[i][5],
        };
        list.push(o);
    }
    tabla.destroy();
    tabla = $("#tPostulantes").DataTable({
        data: list,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },
        columns: [
            {
                data: "id", width: '5%'
            },
            {
                data: "fechaRegistro", width: '15%'
            },
            {
                data: "nombre", width: '35%'
            },
            {
                data: "nacionalidad", width: '15%'
            },
            {
                data: "sexo", width: '10%'
            },
            {
                data: "Aceptado", width: '5%',
                sortable: false
            },
            {
                data: "Actions", width: '15%',
                sortable: false
            }
        ]
    });
    $("#cargando").hide();
    $("#contenido").show();
}

function ActualizarEstado(e, idPostulante) {
    urlE = "https://localhost:44351/Postulantes";
    var estado = e.checked == true ? "Aceptado" : "Pendiente";
    var formData = new FormData();
    formData.append("Estado", estado);
    formData.append("IdPostulante", idPostulante);
    $.ajax({
        url: urlE + '/ActualizarEstado',
        type: 'POST',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.Tipo == 1) {
                Actualizar();
                Toast("success", data.Msj);
            }
        }
    });
}
function FiltrarPostulantes() {
    urlE = "https://localhost:44351/Postulantes";
    var estado = $("#filtrosPostulantesS").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        var formData = new FormData();
        formData.append("Estado", estado);
        formData.append("IdEmpleo", $("#IdEmpleo").val());
        $.ajax({
            url: urlE + '/FiltrarPostulantes',
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
    urlE = "https://localhost:44351/Postulantes";
    $.getJSON(urlE + '/GetById', { IdPostulante: idPostulante }, function (obj) {
        cargarInfoPostulante(obj);
        $("#ModalPostulante").modal("show");
    });
}

function VerCurriculum(idPostulante) {
    urlE = "https://localhost:44351/Postulantes";
    $.getJSON(urlE + '/GetById', { IdPostulante: idPostulante }, function (obj) {
        cargarInfoPostulante(obj);
        $.print('#ContentCurriculo');
    });
}

function ConcluirEmpleoComfirm() {
    urlE = "https://localhost:44351/Postulantes";
    $.getJSON(urlE + '/getListByEstado', { IdEmpleo: $("#IdEmpleo").val() }, function (o) {
        if (o.Postulantes.length != 0) {
            $("#ModalConcluirPostulacion").modal("show");
        }
        else {
            urla = "https://localhost:44351/Empleos";
            $.confirm({
                icon: 'fas fa-exclamation-triangle',
                title: 'Concluir Empleo',
                theme: 'modern',
                content: 'El empleo ya no estara disponible, ¿Esta Seguro?',
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
                            formData.append("Estado", "Inactivo");
                            formData.append("EnviarCorreo", "No");
                            formData.append("IdEmpleo", $("#IdEmpleo").val());
                            $.ajax({
                                url: urla + '/ActualizarEstado',
                                type: 'POST',
                                data: formData,
                                dataType: 'json',
                                contentType: false,
                                processData: false,
                                success: function (data) {
                                    if (data.Tipo == 1) {
                                        Toast("success", data.Msj);
                                        setInterval(() => {
                                            urla = "https://localhost:44351/Empleos";
                                            window.location.href = urla + '/Index';
                                        }, 3000);
                                    }
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
    });
}
function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validationEC');
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}
function ConcluirEmpleo() {
    if (VerificarFormulario() == true) {
        var formData = new FormData();
        formData.append("Estado", "Inactivo");
        formData.append("EnviarCorreo", "Si");
        formData.append("IdEmpleo", $("#IdEmpleo").val());
        formData.append("Asunto", $("#AsuntoM").val());
        formData.append("Mensaje", $("#MensajeM").val());
        urlE = "https://localhost:44351/Empleos";
        $.ajax({
            url: urlE + '/ActualizarEstado',
            type: 'POST',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Tipo == 1) {
                    $("#ModalConcluirPostulacion").modal("hide");
                    Toast("success", data.Msj);
                    setTimeout(function () {
                        window.location.href = url + '/Empleos/Index';
                    }, 3000);
                }
            }
        });
    }
}
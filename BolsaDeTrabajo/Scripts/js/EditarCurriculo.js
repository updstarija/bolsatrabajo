//Validacion de inputs
$(function () {
    $('#movilDP').validacion('0123456789');
    $('#telefonoDP').validacion(' -0123456789');
    $('#direccionDP').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú(")-/.0123456789');
});


$(function () {
    CargarDatos();
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];
var DatosPersonales = new Array();
var listExperienciaLaboral = new Array();
var listHabilidades = new Array();
var listInformacionAdicional = new Array();
var EducacionSecundaria = new Array();
var EducacionSuperior = new Array();
var IdiomaSuperior = new Array();
var InformacionGeneral = new Array();
var FotoActivaDP = new Array();
var statusForms = true;


const MAXIMO_TAMANIO_BYTES = 1000000;

document.getElementById("imagenDP").onchange = function (e) {
    let reader = new FileReader();
    var file = e.target.files[0];
    var size = e.target.files[0].size;
    if (size <= MAXIMO_TAMANIO_BYTES) {
        reader.readAsDataURL(file);
        reader.onload = function () {
            var img = document.getElementById('fotoDP');
            img.src = reader.result;
        }
        var reader2 = new FileReader();
        var fileByteArray = [];
        reader2.readAsArrayBuffer(file);
        reader2.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                var arrayBuffer = evt.target.result,
                    array = new Uint8Array(arrayBuffer);
                for (var i = 0; i < array.length; i++) {
                    fileByteArray.push(array[i]);
                }
            }
        }
        FotoActivaDP = fileByteArray;
    }
    else {
        $("#imagenDP").val(null);
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
function ActualizarSelect(array, param, name) {
    for (var i = 0; i < array.length; i++) {
        document.getElementsByName(name)[i].value = array[i][param];
    }
}
function ActualizarSelects(array, param, name) {
    if (param.length == name.length) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < param.length; j++) {
                document.getElementsByName(name[j])[i].value = array[i][param[j]];
            }
        }
    }
}
function ActualizarCheckboxs(array, param, name) {
    for (var i = 0; i < array.length; i++) {
        document.getElementsByName(name)[i].checked = array[i][param];
        var val = array[i][param];
    }
}
function CargarDatos() {
    $.getJSON(urlOficial + 'Curriculos/getCurriculum', { Id: $("#idCurriculum").val() }, function (data) {
        var obj = data;
        if (obj != null) {
            $("#tipoDocumentoDP").val(obj.DatosPersonales.TipoDeDocumento);
            $("#sexoDP").val(obj.DatosPersonales.Sexo);
            $("#estadoCivilDP").val(obj.DatosPersonales.EstadoCivil);
            ActualizarSelect(obj.ExperienciaLaboral, "Pais", "paisEL[]");
            ActualizarCheckboxs(obj.ExperienciaLaboral, "TrabajoActual", "ActualTrabajo[]");
            ActualizarSelect(obj.Habilidad, "AniosExperiencia", "aniosExperienciaH[]");
            $("#estadoRegionIG").val(obj.EstadoRegion);
            ActualizarSelects(obj.Educacion.Idioma, array = ["Escritura", "Nivel", "Lectura"], array2 = ["escrituraIS[]", "nivelOralIS[]", "lecturaIS[]"]);
            ActualizarCheckboxs(obj.Educacion.Lista, "EstudiandoActualmente", "estudioActualES[]");
            $("#contratoIG").val(obj.Contrato);
            $("#privacidadIG").val(obj.Privacidad);
            $("#IdCarrera").val(obj.IdCarrera);
        }
    });
}

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDisponibles');
    p[0].innerText = tot + " / " + maxCaracteres;
}

function verificarCorreo(valor) {
    var correo = $("#correoDP").val();
    var expreRegular = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    var esValido = expreRegular.test(correo);
    if (esValido == false && correo.length > 0) {
        $("#estadoCorreo").removeAttr("hidden", "hidden");
        $("#correoDP").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "su correo no es valido");
        }
    } else {
        $("#estadoCorreo").attr("hidden", "hidden");
        $("#correoDP").removeClass("border border-danger");
    }
    return esValido;
}

function verificarCelular(valor) {
    var celu = $("#movilDP").val();
    if (celu.length > 0 && celu.length < 8) {
        $("#estadoNumero").removeAttr("hidden", "hidden");
        $("#movilDP").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "Su número de celular no es valido");
        }
        return false;
    } else {
        $("#estadoNumero").attr("hidden", "hidden");
        $("#movilDP").removeClass("border border-danger");
        return true;
    }
}


function VerificarFormulario(formClass) {
    var validacion = true;
    var forms = document.getElementsByClassName(formClass);
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}

function GetFormDates(idForm) {
    var datosForm = new FormData(document.getElementById(idForm));
    var data = JSON.stringify(Object.fromEntries(datosForm));
    return JSON.parse(data);
}
function LimpiarCampos(idForm) {
    var datosForm = document.getElementById(idForm);
    for (var valor of datosForm.children) {
        var inputs = valor.querySelectorAll('input, textarea, select');
        for (var i = 0; i < inputs.length; i++) {
            if (i != 0) {
                inputs[i].value = "";
            }
            else {
                inputs[i].value = -1;
            }
        }
    }
}
function MostrarForm(idForm, classForm, div, btn0, btn1, spnEliminar) {
    $("#" + idForm + "").removeClass('d-none');
    $("#" + btn1 + "").removeClass('d-none');
    $("#" + spnEliminar + "").removeClass('d-none');
    $("#" + div + "").addClass('d-none');
    $("#" + btn0 + "").addClass('d-none');
    LimpiarCampos(idForm);
}

function OcultarForm(idForm, classForm, div, btn0, btn1, spnEliminar) {
    var datosForm = document.getElementById(idForm);
    for (var valor of datosForm.children) {
        var inputs = valor.querySelectorAll('input, textarea, select');
        var obj = {
            id: inputs[0].id,
            value: inputs[0].value
        };
        if (obj.value != -1) {
            $.confirm({
                icon: 'fas fa-exclamation-triangle',
                title: 'Eliminar Registro',
                theme: 'modern',
                content: '¿Esta seguro, se eliminara de forma permanente?',
                type: 'red',
                typeAnimated: true,
                animation: 'rotateYR',
                closeAnimation: 'scale',
                buttons: {
                    confirm: {
                        text: 'Confirmar',
                        btnClass: 'btn-red',
                        action: function () {
                            EliminarRegistro(obj);
                            $("#" + idForm + "").removeClass('was-validated');
                            $("#" + idForm + "").addClass('d-none');
                            $("#" + btn1 + "").addClass('d-none');
                            $("#" + spnEliminar + "").addClass('d-none');
                            $("#" + btn0 + "").removeClass('d-none');
                            $("#" + div + "").removeClass('d-none');
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
        else {
            $("#" + idForm + "").removeClass('was-validated');
            $("#" + idForm + "").addClass('d-none');
            $("#" + btn1 + "").addClass('d-none');
            $("#" + spnEliminar + "").addClass('d-none');
            $("#" + btn0 + "").removeClass('d-none');
            $("#" + div + "").removeClass('d-none');
        }
    }
}
//AGREGAR O ELIMINAR CAMPOS
function AgregarCampos(idForm, nombreClon, classForm, spanOcultarForm) {
    if (VerificarFormulario(classForm) == true) {
        var contenido = document.getElementById(idForm);
        var clonado = document.querySelector('.' + nombreClon);
        var clon = clonado.cloneNode(true);
        var inputs = clon.querySelectorAll('input, textarea, select');
        for (var i = 0; i < inputs.length; i++) {
            if (i != 0) {
                inputs[i].value = "";
            }
            else {
                inputs[i].value = -1;
            }
        }
        contenido.appendChild(clon).classList.remove(nombreClon);
        var remover_ocultar = clon.querySelectorAll('#spnEliminar');
        remover_ocultar[0].classList.remove('ocultar');
        $("#" + spanOcultarForm + "").addClass('d-none');
    }
    else {
        console.log("Verifique los campos");
    }
}

function EliminarRegistro(obj) {
    $.post(urlOficial + "Curriculos/EliminarRegistroDeCurriculum", obj, function (status) {
        if (code == "200") {

        }
        else {
            console.log("Error al borrar");
        }
    });
}

function EliminarCampos(e, FormName, spanEliminar) {
    var form = $("#" + FormName);
    var contenedor = e[0].parentNode;
    var state = false;
    while (state == false) {
        if (contenedor.id == 'Clon') {
            state = true;
        }
        else {
            contenedor = contenedor.parentNode;
        }
    }
    var inputs = contenedor.querySelectorAll('input');
    var obj = {
        id: inputs[0].id,
        value: inputs[0].value
    };
    if (obj.value != -1) {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Eliminar Registro',
            theme: 'modern',
            content: '¿Esta seguro, se eliminara de la base de datos?',
            type: 'red',
            typeAnimated: true,
            animation: 'rotateYR',
            closeAnimation: 'scale',
            buttons: {
                confirm: {
                    text: 'Confirmar',
                    btnClass: 'btn-red',
                    action: function () {
                        EliminarRegistro(obj);
                        contenedor.parentNode.removeChild(contenedor);
                        if (form[0].children.length == 1) {
                            $("#" + spanEliminar + "").removeClass('d-none');
                        }
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
    else {
        contenedor.parentNode.removeChild(contenedor);
        if (form[0].children.length == 1) {
            $("#" + spanEliminar + "").removeClass('d-none');
        }
    }

}
function statusForm(FormName) {
    var status = true;
    var form = $("#" + FormName);
    for (var i = 0; i < form[0].classList.length; i++) {
        if (form[0].classList[i] == 'd-none') {
            status = false;
        }
    }
    return status;
}
function saveDatesForm(idForm, classForm) {
    var list = new Array();
    if (VerificarFormulario(classForm) == true && statusForms == true) {
        var datosForm = document.getElementById(idForm);
        var j = 0;
        var k = 0;
        for (var valor of datosForm.children) {
            var inputs = valor.querySelectorAll('input, textarea, select');
            var obj = new Object();
            for (var i = 0; i < inputs.length; i++) {
                obj[inputs[i].id] = inputs[i].value;
                if (inputs[i].id == "ActualTrabajo") {
                    var val = document.getElementsByName('ActualTrabajo[]')[j].checked;
                    obj[inputs[i].id] = document.getElementsByName('ActualTrabajo[]')[j].checked ? true : false;
                    j++;
                }
                if (inputs[i].id == "estudioActualES") {
                    obj[inputs[i].id] = document.getElementsByName('estudioActualES[]')[k].checked ? true : false;
                    k++;
                }
            }
            list.push(obj);
        }
    }
    else { statusForms = false };
    return list;
}
function SaveListForms() {
    listExperienciaLaboral = statusForm('formEL') == true ? saveDatesForm('formEL', 'needs-validation-formEL') : null;
    listHabilidades = statusForm('formH') == true ? saveDatesForm('formH', 'needs-validation-formH') : null;
    listInformacionAdicional = statusForm('formIA') == true ? saveDatesForm('formIA', 'needs-validation-formIA') : null;
    EducacionSuperior = statusForm('formES') == true ? saveDatesForm('formES', 'needs-validation-formES') : null;
    IdiomaSuperior = statusForm('formIS') == true ? saveDatesForm('formIS', 'needs-validation-formIS') : null;

    DatosPersonales = saveDatesForm('formDP', 'needs-validation-formDP');
    EducacionSecundaria = saveDatesForm('formED', 'needs-validation-formED');
    InformacionGeneral = saveDatesForm('formIG', 'needs-validation-formIG');
    if (statusForms == true) {
        DatosPersonales[0].imagenDP = FotoActivaDP.length != 0 ? JSON.stringify(FotoActivaDP) : null;
    }
}

$("#formDP").on('submit', function (e) {
    e.preventDefault();
    SaveListForms();
    if (statusForms == true) {
        if (verificarCelular(1) == true && verificarCorreo(1) == true) {
            var DataForms = {
                "DatosPersonalesC": DatosPersonales[0],
                "ListExperienciaLaboral": listExperienciaLaboral,
                "ListHabilidades": listHabilidades,
                "ListInformacionAdicional": listInformacionAdicional,
                "EducacionSecundaria": EducacionSecundaria[0],
                "ListEducacionSuperior": EducacionSuperior,
                "ListIdiomaSuperior": IdiomaSuperior,
                "InformacionGeneral": InformacionGeneral[0]
            }

            $.ajax({
                url: urlOficial + 'Curriculos/Editar',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(DataForms),
                contentType: 'application/json',
                success: function (data) {
                    if (data.Tipo == 1) {
                        Toast("success", data.Msj);
                        setTimeout(function () {
                            window.location.href = urlOficial + 'Curriculos/Index';
                        }, 1000);
                    }
                }
            });
        }
    }
    else {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Campos vacios',
            theme: 'modern',
            content: 'Por favor verifique los campos necesarios.',
            type: 'red',
            typeAnimated: true,
            animation: 'rotateYR',
            closeAnimation: 'scale',
            buttons: {
                close: {
                    text: 'Ok',
                    action: function () {
                    }
                }
            }
        });
        statusForms = true;
    }
});

function subMenu1() {
    $("#dp-tab").addClass('pintarSubMenu');
    $("#el-tab").removeClass('pintarSubMenu');
    $("#ed-tab").removeClass('pintarSubMenu');
    $("#ig-tab").removeClass('pintarSubMenu');
}

function subMenu2() {
    $("#dp-tab").removeClass('pintarSubMenu');
    $("#el-tab").addClass('pintarSubMenu');
    $("#ed-tab").removeClass('pintarSubMenu');
    $("#ig-tab").removeClass('pintarSubMenu');
}

function subMenu3() {
    $("#dp-tab").removeClass('pintarSubMenu');
    $("#el-tab").removeClass('pintarSubMenu');
    $("#ed-tab").addClass('pintarSubMenu');
    $("#ig-tab").removeClass('pintarSubMenu');
}

function subMenu4() {
    $("#dp-tab").removeClass('pintarSubMenu');
    $("#el-tab").removeClass('pintarSubMenu');
    $("#ed-tab").removeClass('pintarSubMenu');
    $("#ig-tab").addClass('pintarSubMenu');
}

﻿tabla = $('#tInvitacionesIndex').DataTable({
    columns: [
        { title: "#", width: '5%' },
        { title: "Registro", width: '10%' },
        { title: "Actualización", width: '10%' },
        { title: "Titulo", width: '25%' },
        { title: "Contrato", width: '15%' },
        { title: "Correo", width: '10%' },
        { title: "Estado", width: '10%' },
        { title: "Invitados", width: '5%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosInvitacionesC' onchange='FiltrarEmpleos()'><option value='Activo'>Activos</option><option value='Inactivo'>Inactivos</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoinvitacines").show();
$("#contenidoTInvitaciones").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});

function Actualizar() {
    urlE = "https://localhost:44351/Empleos";

    $.getJSON(urlE +'/getTableEmpleos', function (obj) {
        Listar(obj);
    });
    $("#filtrosInvitacionesC").val("Todos");
}
function Listar(obj) {
    $("#cargandoinvitacines").show();
    $("#contenidoTInvitaciones").hide();

    tabla.destroy();
    tabla = $("#tInvitacionesIndex").DataTable({
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
                data: "atrib3", width: '10%'
            },
            {
                data: "atrib4", width: '25%'
            },
            {
                data: "atrib5", width: '15%'
            },
            {
                data: "atrib6", width: '10%'
            },
            {
                data: "atrib7", width: '10%'
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
    $("#cargandoinvitacines").hide();
    $("#contenidoTInvitaciones").show();
}

function FiltrarEmpleos() {
    urlE = "https://localhost:44351/Empleos";

    var estado = $("#filtrosInvitacionesC").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        $.getJSON(urlE +'/getByEstadoInvitado', { Estado: estado }, function (data) {
            Listar(data);
        });
    }
}


function CargarDatosEmpleo(IdEmpleo) {
    $("#ModalRegistrarEmpleo").modal('show');
    urlE = "https://localhost:44351/Empleos";
    $.getJSON(urlE + '/getEmpleo', { Id: IdEmpleo }, function (obj) {
        $("#formRegistrarEmpleo").removeClass('was-validated');
        $("#Titulo").val(obj.Titulo);
        $("#Id").val(obj.Id);
        $("#IdEmpresa").val(obj.IdEmpresa);

        var listIdCat = new Array();
        for (var i = 0; i < obj.Categorias.length; i++) {
            listIdCat.push(obj.Categorias[i].Id);
        }
        $("#Categoria").val(listIdCat);

        $("#Contrato").val(obj.Contrato);
        $("#RangoSueldos").val(obj.RangoSueldos);
        $("#ExperienciaMinima").val(obj.ExperienciaMinima);
        $("#Descripcion").val(obj.Descripcion);
        $("#Periodo").val(obj.Periodo);
        $("#Pais").val(obj.Pais);
        $("#EstadoRegion").val(obj.EstadoRegion);
        $("#Ciudad").val(obj.Ciudad);
        $("#CorreoEnvioPostulaciones").val(obj.CorreoEnvioPostulaciones);
        $("#FechaExpiracion").val(obj.FechaExpiracionHora);
        document.getElementById("Teletrabajo").checked = obj.Teletrabajo == "Si" ? true : false;
    });
}

function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}

function saveDatesForm(idForm) {
    var list = new Array();
    var datosForm = document.getElementById(idForm);
    var j = 0;
    var obj = new Object();
    for (var valor of datosForm.children) {
        var inputs = valor.querySelectorAll('input, textarea, select');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].id == "Categoria") {
                var listCategorias = new Array();
                var listC = $("#" + inputs[i].id + "").val();
                for (var j = 0; j < listC.length; j++) {
                    var objC = new Object();
                    objC["Id"] = listC[j];
                    listCategorias.push(objC);
                }
                obj["CategoriaBDT"] = listCategorias;
            }
            else {
                if (inputs[i].id == "Teletrabajo") {
                    obj[inputs[i].id] = inputs[i].checked ? true : false;
                }
                else {
                    obj[inputs[i].id] = inputs[i].value;
                }
            }
        }
    }
    list.push(obj);
    return list
}

$("#formRegistrarEmpleo").on('submit', function (e) {
    urlE = "https://localhost:44351/Empleos";
    var Empleo = saveDatesForm('formRegistrarEmpleo')[0];
    e.preventDefault();
    var obj = new FormData(this);
    if (VerificarFormulario() == true) {
        $.ajax({
            url: urlE + '/Guardar',
            type: 'POST',
            data: JSON.stringify(Empleo),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.Tipo == 1) {
                    Toast("success", data.Msj);
                    $("#ModalRegistrarEmpleo").modal('hide');
                    Actualizar();
                    setTimeout(function () {
                    }, 2000);
                }
            }
        });
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
});
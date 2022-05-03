tabla = $('#tEmpleosIndex').DataTable({
    columns: [
        { title: "Registro", width: '10%' },
        { title: "Expiración", width: '10%' },
        { title: "Titulo", width: '25%' },
        { title: "Contrato", width: '15%' },
        { title: "Correo", width: '10%' },
        { title: "Estado", width: '10%' },
        { title: "Postulantes", width: '5%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosEmpleosC' onchange='FiltrarEmpleos()'><option value='Activo'>Activos</option><option value='Inactivo'>Inactivos</option><option value='Vencido'>Vencidos</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoEmpleos").show();
$("#contenidoTEmpleos").hide();
$(document).ready(function () {
    setTimeout(function () {
        Actualizar();
    }, 1000);
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function Actualizar() {
    urlE = "https://localhost:44351/Empleos";
    $.getJSON(urlE + '/getAll', function (obj) {
        Listar(obj);
    });
    $("#filtrosEmpleosC").val("Todos");
}
function Listar(obj) {
    $("#cargandoEmpleos").show();
    $("#contenidoTEmpleos").hide();

    tabla.destroy();
    tabla = $("#tEmpleosIndex").DataTable({
        data: obj,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },

        columns: [
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
    $("#cargandoEmpleos").hide();
    $("#contenidoTEmpleos").show();
}

function FiltrarEmpleos() {
    var estado = $("#filtrosEmpleosC").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        urlE = "https://localhost:44351/Empleos";
        $.getJSON(urlE + '/getByEstado', { Estado: estado }, function (data) {
            Listar(data);
        });
    }
}

function cargarInfoEmpleo(obj) {
    $("#seccionEmpleo").html("");
    var contentEmpleo = `
    <div>
        <div class="shadow p-3 mb-5 bg-white rounded">
            <h3 class="font-weight-bold text-center">${obj.Titulo}</h3>
            <div class="row mt-4">
            <div class="col-12 col-sm-6">
            <input type="hidden" name="IdDE" id="IdDE" value="${obj.Id}" />
            <p><span class='font-weight-bold'>Id Empleo:</span> ${obj.Id}</p>`;
    var cad = "";
    for (var i = 0; i < obj.Categorias.length; i++) {
        cad += obj.Categorias[i].Nombre + " ";
    }
    contentEmpleo += `<p><span class='font-weight-bold'>Categorias:</span> ${cad}</p>
            <p><span class='font-weight-bold'>Sueldo:</span> ${obj.RangoSueldos}</p>
            <p><span class='font-weight-bold'>Publicado:</span> ${obj.FechaRegistro}</p>
            </div>
            <div class="col-12 col-sm-6">
            <p><span class='font-weight-bold'>Ubicacion:</span> ${obj.Ciudad}, ${obj.EstadoRegion}, ${obj.Pais}</p>
            <p><span class='font-weight-bold'>Contrato:</span> ${obj.Contrato}</p>
            <p><span class='font-weight-bold'>Expiración:</span> ${obj.FechaExpiracion}</p>
            <p><span class='font-weight-bold'>Teletrabajo:</span> ${obj.Teletrabajo}</p>
            </div>
            </div>
        </div>

        <div class="shadow p-3 mb-5 bg-white rounded">
            <h3 class="font-weight-bold">Descripción del Trabajo</h3>
            <p class="mt-4">${obj.Descripcion}</p>
            </div>
        </div>
    `;
    $("#seccionEmpleo").append(contentEmpleo);
}
function VerEmpleo(IdEmpleo) {
    urlE = "https://localhost:44351/Empleos";
    $.getJSON(urlE + '/getEmpleo', { Id: IdEmpleo }, function (obj) {
        cargarInfoEmpleo(obj);
        $("#ModalEmpleo").modal("show");
    });
}

function EliminarEmpleo(IdEmpleo) {
    urlE = "https://localhost:44351/Empleos";
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Eliminar Empleo',
        theme: 'modern',
        content: 'Se eliminara el empleo permanentemente, ¿Esta Seguro?',
        type: 'red',
        typeAnimated: true,
        animation: 'rotateYR',
        closeAnimation: 'scale',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-red',
                action: function () {
                    $.getJSON(urlE + '/EliminarEmpleo', { Id: IdEmpleo }, function (data) {
                        if (data.Tipo == 1) {
                            Toast("success", data.Msj);
                            setTimeout(function () {
                                Actualizar();
                            }, 3000);
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
                    setTimeout(function () {
                        window.location.href = urlE + '/Index';
                    }, 3000);
                }
            }
        });
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
});


function CargarDatosEmpleo(IdEmpleo) {
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

function Limpiar() {
    $("#ModalRegistrarEmpleo").modal('show');
    $('#formRegistrarEmpleo').trigger("reset");
    $("#formRegistrarEmpleo").removeClass('was-validated');
}
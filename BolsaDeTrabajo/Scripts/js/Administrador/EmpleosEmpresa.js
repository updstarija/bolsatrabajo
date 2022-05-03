tabla = $('#tEmpleosIndex').DataTable({
    columns: [
        { title: "Registro", width: '10%' },
        { title: "Actualización", width: '10%' },
        { title: "Titulo", width: '20%' },
        { title: "Contrato", width: '10%' },
        { title: "Correo", width: '10%' },
        { title: "<i class='fas fa-users'></i>", width: '5%' },
        { title: "Expiración", width: '10%' },
        { title: "Estado", width: '10%' },
        { title: "<div class='d-flex flex-nowrap'><select class='custom-select' id='filtrosEmpleosC' onchange='FiltrarEmpleos()'><option value='Activo'>Activos</option><option value='Inactivo'>Inactivos</option><option value='Vencido'>Vencidos</option><option value='Todos'>Todos</option></select></div>", width: '10%' }
    ],
});
$("#cargandoEmpleos").show();
$("#contenidoTEmpleos").hide();
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

$(document).ready(function () {
    Actualizar();
});

function Actualizar() {
    urlE = "https://localhost:44351/Administradores";
    $.getJSON(urlE + '/getTableEmpleosByEmpresa', { Id: $("#IdEmpresaEstatic").val() }, function (obj) {
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
                data: "atrib2", width: '10%',
                sortable: false
            },
            {
                data: "atrib3", width: '10%',
                sortable: false
            },
            {
                data: "atrib4", width: '20%'
            },
            {
                data: "atrib5", width: '10%'
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
            {
                data: "atrib9", width: '10%',
                sortable: false
            },
            {
                data: "atrib10", width: '10%',
                sortable: false
            }
        ]
    });
    setTimeout(function () {
        $("#cargandoEmpleos").hide();
        $("#contenidoTEmpleos").show();
    }, 300);
}

function FiltrarEmpleos() {
    urlE = "https://localhost:44351/Administradores";
    var estado = $("#filtrosEmpleosC").val();
    if (estado == "Todos") {
        Actualizar();
    }
    else {
        $.getJSON(urlE + '/getTableEmpleosByEstado', { Estado: estado, Id: $("#IdEmpresaEstatic").val() }, function (data) {
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

function Limpiar() {
    $("#ModalRegistrarEmpleo").modal('show');
    $('#formRegistrarEmpleo').trigger("reset");
    $("#formRegistrarEmpleo").removeClass('was-validated');
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
                else if (inputs[i].id == "IdEmpresa") {
                    obj[inputs[i].id] = $("#IdEmpresaEstatic").val();
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

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispDesc');
    p[0].innerText = tot + " / " + maxCaracteres;
}

$("#formRegistrarEmpleo").on('submit', function (e) {
    urlE = "https://localhost:44351/Empleos";
    e.preventDefault();
    var Empleo = saveDatesForm('formRegistrarEmpleo')[0];
    var obj = new FormData(this);
    if (VerificarFormulario() == true) {
        $.ajax({
            url: urlE + '/Guardar',
            type: 'POST',
            data: JSON.stringify(Empleo),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
                if (data) {
                    $("#ModalRegistrarEmpleo").modal('hide');
                    Toast("success", data.Msj);
                    Actualizar();
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

function ActualizarEstadoEmpleo(Select, IdEmp) {
    urlE = "https://localhost:44351/Administradores";
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Modificar Estado',
        theme: 'modern',
        content: 'Se modificara el estado del empleo, ¿Esta Seguro?',
        type: 'orange',
        typeAnimated: true,
        animation: 'rotateYR',
        closeAnimation: 'scale',
        buttons: {
            confirm: {
                text: 'Confirmar',
                btnClass: 'btn-orange',
                action: function () {
                    var idSelect = Select.id;
                    $.getJSON(urlE + '/ActualizarEstadoEmpleoByEmpresa', { IdEmpleo: IdEmp, Estado: $("#" + idSelect).val() }, function (obj) {
                        if (data.Tipo == 1) {
                            Toast("success", data.Msj);
                        }
                    });
                }
            },
            close: {
                text: 'Cancelar',
                action: function () {
                    Actualizar();
                }
            }
        }
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

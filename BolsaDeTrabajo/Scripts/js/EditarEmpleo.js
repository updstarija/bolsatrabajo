$(function () {
    CargarDatos();
    var tot = 3000 - $("#Descripcion").val().length;
    document.getElementById('CaracteresDispCE').innerText = tot + " / " + 3000;
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function CargarDatos() {
    urlE = "https://localhost:44351/Empleos";
    $.getJSON(urlE + '/getEmpleo', { Id: $("#Id").val() }, function (data) {
        var obj = data;
        if (obj != null) {
            var listIdCat = new Array();
            for (var i = 0; i < obj.Categorias.length; i++) {
                listIdCat.push(obj.Categorias[i].Id);
            }
            $("#Contrato").val(obj.Contrato);
            $("#RangoSueldos").val(obj.RangoSueldos);
            $("#ExperienciaMinima").val(obj.ExperienciaMinima);
            $("#Periodo").val(obj.Periodo);
            $("#Pais").val(obj.Pais);
            $("#EstadoRegion").val(obj.EstadoRegion);
            $("#Categoria").val(listIdCat);
            document.getElementById("Teletrabajo").checked = obj.Teletrabajo == "Si" ? true : false;
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

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispCE');
    p[0].innerText = tot + " / " + maxCaracteres;
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
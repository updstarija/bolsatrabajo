
//Validacion de inputs
$(function () {
    $('#buscarPersona').validacion(' 0123456789-abcdefghijklmnñopqrstuvwxyz.');
    $('#nacionalidad').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#pais').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#estadoRegion').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#ciudad').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()');
    $('#descripcion').validacion(' .,:;abcdefghijklmnñopqrstuvwxyzáéíóú0123456789""()');
    $('#profesionOcupacion').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#telefonoCelular').validacion('0123456789');
    $('#telefonoFijo').validacion(' -0123456789');
    $('#email').validacion(' .abcdefghijklmnñopqrstuvwxyzáéíóú0123456789@');
});

$(function () {
    $("#clave2").addClass('d-none');
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

const MAXIMO_TAMANIO_BYTES = 1000000;

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispCandidato');
    p[0].innerText = tot + " / " + maxCaracteres;
}

document.getElementById("imagen").onchange = function (e) {
    var size = e.target.files[0].size;
    if (size <= MAXIMO_TAMANIO_BYTES) {
        $("#contImg").attr("hidden", "hidden");
        $("#foto").removeAttr("hidden", "hidden");
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            var img = document.getElementById('foto');
            img.src = reader.result;
        }
    }
    else {
        $("#imagen").val(null);
        var img = document.getElementById('foto');
        img.src = "";
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Imagen',
            theme: 'modern',
            content: 'El tamaño de la imagen debe ser menor a 1mb',
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
function Limpiar() {
    $("#idpersona").val("");
    $("#nombre").val("");
    $("#apellido").val("");
    $("#contacto").val("");
    $("#descripcion").val("");
    $("#pais").val("");
    $("#estadoregion").val("");
    $("#ciudad").val("");
    $("#profesion").val("");
    $("#email").val("");
    $("#clave").val("");
    $("#confirmClave").val("");
    $("#imagen").val(null);
    var img = document.getElementById('foto');
    img.src = '';
}
function ConvertirFecha(fecha) {
    fecha = fecha.replace('/Date(', '');
    fecha = fecha.replace(')/', '');
    var fecha_Convertida = new Date(parseInt(fecha));
    fecha_Convertida = fecha_Convertida.toLocaleDateString("sv-SE");
    var nueva = fecha_Convertida.split(" ")[0].split("/").reverse().join("-");
    return fecha_Convertida
}
function ActualizarDatos(data) {
    $("#idpersona").val(data.Id);
    $("#nombre").val(data.Nombre);
    $("#apellido").val(data.ApellidoPaterno + " " + data.ApellidoMaterno);
    $("#nacionalidad").val(data.Nacionalidad);
    $("#nroDocumento").val(data.DocumentoIdentidad);
    $("#fechaNacimiento").val(ConvertirFecha(data.FechaNacimiento));
    $("#telefonoCelular").val(data.TelefonoCelular);
    $("#telefonoFijo").val(data.TelefonoFijo);
    $("#email").val(data.Email1);
    $("#pais").val(data.Pais);
    $("#estadoRegion").val(data.Provincia);
    $("#ciudad").val(data.Ciudad);
    $("#profesionOcupacion").val(data.Carrera);
}

function ActualizarDatosCuentaExistente(data) {
    $("#correoCuentaExistente").html("");
    $("#correoCuentaExistente").html('<div class="alert alert-primary" role="alert">' +
        '<p class="text-center">Usted ya tiene una cuenta creada con el siguiente correo:<br/><b>' + data.Email1 + '</b></p>' +
        '</div >');
}

function BuscarPersona() {
    $.getJSON(urlOficial + 'Persona/Buscar', { texto: $("#buscarPersona").val() },
        function (data) {
            console.log(data);
            if (data.Existe == 1) {
                ActualizarDatos(data);
                $("#searchPersona").fadeOut();
                $("#Datos_Personales").fadeIn(1000);
            }
            else if (data.Existe == 2) {
                ActualizarDatosCuentaExistente(data);
                $("#Datos_Cuenta_Existente").fadeIn(1000);
            }
            else if (data.Existe == 3) {
                $("#Datos_Cuenta_Existente").fadeOut();
                Toast("error", "CI no encontrado");
            }
        });
}

function verificarClave() {
    if ($("#clave").val() == $("#confirmClave").val()) {
        return true;
    }
    else return false;
}

function verificarCorreo(valor) {
    console.log(valor);
    var correo = $("#email").val();
    var expreRegular = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    var esValido = expreRegular.test(correo);
    if (esValido == false && correo.length > 0) {
        $("#estadoCorreo").removeAttr("hidden", "hidden");
        $("#email").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "su correo no es valido");
        }
    } else {
        $("#estadoCorreo").attr("hidden", "hidden");
        $("#email").removeClass("border border-danger");
    }
    return esValido;
}

function verificarCelular(valor) {
    var celu = $("#telefonoCelular").val();
    if (celu.length > 0 && celu.length < 8) {
        $("#estadoNumero").removeAttr("hidden", "hidden");
        $("#telefonoCelular").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "Su número de celular no es valido");
        }
        return false;
    } else {
        $("#estadoNumero").attr("hidden", "hidden");
        $("#telefonoCelular").removeClass("border border-danger");
        return true;
    }
}


function VerificarFormulario() {
    console.log("entra a verificar el formulario");
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
$("#formCandidato").on('submit', function (e) {
    e.preventDefault();
    if (verificarClave() && VerificarFormulario() == true && verificarCorreo(1) == true && verificarCelular(1) == true) {
        $.ajax({
            url: urlOficial + 'Candidatos/Guardar',
            type: 'POST',
            data: new FormData(this),
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Tipo == 1) {
                    $("#btnRegistrarCandidato").attr("disabled", true);
                    Toast("success", data.Msj);
                    window.location.href = urlOficial + 'Home/Login';
                    Limpiar();
                }
                else if (data.Tipo == 5) {
                    Toast("error", data.Msj);
                }
                else {
                    Toast("error", data.Msj);
                }
            }
        });
    }
    else {
        $('#clave2').removeClass('d-none');
        $("#confirmClave").val("");
    }
});
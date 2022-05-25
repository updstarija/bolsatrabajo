//Validacion de inputs
$(function () {
    $('#nombre_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú0123456789-()""');
    $('#NIT_empresa').validacion('0123456789');
    $('#nombre_persona_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú');
    $('#ciudad_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()');
    $('#direccion_empresa').validacion(' abcdefghijklmnñopqrstuvwxyzáéíóú()-/.0123456789');
    $('#sitio_web_empresa').validacion('.:abcdefghijklmnñopqrstuvwxyzáéíóú0123456789//');
    $('#telefonoCelular').validacion('0123456789');
    $('#telefonoFijo').validacion(' -0123456789');
    $('#descripcion_empresa').validacion(' .,:;abcdefghijklmnñopqrstuvwxyzáéíóú0123456789""()');
    $('#correo_empresa').validacion(' .abcdefghijklmnñopqrstuvwxyzáéíóú0123456789@');
});

const MAXIMO_TAMANIO_BYTES = 1000000;
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispEmpresa');
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

function verificarCorreo(valor) {
    console.log(valor);
    var correo = $("#correo_empresa").val();
    var expreRegular = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    var esValido = expreRegular.test(correo);
    if (esValido == false && correo.length > 0) {
        $("#estadoCorreo").removeAttr("hidden", "hidden");
        $("#correo_empresa").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "su correo no es valido");
        }
    } else {
        $("#estadoCorreo").attr("hidden", "hidden");
        $("#correo_empresa").removeClass("border border-danger");
    }
    return esValido;
}

function verificarURL(valor) {
    var url = $("#sitio_web_empresa").val();
    var expreRegular = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var esValido = expreRegular.test(url);
    if (esValido == false && url.length > 0) {
        $("#estadoUrl").removeAttr("hidden", "hidden");
        $("#sitio_web_empresa").addClass("border border-danger");
        if (valor == 1) {
            Toast("error", "su sitio web no es valido");
        }
    } else {
        $("#estadoUrl").attr("hidden", "hidden");
        $("#sitio_web_empresa").removeClass("border border-danger");
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

$("#formRegistrarEmpresa").on('submit', function (e) {
    e.preventDefault();
    if (VerificarFormulario() == true) {
        if (verificarCorreo(1) == true && verificarCelular(1) == true && verificarURL(1) == true) {
            var form = new FormData(this);
            form.append("pais_empresa", "Bolivia");
            $.ajax({
                url: urlOficial + 'Empresas/Guardar',
                type: 'POST',
                data: form,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Tipo == 1) {
                        $("#btnRegistrarEmpresa").attr("disabled", true);
                        Toast("success", data.Msj);
                        window.location.href = urlOficial + 'Login';
                        //setTimeout(function () {
                        //}, 3000);
                    }
                    else if (data.Tipo == 5) {
                        Toast("error", data.Msj);
                    }
                }
            });
        }
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
});
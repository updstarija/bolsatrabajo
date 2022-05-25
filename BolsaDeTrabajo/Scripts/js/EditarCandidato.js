$(function () {
    CargarDatos();
});
var validarKey = true;
var validarClaves = false;
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];
function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispCandidato');
    p[0].innerText = tot + " / " + maxCaracteres;
}

function CargarDatos() {
    $.getJSON(urlOficial + 'Candidatos/getCandidato', { Id: $("#idCandidato").val() }, function (data) {
        var obj = data;
        if (obj != null) {
            $("#tipoDocumento").val(obj.TipoDeDocumento);
            $("#sexo").val(obj.Sexo);
            var tot = 500 - $("#descripcion").val().length;
            document.getElementById('CaracteresDispCandidato').innerText = tot + " / " + 500;
        }
    });
}
function MostrarCampos() {
    $('#passwordC').removeClass('d-none');
    $('#passwordC').html("");
    var fila = `
            <div class="col-12 col-sm-6">
                    <label for="clave">Contraseña:</label>
                    <input type="password" class="form-control" id="clave" name="clave" value="" required>
                    <div class="invalid-feedback">¡Campo Vacio!</div>
                </div>
                <div class="col-12 col-sm-6">
                    <label for="confirmClave">Confirmar Contraseña:</label>
                    <input type="password" class="form-control" id="confirmClave" name="confirmClave" value="" required>
                    <div id="clave2" class="invalid-feedback">Las contraseña no coincide.</div>
                </div>
    `;
    $('#passwordC').append(fila);
    $('#btnMostrarCamposC').addClass('d-none');
    validarClaves = true;
}
const MAXIMO_TAMANIO_BYTES = 1000000;
document.getElementById("imagen").onchange = function (e) {
    var size = e.target.files[0].size;
    if (size <= MAXIMO_TAMANIO_BYTES) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            var img = document.getElementById('foto');
            img.src = reader.result;
        }
    }
    else {
        $("#imagen").val(null);
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

function verificarCorreo(valor) {
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

function verificarClave() {
    if ($("#clave").val() == $("#confirmClave").val()) {
        return true;
    }
    else return false;
}

function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validation-candidato');
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
    validarKey = VerificarFormulario();
    if (validarClaves == true) {
        validarKey = verificarClave();
    }
    if (validarKey == true) {
        if (verificarCelular(1) == true && verificarCorreo(1) == true) {
            $.ajax({
                url: urlOficial + 'Candidatos/Guardar',
                type: 'POST',
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Tipo == 1) {
                        Toast("success", data.Msj);
                        setTimeout(function () {
                            $("#ModalActualizarCandidato").modal('hide');
                            window.location.href = urlOficial + 'Candidatos/Editar';
                        }, 2000);
                    }
                    else if (data.Tipo == 4) {
                        Toast("success", data.Msj);
                        setTimeout(function () {
                            window.location.href = urlOficial + 'Login/Logout';
                        }, 3000);
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
    }
    else {
        $('#clave2').removeClass('d-none');
        $("#confirmClave").val("");
    }
});
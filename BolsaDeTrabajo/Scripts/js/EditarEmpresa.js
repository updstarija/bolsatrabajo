$(function () {
    CargarEmpresa();
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];
var validarKey = true;
var validarClaves = false;
const MAXIMO_TAMANIO_BYTES = 1000000;

function CargarEmpresa() {
    urlE = "https://localhost:44351/Empresas";
    $.getJSON(urlE + '/getEmpresa', { Id: $("#id_empresa").val() }, function (obj) {
        if (obj != null) {
            $("#perfil-info00").html("");
            $("#perfil-info01").html("");
            $("#perfil-info02").html("");
            $("#perfil-info03").html("");

            var perfilInfo0 = "<img src='data:image;base64," + obj.Perfil.Foto + "' class='rounded-circle img-perfil-empresa'/>"+
                "<h5 class='text-center mt-3'>" + obj.NombreEmpresa + "</h5>"+
                "<p class='text-center'>" + obj.Perfil.Usuario.Correo + "</p>";

            var perfilInfo1 = "<p><b>NIT: </b>" + obj.NIT + "</p>" +
                "<p><b>Sitio Web: </b>" + obj.SitioWeb + "</p>" +
                "<p><b>Celular: </b>" + obj.Perfil.TelefonoCelular + "</p>" +
                "<p><b>Telefono: </b>" + obj.Perfil.TelefonoFijo + "</p>" +
                "<p><b>Responsable: </b>" + obj.NombrePersonaResponsable + "</p>";

            var perfilInfo2 = "<p><b>Pais: </b>" + obj.Perfil.Pais + "</p>" +
                "<p><b>Departamento: </b>" + obj.Perfil.EstadoRegion + "</p>" +
                "<p><b>Ciudad: </b>" + obj.Perfil.Ciudad + "</p>" +
                "<p><b>Dirección: </b>" + obj.Direccion + "</p>";

            var perfilInfo3 = "<p><b>Descripción: </b>" + obj.Perfil.Descripcion + "</p>";


            $("#perfil-info00").html(perfilInfo0);
            $("#perfil-info01").html(perfilInfo1);
            $("#perfil-info02").html(perfilInfo2);
            $("#perfil-info03").html(perfilInfo3);

            $("#perfil-info1").html("");
            $("#NIT_empresa").val(obj.NIT);
            $("#nombre_empresa").val(obj.NombreEmpresa);
            $("#direccion_empresa").val(obj.Direccion);
            $("#nombre_persona_empresa").val(obj.NombrePersonaResponsable);
            $("#sitio_web_empresa").val(obj.SitioWeb);
            $("#telefonoCelular").val(obj.Perfil.TelefonoCelular);
            $("#telefonoFijo").val(obj.Perfil.TelefonoFijo);
            $("#pais_empresa").val(obj.Perfil.Pais);
            $("#estadoregion").val(obj.Perfil.EstadoRegion);
            $("#ciudad_empresa").val(obj.Perfil.Ciudad);
            $("#descripcion_empresa").val(obj.Perfil.Descripcion);
            $("#correo_empresa").val(obj.Perfil.Usuario.Correo);
            var tot = 500 - $("#descripcion_empresa").val().length;
            document.getElementById('CaracteresDispEmpresa').innerText = tot + " / " + 500;
            var img = document.getElementById('foto');
            img.src = "data:image;base64," + obj.Perfil.Foto;
        }
    });
}

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispEmpresa');
    p[0].innerText = tot + " / " + maxCaracteres;
}

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

function MostrarCamposE() {
    $('#passwordE').removeClass('d-none');
    $('#passwordE').html("");
    var fila = `
            <div class="col-12 col-sm-6">
                    <label for="clave">Contraseña:</label>
                    <input type="password" class="form-control is-valid" id="clave" name="clave" value="" required>
                    <div class="invalid-feedback">¡Campo Vacio!</div>
                </div>
                <div class="col-12 col-sm-6">
                    <label for="confirmClave">Confirmar Contraseña:</label>
                    <input type="password" class="form-control is-valid" id="confirmClave" name="confirmClave" value="" required>
                    <div id="clave2E" class="invalid-feedback">Las contraseña no coincide.</div>
                </div>
    `;
    $('#passwordE').append(fila);
    $('#btnMostrarCamposE').addClass('d-none');
    validarClaves = true;
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
function verificarClave() {
    if ($("#clave").val() == $("#confirmClave").val()) {
        return true;
    }
    else return false;
}

$("#formEditarEmpresa").on('submit', function (e) {
    console.log("gardar empres");
    e.preventDefault();

    validarKey = VerificarFormulario();
    if (validarClaves == true) {
        validarKey = verificarClave();
    }
    if (validarKey == true) {
        urlE = "https://localhost:44351/Empresas";
        var form = new FormData(this);
        form.append("pais_empresa", "Bolivia");
        $.ajax({
            url: urlE + '/Guardar',
            type: 'POST',
            data: form,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Tipo == 1) {
                    Toast("success", data.Msj);
                    $("#ModalActualizarEmpresa").modal('hide');
                    CargarEmpresa();
                    setTimeout(function () {
                        //urla = "https://localhost:44351/Inicio";
                        //window.location.href = urla + '/IndexCurriculums';
                    }, 3000);
                }
                else if (data.Tipo == 4) {
                    Toast("success", data.Msj);
                    setTimeout(function () {
                        urla = "https://localhost:44351/Login";
                        window.location.href = urla + '/Logout';
                    }, 3000);
                }
                else if (data.Tipo == 5) {
                    Toast("error", data.Msj);
                }
                else {
                    Toast("error", "¡Error al guardar!");
                }
            }
        });
    }
    else {
        $('#clave2E').removeClass('d-none');
        $("#confirmClave").val("");
        VerificarFormulario();
    }
});
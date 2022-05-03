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
function BuscarPersona() {
    urlE = "https://localhost:44351/Persona";
    $.getJSON(urlE + '/Buscar', { texto: $("#buscarPersona").val() },
        function (data) {
            if (data.length != 0) {
                ActualizarDatos(data[0]);
                $("#searchPersona").fadeOut();
                $("#Datos_Personales").fadeIn(1000);
            }
            else {
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
$("#formCandidato").on('submit', function (e) {
    e.preventDefault();
    urlE = "https://localhost:44351/Candidatos";
    if (verificarClave() && VerificarFormulario() == true) {
        $.ajax({
            url: urlE + '/Guardar',
            type: 'POST',
            data: new FormData(this),
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Tipo == 1) {
                    Limpiar();
                    Toast("success", data.Msj);
                    setTimeout(function () {
                        urla = "https://localhost:44351/Login";
                        window.location.href = urla + '/Index';
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
    else {
        $('#clave2').removeClass('d-none');
        $("#confirmClave").val("");
    }
});
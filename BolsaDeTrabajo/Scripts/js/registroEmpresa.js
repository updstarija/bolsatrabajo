$(function () {

});
const MAXIMO_TAMANIO_BYTES = 1000000;
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    var contenedor = e[0].parentNode;
    var p = contenedor.querySelectorAll('#CaracteresDispEmpresa');
    p[0].innerText = tot + maxCaracteres;
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
                    setTimeout(function () {
                        urla = "https://localhost:44351/Login";
                        window.location.href = urla + '/Index';
                    }, 3000);
                }
                else if (data.Tipo == 5) {
                    Toast("error", data.Msj);
                }
            }
        });
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
});
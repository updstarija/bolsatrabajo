function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    $("#CaracteresDispDE").html(tot + " / " + maxCaracteres);
}
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];
function Limpiar() { }
function VerificarFormulario() {
    var validacion = true;
    var forms = document.getElementsByClassName('needs-validationRP');
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            validacion = false;
            form.classList.add('was-validated');
        }
    });
    return validacion;
}
function RegistrarPostulacion() {
    urlE = "https://localhost:44351/Postulantes";
    if (VerificarFormulario() == true) {
        var obj = {
            PretencionSalarial: $("#PretencionSalarial").val(),
            IdCurriculum: $("#IdCurriculum").val(),
            IdEmpleo: $("#IdDE").val(),
            CartaPresentacion: $("#CartaPresentacion").val()
        }
        $.ajax({
            url: urlE + '/Guardar',
            type: 'POST',
            data: JSON.stringify(obj),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.Tipo == 1) {
                    $("#PostulacionModal").modal('hide');
                    Toast("success", data.Msj);
                    setTimeout(function () {
                        urla = "https://localhost:44351/Empleos";
                        window.location.href = urla + '/Index';
                    }, 3000);
                }
            }
        });
    }
    else {
        Toast("error", "¡Debe llenar los siguientes campos!");
    }
}
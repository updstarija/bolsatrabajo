$(document).ready(function () {
    traerEmpleos();
});
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];

function ContarCaracteres(str, maxCaracteres, e) {
    var tot = parseInt(maxCaracteres) - str.length;
    $("#CaracteresDispDE").html(tot + " / " + maxCaracteres);
}

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
function traerEmpleos() {
    urlE = "https://localhost:44351/Empleos";

    $.getJSON(urlE + '/listEmpleos', function (data) {
        $("#IdEmpleos").html("");
        var option = `<option selected  value="-1">Seleccionar un Empleo...</option>`;
        for (var i = 0; i < data.empleos.length; i++) {
            option += `<option value="${data.empleos[i].Id}">${data.empleos[i].Titulo}</option>`;
           
        }
        $("#IdEmpleos").append(option);
    });
}

function RegistrarInvitacion() {
    urlE = "https://localhost:44351/Invitaciones";
    if (VerificarFormulario() == true) {
        var obj = {
            IdCurriculum: $("#idValor").val(),
            IdEmpleo: $("#IdEmpleos").val(),
            SueldoAproximado: $("#SujerirSalarial").val(),
            Carta: $("#CartaInvitacion").val(),
        }
        $.ajax({
            url: urlE +'/Guardar',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(obj),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.Tipo == 1) {
                    Toast("success", data.Msj);
                    $("#InvitacionModal").modal('hide');
                    setTimeout(function () {
                        urla = "https://localhost:44351/Inicio";
                        window.location.href = urla + '/IndexCurriculums';
                    }, 3000);
                }
            }
        });
    }
}
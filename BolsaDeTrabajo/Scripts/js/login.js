

////const pass_field = document.querySelector('.pass-key');
////const showBtn = document.querySelector('.show');
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];
df = document.getElementById('login');
cont = 0;

//showBtn.addEventListener('click', function () {
//    if (pass_field.type === "password") {
//        pass_field.type = "text";
//        showBtn.textContent = "Ocultar";
//        showBtn.style.color = "FFFFFF";

//    } else {
//        pass_field.type = "password";
//        showBtn.textContent = "Mostrar";
//        showBtn.style.color = "	#FFFFFF";
//    }
//});

$("#formulario").on('submit', function (e) {
    if (cont == 0) {
/*        df.classList.add('azul');*/
        cont = 1;
        e.preventDefault();
        $.ajax({
            url: urlOficial + 'Login/Ingresar',
            type: 'POST',
            data: new FormData(this),
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Tipo == 1) {
/*                    $("#spinner").removeAttr("hidden","hidden");*/
                    $("#btnLogin").prop("disabled", true);
                    Toast("success", 'Ingresando...');
                    if (data.RolUsuario == "Candidato") {
                        setTimeout(function () {
                            window.location.href = urlOficial + 'Inicio/Index';
                        }, 300);
                    }
                    else if (data.RolUsuario == "Empresa") {
                        setTimeout(function () {
                            window.location.href = urlOficial + 'Inicio/IndexCurriculums';
                        }, 300);
                    }
                    else if (data.RolUsuario == "Administrador") {
                        setTimeout(function () {
                            window.location.href = urlOficial + 'Administradores/Index';
                        }, 300);
                    }
                }
                else if (data.Tipo == 2 && cont == 1) {
                    /*df.classList.remove('azul');*/
                    cont = 0;
                    Toast("error", "¡Correo o Contraseña incorrecta!");
                }
                else if (data.Tipo == 4) {
                    $.confirm({
                        icon: 'fas fa-exclamation-triangle',
                        title: 'Cuenta Inhabilitada',
                        theme: 'modern',
                        content: data.Msj,
                        type: 'red',
                        typeAnimated: true,
                        animation: 'rotateYR',
                        closeAnimation: 'scale',
                        buttons: {
                            close: {
                                text: 'Cerrar',
                                action: function () {
                                }
                            }
                        }
                    });
                }
                else {
                    Toast("error", data.Msj);
                }
            }
        });
    } else {
/*        df.classList.remove('azul');*/
        cont = 0;}
    
});

function ConfirmCambiarClave() {
    var Correo = $("#usuario").val();
    if (Correo != "") {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Cambiar Contraseña',
            theme: 'modern',
            content: 'Se enviara la nueva contraseña a su correo. ¿Esta seguro?',
            type: 'orange',
            typeAnimated: true,
            animation: 'rotateYR',
            closeAnimation: 'scale',
            buttons: {
                confirm: {
                    text: 'Confirmar',
                    btnClass: 'btn-orange',
                    action: function () {
                        var formData = new FormData();
                        formData.append("Correo", Correo);
                        $.ajax({
                            url: urlOficial + 'Login/CambiarClave',
                            type: 'POST',
                            data: formData,
                            dataType: 'json',
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.Tipo == 1) {
                                    Toast("success", data.Msj);
                                }
                                else if (data.Tipo == 2) {
                                    Toast("error", data.Msj);
                                }
                                else {
                                    Toast("error", data.Msj);
                                }
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
    else {
        Toast("error", "Campo vacio, por favor ingrese el correo");
    }
}
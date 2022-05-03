//var direct = window.location.href.split('/');
//var url = window.location.origin + "/" + direct[3];

var urlN = "https://localhost:44351";

$("#ButtonCandidatoRegistro").click(function () {
    window.location.href = urlN +'/Candidatos/Index';
});
$("#ButtonCandidatoIngreso").click(function () {
    window.location.href = urlN +'/Login/Index';
});
$("#ButtonEmpresaRegistro").click(function () {
    window.location.href = urlN +'/Empresas/Index';
});
$("#ButtonEmpresaIngreso").click(function () {
    window.location.href = urlN +'/Login/Index';
});

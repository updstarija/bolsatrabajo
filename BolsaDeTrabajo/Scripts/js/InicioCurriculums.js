$(document).ready(function () {
    cargarListaCurriculums();
})
var direct = window.location.href.split('/');
var url = window.location.origin + "/" + direct[3];
var indexRegistroinicial = 0;
var nroRegistros = 6;
var ultiCards = null;
var confirmar = true;
var indexCards = null;
var validorScroll = 0;
var Departamentos = new Array();
var Carreras = new Array();
var FiltrosGeneral = null;
var c = 0;

function MostrarMenu() {
    $("#filters").animate({ height: 'toggle' }, 700);
}

window.addEventListener('scroll', agregarListaCurriculums);
function agregarListaCurriculums() {
    var ubicacion = ultiCards.offsetTop;
    let scrollTop = document.documentElement.scrollTop;
    var h = window.innerHeight;
    if (ubicacion < scrollTop + h) {
        if (validorScroll == 1) {
            if (confirmar == true) {
                cargarListaCurriculums();
                confirmar = false;
            }
        }
        else if (validorScroll == 2) {
            if (confirmar == true) {
                FiltrosGeneral.Pagina = indexRegistroinicial;
                getFiltrosDC(FiltrosGeneral);
                confirmar = false;
            }
        }
    }
}
function cargarListaCurriculums() {
    console.log("contador antes: " + c);
    $.getJSON(urlOficial + 'Curriculos/getCurriculums', { Pagina: indexRegistroinicial }, function (data) {
        var list = data;
        if (list.curriculums.length != 0) {
            c = 1;
            validorScroll = 1;
            ListarCurriculums(list);
            indexRegistroinicial += list.curriculums.length;
        } else {
            if (c == 0) {
                $("#mensaje").removeAttr("hidden","hidden");
                $("#cargandoC").hide();
                $("#mensaje").html("");
                var mensaje = '<div class="alert" style="background-color: #0099CC" role="alert">'
                    + '<p class="text-center text-white font-weight-bold">Aun no hay curriculums publicados</p>'
                    + '</div>';
                $("#mensaje").html(mensaje);
            }
        }
        console.log("contador despues: " + c);
    });
}

function ListarCurriculums(list) {
    $("#cargandoC").show();
    if (indexRegistroinicial == 0) {
        $("#itemsCardsCurriculums").html("");
    }
    for (var i = 0; i < list.curriculums.length; i++) {
        var obj = list.curriculums[i];
        var fecha = new Date(+obj.InformacionGeneral.FechaActualizacion.replace(/\D/g, '')).toLocaleDateString();
        var subcadena = obj.InformacionGeneral.Carrera.Nombre.substring(0, 12);
        var subcadenaPB = obj.InformacionGeneral.presentacionBiografiaIG.substring(0, 121);
        var cartas = `<div class=" col-12 col-sm-4 mb-3">
                        <div class="card-personalizado">
                        <div class="cabecera-cards">
                            <img src="data:image;base64,${obj.DatosPersonalesC.imagenDP}" />
                        </div>
                        <div class="cuerpo-card">
                            <h3>${obj.DatosPersonalesC.apellidoDP}</h3>
                            <p><i class="fas fa-user-tie"></i> ${obj.InformacionGeneral.Carrera.Nombre}</p>
                            <p><i class="fas fa-map-marked-alt"></i> ${obj.InformacionGeneral.estadoRegionIG}</p>
                            <p>${obj.InformacionGeneral.presentacionBiografiaIG.length > 120 ? subcadenaPB : obj.InformacionGeneral.presentacionBiografiaIG}...</p>
                        </div>
                        <div class="pie-card">
                            <a class="boton-card" href="${urlOficial}Curriculos/DetalleCurriculo?Id=${obj.DatosPersonalesC.idCurriculum}""> Ver mas</a>
                        </div>
                    </div>
                </div>`;
        $("#itemsCardsCurriculums").append(cartas);
        if (i + 1 == list.curriculums.length) {
            confirmar = true;
        }
    }
    indexCards += list.curriculums.length;
    ultiCards = document.querySelectorAll('#itemsCardsCurriculums')[0].children[indexCards - 1];
    $("#cargandoC").hide();
}

function getList(idDiv) {
    var list = new Array();
    var datosCheck = document.getElementById(idDiv);
    var inputs = datosCheck.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked == true) {
            var val = inputs[i].value;
            list.push(val);
        }
    }
    return list;
}
function OffCheked(idDiv) {
    var datosForm = document.getElementById(idDiv);
    var inputs = datosForm.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
    }
}

function FiltrarCurriculums(nombreFiltro) {
    indexRegistroinicial = 0;
    var filtros = null;
    var Verificacion = false;
    if (nombreFiltro == 'Filtro1') {
        validorScroll = 2;
        Departamentos = getList("departamentos");
        Carreras = getList("carreras");
        filtros = {
            ListaDepartamentos: Departamentos,
            ListaCarreras: Carreras,
            Pagina: indexRegistroinicial,
        }
        FiltrosGeneral = filtros;
        if (Departamentos.length != 0 || Carreras.length != 0) {
            Verificacion = true;
        }
    }
    else if (nombreFiltro == 'Filtro2') {
        validorScroll = 2;
        OffCheked("departamentos");
        OffCheked("carreras");
        filtros = getValues("filtroEmpleo");
        filtros["Pagina"] = indexRegistroinicial;
        Departamentos = [];
        if (filtros.Departamento != "") {
            Departamentos.push(filtros.Departamento);
        }
        filtros["ListaDepartamentos"] = Departamentos;
        FiltrosGeneral = filtros;
        if (filtros.ListaCarreras != null || filtros.Departamento != "" || filtros.PublicadoDentroDe != "" || filtros.Contrato != "" || filtros.PalabraClave != "") {
            Verificacion = true;
        }
    }


    if (Verificacion == true) {
        getFiltrosDC(FiltrosGeneral);
    }
    else {
        indexRegistroinicial = 0;
        indexCards = 0;
        cargarListaCurriculums();
    }
}
function getFiltrosDC(filtros) {
    $.ajax({
        url: urlOficial + 'Curriculos/getCurriculumsByFiltros',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(filtros),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            var int = 0;
            if (data.TotalRegistro == 0) {
                $("#itemsCardsCurriculums").html("");
            }
            else {
                if (data.curriculums.length != 0) {
                    indexCards = 0;
                    ListarCurriculums(data);
                    indexRegistroinicial += data.curriculums.length;
                }
            }
        }
    });
}
function getValues(tarjet) {
    var obj = new Object();
    var datosForm = document.getElementById(tarjet);
    var inputs = datosForm.querySelectorAll('input, select');
    for (var i = 0; i < inputs.length; i++) {

        obj[inputs[i].id] = inputs[i].value;
    }
    var li = $('#listCarreras').val();
    obj["ListaCarreras"] = li[0] == "" ? null : li;
    return obj;
}
function CurriculumsFiltrar(NombreFiltro) {
    MostrarMenu();
    FiltrarCurriculums(NombreFiltro);
}

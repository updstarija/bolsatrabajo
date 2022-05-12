var indexRegistroInicial = 0;
var nroRegistros = 4;
var Departamentos = new Array();
var Categorias = new Array();
var PublicadoDentroDe = "";
var Contrato = "";
var Palabra = "";
var direct = window.location.href.split('/');
var url = window.location.origin + direct[3];

$(function () {
    $("#textSearch").addClass('d-block');
    cargarListaEmpleos("true");
});
$(".searchOpciones ul li a").click(function () {
    $('.searchOpciones ul li a').removeClass('linkActive');
    $(this).addClass('linkActive');
});
function showFiltrar() {
    $("#filters").animate({
        height: 'toggle'
    }, 300);
}
function cargarListaEmpleos(Recargar) {
    urlE = "https://localhost:44351/Empleos";
    if (Recargar == "true") {
        indexRegistroInicial = 0;
    }
    $.getJSON(urlE + '/getEmpleos', { Pagina: indexRegistroInicial }, function (data) {
        var list = data;
        if (list.empleos.length != 0) {
            ListarEmpleos(list, "cargarListaEmpleos('false')");
            indexRegistroInicial += nroRegistros;
            if (indexRegistroInicial >= list.TotalRegistros) {
                $("#btnAgregarMas").addClass('d-none');
                $("#btnAgregarMas").removeClass('d-block');
            }
            else {
                $("#btnAgregarMas").addClass('d-block');
                $("#btnAgregarMas").removeClass('d-none');
            }
        } else {
            $("#mensaje").removeAttr("hidden", "hidden");
            $("#cargandoC").hide();
            $("#mensaje").html("");
            var mensaje = '<div class="alert" style="background-color: #0099CC" role="alert">'
                + '<p class="text-center text-white font-weight-bold">Aun no hay empleos publicados</p>'
                + '</div>';
            $("#mensaje").html(mensaje);
        }
    });
}

function ListarEmpleos(list, nombreMetodo) {
    urlE = "https://localhost:44351/Empleos";
    if (indexRegistroInicial == 0) {
        $("#itemsCards").html("");
    }
    for (var i = 0; i < list.empleos.length; i++) {
        var fila = `
                        <div class="col-12 col-md-6">
                            <div class="blog-card shadow-lg bg-white rounded">
                                <div class="meta">
                                    <div class="photo"
                                         style="background-image: url(data:image;base64,${list.empleos[i].Empresa.Perfil.Foto})">
                                    </div>
                                    <ul class="details">
                                        <li class="author"><a href="#"><i class="fas fa-building"></i>  ${list.empleos[i].Empresa.NombreEmpresa}</a></li>
                                        <li class="date"><i class="fas fa-calendar-day"></i> ${list.empleos[i].FechaRegistro}</li>
                                    </ul>
                                </div>
                                <div class="description">
                                    <h1>${list.empleos[i].Titulo}</h1>
                                    <h2>${list.empleos[i].EstadoRegion}</h2>
                                    <p>${list.empleos[i].Ciudad}</p>
                                    <p>Experiencia Minima:${list.empleos[i].ExperienciaMinima} años</p>
                                    <p class="read-more">
                                        <a href="${urlE}/detalleEmpleo?Id=${list.empleos[i].Id}">Leer Mas</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                `;
        $("#itemsCards").append(fila);
    }
    $("#btnAgregarMas").html("");
    var btn = `<div class="col-12 mx-auto">
                    <button class="btn btnBlueTransparent" onclick="${nombreMetodo}"><i class="fas fa-angle-double-down"></i> Ver Mas</button>
                </div >`;
    $("#btnAgregarMas").append(btn);
}

function getList(idDiv) {
    var list = new Array();
    var datosForm = document.getElementById(idDiv);
    var inputs = datosForm.querySelectorAll('input');
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
function FiltrarEmpleos(Recargar, NombreFiltro) {
    if (Recargar == "true") {
        indexRegistroInicial = 0;
    }
    var filtros = null;
    var VerifValidacion = false;
    if (NombreFiltro == "Filtro1") {
        Departamentos = getList("departamentos");
        Categorias = getList("categorias");
        filtros = {
            ListaDepartamentos: Departamentos,
            ListaCategorias: Categorias,
            Pagina: indexRegistroInicial
        }
        if (Departamentos.length != 0 || Categorias.length != 0) {
            VerifValidacion = true;
        }
    }
    else if (NombreFiltro == "Filtro2") {
        OffCheked("departamentos");
        OffCheked("categorias");
        filtros = getValues("filtroEmpleo");
        filtros["Pagina"] = indexRegistroInicial;
        Departamentos = [];
        Departamentos.push(filtros.Departamento);
        filtros["ListaDepartamentos"] = Departamentos[0] != "" ? Departamentos : null;
        if (filtros.ListaCategorias != null || filtros.Departamento != "" || filtros.PublicadoDentroDe != "" || filtros.Contrato != "" || filtros.Contrato != "") {
            VerifValidacion = true;
        }
    }

    if (VerifValidacion == true) {
        urlE = "https://localhost:44351/Empleos";
        $.ajax({
            url: urlE + '/getEmpleosByFiltros',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(filtros),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.empleos.length != 0) {
                    ListarEmpleos(data, "FiltrarEmpleos('false','" + NombreFiltro + "')");
                    indexRegistroInicial += nroRegistros;
                    if (indexRegistroInicial >= data.TotalRegistros) {
                        $("#btnAgregarMas").addClass('d-none');
                        $("#btnAgregarMas").removeClass('d-block');
                    }
                    else {
                        $("#btnAgregarMas").addClass('d-block');
                        $("#btnAgregarMas").removeClass('d-none');
                    }
                }
                else {
                    $("#itemsCards").html("");
                    $("#btnAgregarMas").addClass('d-none');
                    $("#btnAgregarMas").removeClass('d-block');
                }
            }
        });
    }
    else {
        cargarListaEmpleos("true");
    }
}
function getValues(idDiv) {
    var obj = new Object();
    var datosForm = document.getElementById(idDiv);
    var inputs = datosForm.querySelectorAll('input, textarea, select');
    for (var i = 0; i < inputs.length; i++) {
        obj[inputs[i].id] = inputs[i].value;
    }
    var li = $('#listCategoria').val();
    obj["ListaCategorias"] = li[0] == "" ? null : li;

    return obj;
}

function EmpleosFiltrar(Recargar, NombreFiltro) {
    showFiltrar();
    FiltrarEmpleos(Recargar, NombreFiltro);
}

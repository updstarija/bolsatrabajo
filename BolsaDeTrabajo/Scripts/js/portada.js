
function limpiar() {

}

document.getElementById("imagen").onchange = function (e) {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
        var img = document.getElementById('foto');
        img.src = reader.result;
    }
};




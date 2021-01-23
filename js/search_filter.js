document.getElementById("btn").addEventListener("click", spellCheck);

function spellCheck() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    var wrapper = document.getElementById('search_filter_container');
    wrapper.innerHTML = '';
      let urlBusqueda = `buscador.php?consulta=${palabraBuscar}&facet=true`;
      get(urlBusqueda).then(function(response) {
        console.log("-");
        console.log(JSON.parse(JSON.parse(response)));
        console.log("-");
      }, function(error) {
          alert("Se ha producido un error, intente más tarde.")
      })
}

function correct(e) {
  document.getElementById("inputSearch").value = e.target.id;
  document.getElementById("btn").click();
}

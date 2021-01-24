
document.getElementById("inputSearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      search_filter();
    }
});
var results;
var esp_elements;
var auth_elements;
var image_elements;

function search_filter() {
  results = null;
  let palabraBuscar = document.getElementById("inputSearch").value;
  let wrapper = document.getElementById('search_filter_container');
  let urlBusqueda = `buscador.php?consulta=${palabraBuscar}`;
  let filters = '';
  let document_index = 0;
  esp_elements = [];
  auth_elements = [];
  image_elements = [];

  wrapper.innerHTML = '';
  get(urlBusqueda).then(function (response) {
    results = JSON.parse(JSON.parse(response));

    results['response']['docs'].forEach(element => {
      let author_tag = element['attr_meta'][35];
      let lenguaje_tag = element['attr_meta'][47];
      let image_tag = element['attr_meta'][0];

      if (typeof author_tag !== 'undefined') {
        auth_elements.push(document_index);
        console.log("a-------------------------------------------a");
        console.log(auth_elements);
      }
      if ((typeof lenguaje_tag !== 'undefined') && (lenguaje_tag == 'es_MX' )) {
        esp_elements.push(document_index);
        console.log("b-------------------------------------------b");
        console.log(esp_elements);      
      }
      if ((typeof image_tag !== 'undefined') && (image_tag == 'og:image' )) {
        image_elements.push(document_index);
        console.log("c-------------------------------------------c");
        console.log(image_elements);   
      }

      document_index++;
    })

      filters=`<div class="filters-container">
                <button onclick="filteredTable('esp')">En español(${esp_elements.length})</button>
                <button onclick="filteredTable('auth')">Con autor(${auth_elements.length})</button>
                <button onclick="filteredTable('image')">Con imagenes(${image_elements.length})</button>
              </div>`;
    
      wrapper.innerHTML = filters;
    
    }, function (error) {
    alert("Se ha producido un error, intente más tarde.")
  })
}

function filteredTable(type) {
  data = results;
  let documents = [];
  
  switch (type) {
    case 'esp':
      esp_elements.forEach(element => {
        documents.push(data['response']['docs'][element]);
      });
      break;
    case 'auth':
      auth_elements.forEach(element => {
        documents.push(data['response']['docs'][element]);
      });
      break;
    case 'image':
      image_elements.forEach(element => {
        documents.push(data['response']['docs'][element]);
      });      
      break;
  }
  
  let foo = document.getElementById("resultados");
  var table = document.createElement("table");
  var table_content = "";
  
  
  if (documents.length > 0) {
    documents.forEach(document => {
        table_content = `${table_content} <h3>${document['attr_dc_title'][0]}<h3><p>${document['attr_text'][0]}</p>`
        console.log(documents);
      });

      table.innerHTML = table_content;
  } else {
      table.innerHTML = "Sin resultados";
  }
  
  if (foo.hasChildNodes()) { 
    while ( foo.childNodes.length >= 1 ){
        foo.removeChild( foo.firstChild );
    }
  }


  foo.appendChild(table);
}
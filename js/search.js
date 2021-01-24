document.getElementById("btn").addEventListener("click", read);
document.getElementById("inputSearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      document.getElementById("btn").click();
    }
});

function read() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    if(!palabraBuscar) {
        alert("Introduce una palabra en el buscador")
        return;
    }
    search(palabraBuscar);
}

function search(palabraBuscar){
    let urlBusqueda = 'buscador.php?consulta=' + palabraBuscar;
    get(urlBusqueda).then(function(response) {
        let tabla = initializeTable(response);
        let foo = document.getElementById("resultados");
        if (foo.hasChildNodes()) { 
            while ( foo.childNodes.length >= 1 ){
                foo.removeChild( foo.firstChild );
            }
        }
        foo.appendChild(tabla);
    }, function(error) {
        alert("Se ha producido un error, intente más tarde.")
    })
}


function get(url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function() {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function() {
        reject(Error("Network Error"));
        };
        req.send();
    });
}

function initializeTable(data) {
    data = JSON.parse(data);
    data = JSON.parse(data);
    documents = data['response']['docs'];

    var table = document.createElement("table");
    var thead = table.createTHead();
    var tbody = table.createTBody();
    var col = [];
    var table_content = "";
    var tam = data['response']['numFound'];

    console.log(data);
    
    if (documents.length > 0) {
        /*documents.forEach(document => {
            table_content = `${table_content} <h3>${document['attr_title'][0]}<h3>
            <p>${data['highlighting'][document['id']]['attr_text'][0]}</p>`
        });*/

        //table.innerHTML = table_content;

        
       /* for (var i = 0; i < documents.length; i++) {
            for (var key in documents[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                    console.log(col);
                }
            }
        }*/

        var cabecera = thead.insertRow(-1);
        var titulos = ['Título','Descripción','Debug'];
        for (var i = 0; i < 3; i++) {
            var th = document.createElement("th");
            th.innerHTML = titulos[i];
            cabecera.appendChild(th);
        }

        for (var i = 0; i < tam; i++) {
            tr = tbody.insertRow(-1);
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = documents[i]['attr_title'][0];
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data['highlighting'][documents[i]['id']]['attr_text'][0];
            tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data['debug']['explain'][documents[i]['id']]['value'];
        }
        
    } else {
        table.innerHTML = "Sin resultados";
    }
    return table;
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
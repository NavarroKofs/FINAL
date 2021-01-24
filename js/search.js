document.getElementById("btn").addEventListener("click", search);
document.getElementById("inputSearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      document.getElementById("btn").click();
    }
});

function search() {
    let palabraBuscar = document.getElementById("inputSearch").value;
    if(!palabraBuscar) {
        alert("Introduce una palabra en el buscador")
        return;
    }
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

    console.log(data);
    
    if (documents.length > 0) {
        documents.forEach(document => {
            table_content = `${table_content} <h3>${document['attr_dc_title'][0]}<h3><p>${document['attr_text'][0]}</p>`
        });

        table.innerHTML = table_content;

        /*
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        var cabecera = thead.insertRow(-1);
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i];
            cabecera.appendChild(th);
        }
        for (var i = 0; i < data.length; i++) {
            tr = tbody.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (col[j] == 'link') {
                    tabCell.innerHTML = '<a href="' + data[i][col[j]] + '">' + data[i][col[j]] + '</a>';
                } else {
                    tabCell.innerHTML = data[i][col[j]];
                }
            }
        }
        */
    } else {
        table.innerHTML = "Sin resultados";
    }
    return table;
}

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
import {Anuncio_Auto} from './anuncio_auto.js'

window.scrollTo({ top: 0, behavior: 'smooth' });
document.getElementById('spinner-container').style.display = 'none';
document.getElementById('div-tabla-anuncios').style.display = 'none';

//Cargar datos
const lista = leerDatosLocalStorage('lista') || [];

//Cargar Tabla
iniciarTabla();

//Event Listeners

document.getElementById('form-anuncio').addEventListener('submit', submitHandler);
document.getElementById('tabla-anuncios').addEventListener('click', tableClickHandler);
document.getElementById('btn-nuevo').addEventListener('click', limpiarFormulario);
document.getElementById('btn-borrar').addEventListener('click', deleteHandler);


function crearTabla(data){
    const $tabla = document.createElement('table');
    $tabla.id = 'tabla-anuncios';
    $tabla.className = 'table';
    
    const $thead = document.createElement('thead');
    const encabezados = Object.keys(new Anuncio_Auto());
    encabezados.forEach(element => {
        const $th = document.createElement('th');
        $th.innerText = element;
        $thead.appendChild($th);
    });
    
    const $tbody = document.createElement('tbody');
    data.forEach(element => {
        const $tr = document.createElement('tr');
        const datos = Object.values(element);
        datos.forEach(element2 => {
            const $td = document.createElement('td');
            $td.innerText = element2;
            $tr.appendChild($td);
        });
        $tbody.appendChild($tr);
    });
    
    $tabla.appendChild($thead);
    $tabla.appendChild($tbody);
    return $tabla;
}

function guardarDatosLocalStorage(data, name){
    localStorage.setItem(name, JSON.stringify(data));
}

function leerDatosLocalStorage(name){
    return JSON.parse(localStorage.getItem(name));
}

function submitHandler(e){
    e.preventDefault();
    const form = e.target;
    if(e.submitter.value == 'Guardar'){
        const anuncio = new Anuncio_Auto(
            getNextId(lista),
            form.titulo.value,
            form.transaccion.value,
            form.descripcion.value,
            form.precio.value,
            form.puertas.value,
            form.kms.value,
            form.potencia.value
        );
        lista.push(anuncio);
        insertarObjetoEnTabla(anuncio);
        guardarDatosLocalStorage(lista, 'lista');
        form.reset();
        document.getElementById('tabla-anuncios').scrollIntoView({behavior: "smooth", block: "start"});
        alert('El aviso se agregó con éxito');
    }else if(e.submitter.value == 'Modificar'){
        for (let index = 0; index < lista.length; index++) {
            if(lista[index].id == form.id.value){
                //modifico el array
                lista[index].titulo = form.titulo.value;
                lista[index].transaccion = form.transaccion.value;
                lista[index].descripcion = form.descripcion.value;
                lista[index].precio = form.precio.value;
                lista[index].num_puertas = form.puertas.value;
                lista[index].num_KMs = form.kms.value;
                lista[index].potencia = form.potencia.value;
                
                //modifico la tabla
                const $table = document.getElementById('tabla-anuncios');
                const rows = $table.querySelectorAll('tr');
                let newRow;

                for (let index = 0; index < rows.length; index++) {
                    if(rows[index].firstElementChild.innerText == form.id.value){
                        $table.deleteRow(index);
                        newRow = $table.insertRow(index);
                    }
                }

                const datos = Object.values(lista[index]);
                datos.forEach(element => {
                    const $td = document.createElement('td');
                    $td.innerText = element;
                    newRow.appendChild($td);
                });
                guardarDatosLocalStorage(lista, 'lista');
                break;
            }
        }
        document.getElementById('btn-guardar').value = 'Modificar';
        //window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('tabla-anuncios').scrollIntoView({behavior: "smooth", block: "start"});
        alert('El aviso se modificó con éxito');
    }
    limpiarFormulario();
}

function getNextId(lista){
    if(lista.length == 0) return 1;
    return Math.max.apply(null, lista.map(function(obj){return obj.id})) + 1;
}

function insertarObjetoEnTabla(obj){
    const $tr = document.createElement('tr');
    const datos = Object.values(obj);
    datos.forEach(element => {
        const $td = document.createElement('td');
        $td.innerText = element;
        $tr.appendChild($td);
    });
    const $tabla = document.getElementById('tabla-anuncios');
    $tabla.querySelector('tbody').appendChild($tr);    
}

function tableClickHandler(e){
    let id = e.target.parentElement.firstElementChild.innerText;
    const obj = findElementById(lista, id);
    
    const form = document.getElementById('form-anuncio');
    
    form.id.value = obj.id;
    form.titulo.value = obj.titulo;
    form.transaccion.value = obj.transaccion;
    form.descripcion.value = obj.descripcion;
    form.precio.value = obj.precio;
    form.puertas.value = obj.num_puertas;
    form.kms.value = obj.num_KMs;
    form.potencia.value = obj.potencia;
    
    document.getElementById('btn-guardar').value = 'Modificar';
    document.getElementById('form-anuncio').scrollIntoView({behavior: "smooth", block: "start"});
}

function findElementById(lista, id){
    return lista.find(obj => {
        return obj.id == id
    });
}

function limpiarFormulario(){
    document.getElementById('form-anuncio').reset();
    document.getElementById('btn-guardar').value = 'Guardar';
    document.getElementById('id-anuncio').value = '';
}

function deleteHandler(){
    let id = document.getElementById('id-anuncio').value;
    if(!id || id == ''){
        alert('Haga click sobre un anuncio para seleccionarlo y luego presione el botón "Borrar"');
    }else if(confirm('Está seguro que desea eliminar el elemento seleccionado?')){
        //borrar del array
        for (let index = 0; index < lista.length; index++) {
            if(lista[index].id == id){
                lista.splice(index, 1);
            }
        }
        
        //borrar de la tabla
        const $table = document.getElementById('tabla-anuncios');
        const rows = $table.querySelectorAll('tr');
    
        for (let index = 0; index < rows.length; index++) {
            if(rows[index].firstElementChild.innerText == id){
                $table.deleteRow(index);
            }
        }
        guardarDatosLocalStorage(lista, 'lista');
        limpiarFormulario();
        document.getElementById('tabla-anuncios').scrollIntoView({behavior: "smooth", block: "start"});
        alert('El aviso se eliminó con éxito');
    }
}


function iniciarTabla() {
    toggleSpinner();
    document.getElementById('div-tabla-anuncios').appendChild(crearTabla(lista));
    setTimeout(toggleSpinner, 3000);
}


function toggleSpinner(){
    const div = document.getElementById('spinner-container');
    const divAnuncios = document.getElementById('div-tabla-anuncios');
    
    if (div.style.display == 'none') {
        div.style.display = 'flex';
        divAnuncios.style.display = 'none';
    }
    else {
        div.style.display = 'none';
        divAnuncios.style.display = 'block';
    }
}
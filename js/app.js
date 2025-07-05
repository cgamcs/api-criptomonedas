const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objtBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
})

function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

    fetch(url)
        .then(respuesta => respuesta.json()) // Obtiene una respuesta
        .then(resultado => obtenerCriptomonedas(resultado.Data)) // Obtiene las criptomonedas
        .then(criptomonedas => selectCriptomonedas(criptomonedas)) // Entonces hacemos algo con las criptomonedas
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo

        const option = document.createElement('OPTION')
        option.value = Name
        option.textContent = FullName

        criptomonedasSelect.appendChild(option)
    })
}

function leerValor(e) {
    /*
        e.target.name se refiere al name del select
        es por eso que automaticamente puede insertar
        los valores al objeto en la moneda o criptomoneda
    */
    objtBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e) {
    e.preventDefault()

    // Validar
    const { moneda, criptomoneda } = objtBusqueda

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son necesarios')
        return
    }

    // Consultar el valor de la criptomoneda
    consultarAPI()
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.error')

    if(!existeAlerta) {
        const alerta = document.createElement('P')
        alerta.classList.add('error')

        alerta.textContent = mensaje

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objtBusqueda
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    fetch(url)
        .then(res => res.json())
        .then(res => mostrarCotizacion(res.DISPLAY[criptomoneda][moneda]))
}

function mostrarCotizacion(cotizacion) {
    limpiarHTML()

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion
    
    const precio = document.createElement('P')
    precio.classList.add('precio')
    precio.innerHTML = `El precio es de: <span>${PRICE}</span>`

    const precioAlto = document.createElement('P')
    precioAlto.innerHTML = `El precio mas alto es de: <span>${HIGHDAY}</span>`

    const precioBajo = document.createElement('P')
    precioBajo.innerHTML = `El precio mas bajo es de: <span>${LOWDAY}</span>`

    const ultimasHoras = document.createElement('P')
    ultimasHoras.innerHTML = `Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR} %</span>`

    const ultimaActualizacion = document.createElement('P')
    ultimaActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}</span>`

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimaActualizacion)

    resultado.las
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}
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

async function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`

    try {
        const respuesta = await fetch(url) // Obtiene una respuesta
        const resultado = await respuesta.json() // La transforma a JSON
        const criptomoneda = await obtenerCriptomonedas(resultado.Data) // Obtiene las criptomonedas
        selectCriptomonedas(criptomoneda) // Entonces hacemos algo con las criptomonedas
    } catch (error) {
        
    }
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

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son necesarios')
        return
    }

    // Consultar el valor de la criptomoneda
    consultarAPI()
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.error')

    if (!existeAlerta) {
        const alerta = document.createElement('P')
        alerta.classList.add('error')

        alerta.textContent = mensaje

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objtBusqueda
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner()

    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()

        mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda])
    } catch (error) {
        
    }
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
}

function mostrarSpinner() {
    limpiarHTML()

    const spinner = document.createElement('DIV')
    spinner.classList.add('sk-fading-circle')
    spinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `

    resultado.appendChild(spinner)
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}
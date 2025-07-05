const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')

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
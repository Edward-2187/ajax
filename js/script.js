const POKEMON_POR_PAGINA = 20;
let paginaActual = 1;
const TOTAL_POKEMON = 200; // puedes cambiarlo

// Obtener Pokémon por ID
async function obtenerPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    return res.json();
}

// Clase por tipo
function obtenerClaseTipo(tipo) {
    return "type-" + tipo;
}

// Cargar pokedex con paginación
async function cargarPokedex(pagina = 1) {
    paginaActual = pagina;

    const contenedor = document.getElementById("pokedex");
    contenedor.innerHTML = "";

    const inicio = (pagina - 1) * POKEMON_POR_PAGINA + 1;
    const fin = inicio + POKEMON_POR_PAGINA - 1;

    for (let i = inicio; i <= fin; i++) {
        const p = await obtenerPokemon(i);

        const tipoPrincipal = p.types[0].type.name;
        const card = document.createElement("div");
        card.classList.add("card", obtenerClaseTipo(tipoPrincipal));

        card.innerHTML = `
            <h2>${p.name}</h2>
            <img src="${p.sprites.front_default}" alt="${p.name}">
            <p><strong>Altura:</strong> ${p.height}</p>
            <p><strong>Peso:</strong> ${p.weight}</p>
            <p><strong>Tipo:</strong> ${p.types.map(t => t.type.name).join(", ")}</p>
        `;

        contenedor.appendChild(card);
    }

    generarPaginacion();
}

// Crear paginación
function generarPaginacion() {
    const paginas = Math.ceil(TOTAL_POKEMON / POKEMON_POR_PAGINA);
    const contenedor = document.getElementById("paginacion");
    contenedor.innerHTML = "";

    // Botón anterior
    contenedor.innerHTML += `<button onclick="cargarPokedex(${paginaActual - 1})" ${paginaActual === 1 ? "disabled" : ""}>«</button>`;

    for (let i = 1; i <= paginas; i++) {
        contenedor.innerHTML += `
            <button class="${i === paginaActual ? "activo" : ""}" onclick="cargarPokedex(${i})">${i}</button>
        `;
    }

    // Botón siguiente
    contenedor.innerHTML += `<button onclick="cargarPokedex(${paginaActual + 1})" ${paginaActual === paginas ? "disabled" : ""}>»</button>`;
}

// BUSCAR por texto
async function buscarPokemon() {
    const q = document.getElementById("buscarInput").value.toLowerCase().trim();
    if (q === "") return;

    const contenedor = document.getElementById("pokedex");
    contenedor.innerHTML = "";

    try {
        const p = await obtenerPokemon(q);

        const tipoPrincipal = p.types[0].type.name;

        const card = document.createElement("div");
        card.classList.add("card", obtenerClaseTipo(tipoPrincipal));

        card.innerHTML = `
            <h2>${p.name}</h2>
            <img src="${p.sprites.front_default}">
            <p><strong>Altura:</strong> ${p.height}</p>
            <p><strong>Peso:</strong> ${p.weight}</p>
            <p><strong>Tipo:</strong> ${p.types.map(t => t.type.name).join(", ")}</p>
        `;

        contenedor.appendChild(card);

        document.getElementById("paginacion").innerHTML = "";

    } catch {
        contenedor.innerHTML = "<h2>No encontrado</h2>";
    }
}

// Botón NOMBRE (pide nombre y busca)
function buscarPorNombre() {
    const nombre = prompt("Escribe el nombre del Pokémon:");
    if (nombre) {
        document.getElementById("buscarInput").value = nombre;
        buscarPokemon();
    }
}

cargarPokedex();
export function extractPokemonId(url) {
  const parts = url.split('/').filter(Boolean);
  return parts.pop();
}

export function getPokemonImageUrl(id) {
  const BASE_URL_IMAGE =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
  const pokemonImage = `${BASE_URL_IMAGE}/${id}.png`;
  return pokemonImage;
}

export function formatPokemonNumber() {}

export function capitalizeName(name) {
  return String(name).charAt(0).toUpperCase() + String(name).slice(1);
}

export function normalizeSearchTerm() {}

export function formatHeight(height) {}

export function formatWeight(weight) {}

export function translatePokemonType(type) {
  const spanishTranslations = {
    normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    grass: 'Planta',
    electric: 'Eléctrico',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    dark: 'Siniestro',
    steel: 'Acero',
    fairy: 'Hada',
  };
  return spanishTranslations[type] ?? type;
}

export function translateStatName(name) {
  const spanishTranslations = {
    hp: 'Puntos de Salud',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    speed: 'Velocidad',
  };
  return spanishTranslations[name] ?? name;
}

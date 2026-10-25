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
    grass: 'Planta',
    poison: 'Veneno',
    electric: 'Eléctrico',
    fire: 'Fuego',
    water: 'Agua',
  };
  return spanishTranslations[type] ?? type;
}

export function translateStatName(stats) {}

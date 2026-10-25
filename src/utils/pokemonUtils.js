import { translatationStatName } from '../data/translatationStatName';
import { translationPokemonType } from '../data/translationPokemonType';

export function extractPokemonId(url) {
  const parts = url.split('/').filter(Boolean);
  return parts.pop();
}

export function getPokemonImageUrl(id) {
  const BASE_URL_IMAGE =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
  const pokemonImage = `${BASE_URL_IMAGE}/${id}.png`;
  return pokemonImage;
}

export function formatPokemonNumber() {}

export function capitalizeName(name) {
  return String(name).charAt(0).toUpperCase() + String(name).slice(1);
}

export function normalizedSearch(search) {
  return search.trim().toLowerCase();
}

export function translatePokemonType(type) {
  const spanishTranslations = translationPokemonType;
  return spanishTranslations[type] ?? type;
}

export function translateStatName(name) {
  const spanishTranslations = translatationStatName;
  return spanishTranslations[name] ?? name;
}

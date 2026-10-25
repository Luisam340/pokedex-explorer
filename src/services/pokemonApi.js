const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonPage = async (limitPage, offsetPage) => {
  const url = `${BASE_URL}/pokemon?limit=${limitPage}&offset=${offsetPage}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error http ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const getPokemonByIdOrName = async (pokemonId) => {
  const url = `${BASE_URL}/pokemon/${pokemonId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error http ${response.status}`);
  }
  const data = await response.json();
  return data;
};

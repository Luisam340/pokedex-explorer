
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonCard from '../components/PokemonCard';
import useResponsive from '../hooks/useResponsive';
import {
  getPokemonByIdOrName,
  getPokemonPage,
} from '../services/pokemonApi';
import { colors } from '../theme/colors';
import {
  extractPokemonId,
  getPokemonImageUrl,
  normalizedSearch,
} from '../utils/pokemonUtils';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const isLoadingPokemonsRef = useRef(false);
  const searchRequestIdRef = useRef(0);

  const { columns, paddingHorizontal } = useResponsive();

  const clearSearch = () => {
    searchRequestIdRef.current += 1;
    setSearch('');
    setSearching(false);
    setSearchedPokemon(null);
    setSearchLoading(false);
    setSearchError('');
  };

  const searchPokemon = async () => {
    const pokemon = normalizedSearch(search);

    if (!pokemon) {
      clearSearch();
      return;
    }

    const requestId = ++searchRequestIdRef.current;

    setSearching(true);
    setSearchedPokemon(null);
    setSearchError('');
    setSearchLoading(true);

    try {
      const data = await getPokemonByIdOrName(pokemon);

      if (requestId !== searchRequestIdRef.current) return;

      setSearchedPokemon({
        id: data.id,
        name: data.name,
        imageUrl: getPokemonImageUrl(data.id),
      });
    } catch (err) {
      if (requestId !== searchRequestIdRef.current) return;

      const isNotFound =
        err?.status === 404 ||
        /\b404\b/.test(String(err?.message ?? ''));

      setSearchError(
        isNotFound
          ? 'Este Pokémon no existe. Intenta con otro nombre o número.'
          : 'No se pudo buscar el Pokémon. Revisa tu conexión.',
      );
    } finally {
      if (requestId === searchRequestIdRef.current) {
        setSearchLoading(false);
      }
    }
  };

  const loadPokemons = async (offset = 0) => {
    if (
      isLoadingPokemonsRef.current ||
      (offset > 0 && !hasMore)
    ) {
      return;
    }

    isLoadingPokemonsRef.current = true;
    setLoading(true);
    setListError('');

    try {
      const data = await getPokemonPage(20, offset);

      const formattedPokemons = data.results.map((pokemon) => {
        const id = extractPokemonId(pokemon.url);

        return {
          id,
          name: pokemon.name,
          imageUrl: getPokemonImageUrl(id),
        };
      });

      setHasMore(Boolean(data.next));

      setResults((previous) =>
        offset === 0
          ? formattedPokemons
          : [...previous, ...formattedPokemons],
      );
    } catch (err) {
      setListError(
        'No se pudieron cargar los Pokémon. Revisa tu conexión.',
      );
    } finally {
      isLoadingPokemonsRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons(0);
  }, []);

  const renderRetryButton = (onPress) => (
    <Pressable
      style={styles.retryButton}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons
        name="refresh"
        size={18}
        color={colors.pinkIvory}
      />
      <Text style={styles.retryButtonText}>Reintentar</Text>
    </Pressable>
  );

  const renderEmpty = () => {
    if (searching) {
      if (searchLoading) {
        return (
          <View style={styles.emptyContainer}>
            <ActivityIndicator
              size="large"
              color={colors.roseGold}
            />
            <Text style={styles.emptyText}>
              Buscando Pokémon...
            </Text>
          </View>
        );
      }

      if (searchError) {
        return (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-circle-outline"
              size={48}
              color={colors.roseGold}
            />
            <Text style={styles.emptyText}>
              {searchError}
            </Text>
            {renderRetryButton(searchPokemon)}
          </View>
        );
      }

      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No se encontraron resultados.
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator
            size="large"
            color={colors.roseGold}
          />
          <Text style={styles.emptyText}>
            Cargando Pokémon...
          </Text>
        </View>
      );
    }

    if (listError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {listError}
          </Text>
          {renderRetryButton(() => loadPokemons(0))}
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Aún no hay Pokémon para mostrar.
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (searching || results.length === 0) return null;

    if (loading) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator
            size="small"
            color={colors.roseGold}
          />
          <Text style={styles.footerText}>
            Cargando más Pokémon...
          </Text>
        </View>
      );
    }

    if (listError) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {listError}
          </Text>
          {renderRetryButton(() =>
            loadPokemons(results.length),
          )}
        </View>
      );
    }

    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            No hay más Pokémon por mostrar.
          </Text>
        </View>
      );
    }

    return null;
  };

  const displayedPokemons = searching
    ? searchedPokemon
      ? [searchedPokemon]
      : []
    : results;

  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokedex Explorer</Text>
        <Text style={styles.subtitle}>
          ¡Descubre los secretos de cada Pokémon ahora mismo!
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.roseGold}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Busca por nombre o número..."
          placeholderTextColor={colors.roseGold}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={searchPokemon}
        />

        {search.length > 0 && (
          <Pressable
            onPress={clearSearch}
            accessibilityLabel="Limpiar búsqueda"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.roseGold}
            />
          </Pressable>
        )}

        <Pressable
          style={styles.searchButton}
          onPress={searchPokemon}
          accessibilityRole="button"
          accessibilityLabel="Buscar Pokémon"
        >
          <Text style={styles.searchButtonText}>
            Buscar
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>
        {searching ? 'Resultado de búsqueda' : 'Explora Pokémon'}
      </Text>

      <FlatList
        key={columns}
        data={displayedPokemons}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            data={item}
            onPress={() =>
              navigation.navigate('PokemonDetailScreen', {
                pokemonId: item.id,
              })
            }
          />
        )}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={
          columns > 1 ? styles.listRow : undefined
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (
            !searching &&
            !isLoadingPokemonsRef.current &&
            hasMore &&
            !loading &&
            !listError
          ) {
            loadPokemons(results.length);
          }
        }}
        onEndReachedThreshold={0.4}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pinkIvory,
    paddingTop: 20,
  },
  header: {
    marginBottom: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.roseGold,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lavender,
    paddingHorizontal: 12,
    minHeight: 52,
    gap: 7,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: colors.primaryButton,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  searchButtonText: {
    color: colors.pinkIvory,
    fontWeight: '600',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  listRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 35,
    gap: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.roseGold,
    lineHeight: 21,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  footerText: {
    color: colors.roseGold,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primaryButton,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: colors.pinkIvory,
    fontSize: 14,
    fontWeight: '600',
  },
});

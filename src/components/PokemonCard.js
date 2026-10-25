import { Pressable, Image, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { capitalizeName } from "../utils/pokemonUtils";

export default function PokemonCard({ data, onPress }) {
  const pokemonName = capitalizeName(data.name);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: data.imageUrl }} style={styles.image} />
      <Text style={styles.number}>#{String(data.id).padStart(3, '0')}</Text>
      <Text style={styles.name}>{pokemonName}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    height: 200,
    backgroundColor: colors.pastelPink,
    borderRadius: 22,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dustyPink,
    shadowColor: colors.roseGold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  number: {
    fontSize: 13,
    color: colors.roseGold,
    marginTop: 8,
  },

  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
});

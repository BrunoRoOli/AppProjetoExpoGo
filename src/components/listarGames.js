import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ListarGames({ data, deleteItem, editItem }) {
  console.log(data); // debug

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Game: {data.nomeJogo}</Text>
      <Text style={styles.text}>Plataforma: {data.plataforma}</Text>
      <Text style={styles.text}>StatusGame: {data.statusJogo}</Text>
      <Text style={styles.text}>Nota: {data.nota}</Text>

      <View style={styles.item}>
        <TouchableOpacity onPress={() => editItem(data)} style={styles.button}>
          <FontAwesome name="pencil" color="blue" size={20} />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteItem(data.key)} style={styles.button}>
          <FontAwesome name="trash-o" color="#A52A2A" size={20} />
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 5,
    padding: 20,
    backgroundColor: '#D6E2E1',
    borderWidth: 0.5,
    borderColor: '#20232a'
  },
  text: {
    color: 'black',
    fontSize: 17,
    marginBottom: 5
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black'
  }
});

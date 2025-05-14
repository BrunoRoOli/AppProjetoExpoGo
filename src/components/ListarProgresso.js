import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text, Chip, Divider } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

export default function ListarProgresso({ data, deleteItem, editItem }) {
  // Função para confirmar exclusão
  const confirmarExclusao = (key) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este registro?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Excluir", 
          onPress: () => deleteItem(key),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>{data.nomeJogo}</Text>
        <Divider style={styles.divider} />
        
        <View style={styles.infoRow}>
          <FontAwesome name="clock-o" size={18} color="#0d9a9f" />
          <Text style={styles.text}>
            Tempo jogado: {data.tempoJogado} {data.tipoTempo}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={18} color="#0d9a9f" />
          <Text style={styles.text}>
            Data do registro: {data.dataRegistro}
          </Text>
        </View>
        
        {data.conquistas && data.conquistas.length > 0 && (
          <View style={styles.conquistasContainer}>
            <Text style={styles.subTitle}>Conquistas:</Text>
            <View style={styles.chipContainer}>
              {data.conquistas.map((conquista, index) => (
                <Chip key={index} style={styles.chip} icon="trophy">
                  {conquista}
                </Chip>
              ))}
            </View>
          </View>
        )}
        
        {data.observacoes && (
          <View style={styles.observacoesContainer}>
            <Text style={styles.subTitle}>Observações:</Text>
            <Text style={styles.observacoes}>{data.observacoes}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => editItem(data)} style={styles.button}>
            <FontAwesome name="pencil" color="#1565C0" size={20} />
            <Text style={[styles.buttonText, { color: '#1565C0' }]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => confirmarExclusao(data.key)} style={styles.button}>
            <FontAwesome name="trash-o" color="#A52A2A" size={20} />
            <Text style={[styles.buttonText, { color: '#A52A2A' }]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 0,
    borderRadius: 10,
    elevation: 2,
    maxWidth: '100%', // Garante que o card não extrapole a largura da tela
  },
  title: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subTitle: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5
  },
  divider: {
    marginBottom: 10,
    height: 1,
    backgroundColor: '#0d9a9f'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  text: {
    color: '#444',
    fontSize: 15,
    marginLeft: 8,
    flex: 1, // Permite que o texto se ajuste ao espaço disponível
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  chip: {
    margin: 2,
    backgroundColor: '#E3F2FD'
  },
  conquistasContainer: {
    marginTop: 5
  },
  observacoesContainer: {
    marginTop: 5
  },
  observacoes: {
    color: '#555',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16
  }
});
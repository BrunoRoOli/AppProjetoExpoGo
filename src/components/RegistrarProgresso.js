import React, { useState, useEffect } from 'react';
import { Keyboard, ScrollView, StyleSheet, View, ActivityIndicator, FlatList, Alert} from 'react-native';
import {
  Button,
  HelperText,
  IconButton,
  List,
  Provider as PaperProvider,
  RadioButton,
  Text,
  TextInput,
  Chip,
  Divider
} from 'react-native-paper';
import firebase from './services/connectionFirebase';
import ListarProgresso from './ListarProgresso';

const RegistrarProgresso = () => {
  // Estados para armazenar os valores dos inputs
  const [nomeJogo, setNomeJogo] = useState('');
  const [jogosDisponiveis, setJogosDisponiveis] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [tempoJogado, setTempoJogado] = useState('');
  const [tipoTempo, setTipoTempo] = useState('horas');
  const [conquistas, setConquistas] = useState('');
  const [listaConquistas, setListaConquistas] = useState([]);
  const [observacoes, setObservacoes] = useState('');
  const [dataRegistro, setDataRegistro] = useState(new Date().toLocaleDateString());
  const [key, setKey] = useState('');
  
  // Array dos registros a serem listados
  const [listaProgressos, setListaProgressos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarJogos, setMostrarJogos] = useState(false);

  // Estados para controlar os erros de validação
  const [errors, setErrors] = useState({
    nomeJogo: false,
    tempoJogado: false,
    dataRegistro: false,
  });

  // Carrega os jogos disponíveis do Firebase
  useEffect(() => {
    async function carregarJogos() {
      await firebase.database().ref('ListaGames').on('value', (snapshot) => {
        const jogos = [];
        snapshot.forEach((childItem) => {
          jogos.push({
            key: childItem.key,
            nome: childItem.val().nome,
          });
        });
        setJogosDisponiveis(jogos);
      });
    }
    
    // Carrega os registros de progresso
    async function carregarProgressos() {
      await firebase.database().ref('Progressos').on('value', (snapshot) => {
        setListaProgressos([]);
        
        snapshot.forEach((childItem) => {
          let data = {
            key: childItem.key,
            nomeJogo: childItem.val().nomeJogo,
            tempoJogado: childItem.val().tempoJogado,
            tipoTempo: childItem.val().tipoTempo,
            conquistas: childItem.val().conquistas,
            observacoes: childItem.val().observacoes,
            dataRegistro: childItem.val().dataRegistro
          };
          setListaProgressos(oldArray => [...oldArray, data].reverse());
        });
        setLoading(false);
      });
    }
    
    carregarJogos();
    carregarProgressos();
  }, []);

  // Adiciona uma conquista à lista
  const adicionarConquista = () => {
    if (conquistas.trim()) {
      setListaConquistas([...listaConquistas, conquistas.trim()]);
      setConquistas('');
    }
  };

  // Remove uma conquista da lista
  const removerConquista = (index) => {
    const novaLista = [...listaConquistas];
    novaLista.splice(index, 1);
    setListaConquistas(novaLista);
  };

  // Função para validar o formato da data (DD/MM/AAAA)
  const validarFormatoData = (data) => {
    // Regex para validar o formato DD/MM/AAAA
    const regexData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regexData.test(data);
  };

  // Valida formulário
  const validarFormulario = () => {
    const novoErros = {
      nomeJogo: !nomeJogo.trim(),
      tempoJogado: !tempoJogado.trim() || isNaN(Number(tempoJogado)),
      dataRegistro: !dataRegistro.trim() || !validarFormatoData(dataRegistro),
    };
    
    setErrors(novoErros);
    return !Object.values(novoErros).some(error => error);
  };

  // Limpa os campos do formulário
  const limparCampos = () => {
    setNomeJogo('');
    setJogoSelecionado(null);
    setTempoJogado('');
    setTipoTempo('horas');
    setConquistas('');
    setListaConquistas([]);
    setObservacoes('');
    setDataRegistro(new Date().toLocaleDateString());
    setKey('');
  };

  // Salva o registro de progresso
  async function salvarProgresso() {
    // Validar formulário antes de prosseguir
    if (!validarFormulario()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }
    
    // Atualiza registro existente
    if (key !== '') {
      firebase.database().ref('Progressos').child(key).update({
        nomeJogo: nomeJogo,
        tempoJogado: tempoJogado,
        tipoTempo: tipoTempo,
        conquistas: listaConquistas,
        observacoes: observacoes,
        dataRegistro: dataRegistro
      });
      
      Keyboard.dismiss();
      alert('Registro de progresso atualizado!');
      limparCampos();
      return;
    }
    
    // Cria novo registro
    let progressosRef = firebase.database().ref('Progressos');
    let chave = progressosRef.push().key;
    
    progressosRef.child(chave).set({
      nomeJogo: nomeJogo,
      tempoJogado: tempoJogado,
      tipoTempo: tipoTempo,
      conquistas: listaConquistas,
      observacoes: observacoes,
      dataRegistro: dataRegistro
    });
    
    Keyboard.dismiss();
    alert('Progresso registrado com sucesso!');
    limparCampos();
  }

  // Editar um registro existente
  function editarRegistro(data) {
    setKey(data.key);
    setNomeJogo(data.nomeJogo);
    setTempoJogado(data.tempoJogado);
    setTipoTempo(data.tipoTempo);
    setListaConquistas(data.conquistas || []);
    setObservacoes(data.observacoes || '');
    setDataRegistro(data.dataRegistro);
  }

  // Excluir um registro
  function excluirRegistro(key) {
    firebase.database().ref('Progressos').child(key).remove()
      .then(() => {
        const novosProgressos = listaProgressos.filter(item => item.key !== key);
        setListaProgressos(novosProgressos);
      });
    alert('Registro excluído!');
  }

  // Selecionar um jogo da lista
  const selecionarJogo = (jogo) => {
    setNomeJogo(jogo.nome);
    setJogoSelecionado(jogo);
    setMostrarJogos(false);
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Registrar Progresso no Jogo</Text>
        
        {/* Seleção do Jogo */}
        <View style={styles.jogoSelectorContainer}>
          <TextInput
            label="Nome do Jogo"
            value={nomeJogo}
            onChangeText={(text) => {
              setNomeJogo(text);
              if (errors.nomeJogo) setErrors({...errors, nomeJogo: false});
              setMostrarJogos(text.length > 0);
            }}
            style={styles.input}
            theme={{ colors: { primary: '#0d9a9f' } }}
            left={<TextInput.Icon icon="gamepad-variant" />}
            error={errors.nomeJogo}
          />
          {errors.nomeJogo && (
            <HelperText type="error" visible={errors.nomeJogo}>
              Nome do jogo é obrigatório
            </HelperText>
          )}
          
          {/* Lista de sugestões de jogos */}
          {mostrarJogos && (
            <View style={styles.sugestoes}>
              {jogosDisponiveis
                .filter(jogo => jogo.nome.toLowerCase().includes(nomeJogo.toLowerCase()))
                .map(jogo => (
                  <List.Item
                    key={jogo.key}
                    title={jogo.nome}
                    onPress={() => selecionarJogo(jogo)}
                    left={props => <List.Icon {...props} icon="gamepad" />}
                    style={styles.sugestaoItem}
                  />
                ))
              }
            </View>
          )}
        </View>
        
        {/* Tempo Jogado */}
        <View style={styles.tempoContainer}>
          <TextInput
            label="Tempo Jogado"
            value={tempoJogado}
            onChangeText={(text) => {
              // Aceita apenas números
              const numericValue = text.replace(/[^0-9]/g, '');
              setTempoJogado(numericValue);
              if (errors.tempoJogado) setErrors({...errors, tempoJogado: false});
            }}
            style={[styles.input, { flex: 2 }]}
            keyboardType="numeric"
            left={<TextInput.Icon icon="clock-outline" />}
            theme={{ colors: { primary: '#0d9a9f' } }}
            error={errors.tempoJogado}
          />
          
          <RadioButton.Group
            onValueChange={value => setTipoTempo(value)}
            value={tipoTempo}
          >
            <View style={styles.radioGroup}>
              <View style={styles.radioOption}>
                <RadioButton value="horas" theme={{ colors: { primary: '#0d9a9f' } }}/>
                <Text>Horas</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="minutos" theme={{ colors: { primary: '#0d9a9f' } }}/>
                <Text>Minutos</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        
        {errors.tempoJogado && (
          <HelperText type="error" visible={errors.tempoJogado}>
            Informe um tempo válido
          </HelperText>
        )}
        
        {/* Conquistas */}
        <Text style={styles.sectionTitle}>Conquistas Desbloqueadas</Text>
        <View style={styles.conquistasContainer}>
          <TextInput
            label="Adicionar Conquista"
            value={conquistas}
            onChangeText={setConquistas}
            style={[styles.input, { flex: 1 }]}
            theme={{ colors: { primary: '#0d9a9f' } }}
            left={<TextInput.Icon icon="trophy" />}
          />
          <IconButton
            icon="plus"
            size={24}
            onPress={adicionarConquista}
            theme={{ colors: { primary: '#0d9a9f' } }}
            style={styles.addButton}
          />
        </View>
        
        {/* Lista de Conquistas */}
        <View style={styles.chipContainer}>
          {listaConquistas.map((conquista, index) => (
            <Chip
              key={index}
              onClose={() => removerConquista(index)}
              style={styles.chip}
              theme={{ colors: { primary: '#0d9a9f' } }}
              icon="trophy"
            >
              {conquista}
            </Chip>
          ))}
        </View>
        
        {/* Observações */}
        <TextInput
          label="Observações"
          value={observacoes}
          onChangeText={setObservacoes}
          style={styles.input}
          multiline
          numberOfLines={4}
          left={<TextInput.Icon icon="text" />}
          theme={{ colors: { primary: '#0d9a9f' } }}
        />
        
        {/* Data do Registro (editável pelo usuário) */}
        <TextInput
          label="Data do Registro (DD/MM/AAAA)"
          value={dataRegistro}
          onChangeText={(text) => {
            setDataRegistro(text);
            if (errors.dataRegistro) setErrors({...errors, dataRegistro: false});
          }}
          placeholder="DD/MM/AAAA"
          style={styles.input}
          left={<TextInput.Icon icon="calendar" />}
          theme={{ colors: { primary: '#0d9a9f' } }}
          error={errors.dataRegistro}
        />
        {errors.dataRegistro && (
          <HelperText type="error" visible={errors.dataRegistro}>
            Informe uma data válida no formato DD/MM/AAAA
          </HelperText>
        )}
        
        {/* Botão Salvar */}
        <Button 
          mode="contained" 
          onPress={salvarProgresso}
          style={styles.button}
          icon="content-save"
          textColor="#ffffff"
        >
          Salvar Progresso
        </Button>
        {/* Lista de Progressos */}
      <View>
        {loading ? (
          <ActivityIndicator color="#141414" size={45} />
        ) : (
          <FlatList
            keyExtractor={item => item.key}
            data={listaProgressos}
            renderItem={({ item }) => (
              <ListarProgresso 
                data={item} 
                deleteItem={excluirRegistro}
                editItem={editarRegistro} 
              />
            )}
          />
        )}
      </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 8,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
    backgroundColor: '#0d9a9f',
  },
  tempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conquistasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    margin: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  jogoSelectorContainer: {
    position: 'relative',
    zIndex: 1,
  },
  sugestoes: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 4,
    zIndex: 10,
    maxHeight: 200,
  },
  sugestaoItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  }
});

export default RegistrarProgresso;
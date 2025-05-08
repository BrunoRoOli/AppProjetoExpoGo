import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, StyleSheet, View, ActivityIndicator, FlatList} from 'react-native';
import {
  Button,
  HelperText,
  IconButton,
  List,
  Provider as PaperProvider,
  RadioButton,
  Text,
  TextInput
} from 'react-native-paper';
import firebase from '../components/services/connectionFirebase';
import ListarGames from './listarGames';

const CriarJogo = () => {
  // Estados para armazenar os valores dos inputs
  const [nomeJogo, setNomeJogo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [genero, setGenero] = useState('');
  const [statusJogo, setStatusJogo] = useState('Jogando'); // Valor padrão corrigido
  const [nota, setNota] = useState('');
  const [key, setKey] = useState('');
  //array dos dados a serem listados
  const [ListaA, setListaA] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  

  useEffect(() => {
 
    async function dados() {
 
      await firebase.database().ref('ListaGames').on('value', (snapshot) => {
        setListaA([]);
 
        snapshot.forEach((chilItem) => {
          let data = {
            key: chilItem.key,
            nomeJogo: chilItem.val().nome,
            plataforma: chilItem.val().plataforma,
            genero: chilItem.val().genero,
            statusJogo: chilItem.val().statusgame,
            nota: chilItem.val().nota
          };
          setListaA(oldArray => [...oldArray, data].reverse());
        })
        setLoading(false);
      })
    }
    dados();
  }, []);

  

  async function handleInsert() {
    // Validar formulário antes de prosseguir
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }
    
    //editar dados (verificando se a chave não está vazia)
    if (key !== '') {
      firebase.database().ref('ListaGames').child(key).update({
        nome: nomeJogo,
        plataforma: plataforma,
        genero: genero,
        statusgame: statusJogo,
        nota: nota,
      })
      Keyboard.dismiss();
      alert('ListaGames Editada!');
      clearFields();
      setKey('');
      return;
    }
    
    //cadastrar dados (novo registro)
    let gamesRef = firebase.database().ref('ListaGames');
    let chave = gamesRef.push().key;
 
    gamesRef.child(chave).set({
        nome: nomeJogo,
        plataforma: plataforma,
        genero: genero,
        statusgame: statusJogo,
        nota: nota,
    });
    
    Keyboard.dismiss();
    alert('ListaGames Cadastrada!');
    clearFields();
  }
 
  function clearFields() {
    setNomeJogo('');
    setPlataforma('');
    setGenero('');
    setStatusJogo('Jogando'); // Reset para o valor padrão
    setNota('');
    setDataInicio('');
    setDataFim(''); // Corrigido: estava setNota('') repetido
  }

  function handleEdit(data){
    setKey(data.key),
    setNomeJogo(data.nome),
    setPlataforma(data.plataforma),
    setGenero(data.genero),
    setStatusJogo(data.statusgame),
    setNota(data.nota)
  }

  function handleDelete(key) {
    firebase.database().ref('ListaGames').child(key).remove()
      .then(() => {
        const findGames = ListaA.filter(item => item.key !== key)
        setListaA(findGames)
      })
    alert('Game Excluído!');
  }


  // Estados para controlar os erros de validação
  const [errors, setErrors] = useState({
    nomeJogo: false,
    plataforma: false,
    genero: false,
    statusJogo: false,
  });

  // Estado para controlar a expansão do acordeão
  const [expanded, setExpanded] = useState(false);
  
  // Função para formatar data com separadores
  const formatarDataComSeparadores = (texto) => {
    // Remove qualquer caractere que não seja número
    const numerosApenas = texto.replace(/\D/g, '');
    
    // Aplica a formatação DD/MM/AAAA
    if (numerosApenas.length <= 2) {
      return numerosApenas;
    } else if (numerosApenas.length <= 4) {
      return `${numerosApenas.slice(0, 2)}/${numerosApenas.slice(2)}`;
    } else {
      return `${numerosApenas.slice(0, 2)}/${numerosApenas.slice(2, 4)}/${numerosApenas.slice(4, 8)}`;
    }
  };
  
  // Função para lidar com mudanças nos campos de data
  const handleDataChange = (texto, setterFn) => {
    const dataFormatada = formatarDataComSeparadores(texto);
    setterFn(dataFormatada);
  };
  
  // Função para validar o formato da data
  const isValidDateFormat = (dateString) => {
    // Se a string estiver vazia, retorna true (não é obrigatório)
    if (!dateString) return true;
    
    // Regex para validar o formato DD/MM/AAAA
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(dateString);
  };
  
  // Função para validar todos os campos
  const validateForm = () => {
    const newErrors = {
      nomeJogo: !nomeJogo.trim(),
      plataforma: !plataforma.trim(),
      genero: !genero.trim(),
      statusJogo: !statusJogo,
    };
    
    setErrors(newErrors);
    
    // Retorna true se não houver erros
    return !Object.values(newErrors).some(error => error);
  };
  
  // Não precisamos mais desta função, já que handleInsert fará tudo
  // const handleSave = () => { ... }
  
  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Adicionar Novo Jogo</Text>
        
        {/* Input Nome do Jogo */}
        <TextInput
          label="Nome do Jogo"
          value={nomeJogo}
          onChangeText={(text) => {
            setNomeJogo(text);
            if (errors.nomeJogo) setErrors({...errors, nomeJogo: false});
          }}
          style={styles.input}
          left={<TextInput.Icon icon="gamepad-variant" />}
          error={errors.nomeJogo}
          ref={inputRef}
        />
        {errors.nomeJogo && (
          <HelperText type="error" visible={errors.nomeJogo}>
            Nome do jogo é obrigatório
          </HelperText>
        )}
        
        {/* Gênero do Jogo - Input simples */}
        <TextInput
          label="Gênero do Jogo"
          value={genero}
          onChangeText={(text) => {
            setGenero(text);
            if (errors.genero) setErrors({...errors, genero: false});
          }}
          style={styles.input}
          left={<TextInput.Icon icon="tag-multiple" />}
          placeholder="Ex: Ação, RPG, Aventura..."
          error={errors.genero}
          ref={inputRef}
        />
        {errors.genero && (
          <HelperText type="error" visible={errors.genero}>
            Gênero do jogo é obrigatório
          </HelperText>
        )}

        {/* Input Plataforma */}
        <TextInput
          label="Plataforma"
          value={plataforma}
          onChangeText={(text) => {
            setPlataforma(text);
            if (errors.plataforma) setErrors({...errors, plataforma: false});
          }}
          style={styles.input}
          left={<TextInput.Icon icon="devices" />}
          error={errors.plataforma}
          ref={inputRef}
        />
        {errors.plataforma && (
          <HelperText type="error" visible={errors.plataforma}>
            Plataforma é obrigatória
          </HelperText>
        )}
        
        {/* Acordeão Status do Jogo */}
        <List.Accordion
          title={statusJogo || "Status do Jogo"}
          left={props => <List.Icon {...props} icon="format-list-checks" />}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
          ref={inputRef}
          style={[styles.accordion, errors.statusJogo ? styles.errorBorder : null]}
        >
          <RadioButton.Group onValueChange={value => {
            setStatusJogo(value);
            if (errors.statusJogo) setErrors({...errors, statusJogo: false});
            setExpanded(false);
          }} value={statusJogo}>
            <RadioButton.Item label="Jogando" value="Jogando" />
            <RadioButton.Item label="Finalizado" value="Finalizado" />
            <RadioButton.Item label="Dropado" value="Dropado" />
          </RadioButton.Group>
        </List.Accordion>
        {errors.statusJogo && (
          <HelperText type="error" visible={errors.statusJogo}>
            Status do jogo é obrigatório
          </HelperText>
        )}
        
        {/* Seleção de Nota */}
        <Text style={styles.inputLabel}>Nota do Jogo</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton
              key={star}
              icon={nota >= star ? "star" : "star-outline"}
              color={nota >= star ? "#FFD700" : "#757575"}
              size={30}
              onPress={() => setNota(star)}
              ref={inputRef}
            />
          ))}
        </View>
        
        {/* Data de Início - Com formatação automática */}
        
        {/* Botão Salvar */}
        <Button 
          mode="contained" 
          onPress={handleInsert}
          style={styles.button}
          icon="content-save"
        >
          Salvar Jogo
        </Button>  
        <View>
      {loading ?
        (
<ActivityIndicator color="#141414" size={45} />
        ) :
        (
<FlatList
            keyExtractor={item => item.key}
            data={ListaA}
            renderItem={({ item }) => (
<ListarGames data={item} deleteItem={handleDelete}
                editItem={handleEdit} />
            )}
          />
        )
      }
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
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 8,
    color: '#757575',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  accordion: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  errorBorder: {
    borderColor: '#B00020',
    borderWidth: 1,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
    backgroundColor: '#0d9a9f',
  }
});

export default CriarJogo;
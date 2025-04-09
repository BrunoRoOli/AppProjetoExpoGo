import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { 
  TextInput, 
  List, 
  RadioButton, 
  Text, 
  Button, 
  IconButton,
  Provider as PaperProvider,
  Surface,
  TouchableRipple,
  HelperText
} from 'react-native-paper';

const CriarJogo = () => {
  // Estados para armazenar os valores dos inputs
  const [nomeJogo, setNomeJogo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [genero, setGenero] = useState('');
  const [statusJogo, setStatusJogo] = useState('');
  const [nota, setNota] = useState(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Estados para controlar os erros de validação
  const [errors, setErrors] = useState({
    nomeJogo: false,
    plataforma: false,
    genero: false,
    statusJogo: false,
    dataInicio: false,
    dataFim: false
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
      dataInicio: dataInicio !== '' && !isValidDateFormat(dataInicio),
      dataFim: dataFim !== '' && !isValidDateFormat(dataFim)
    };
    
    setErrors(newErrors);
    
    // Retorna true se não houver erros
    return !Object.values(newErrors).some(error => error);
  };
  
  // Função para salvar o formulário
  const handleSave = () => {
    // Validar o formulário
    if (!validateForm()) {
      console.log('Formulário contém erros. Por favor, corrija-os.');
      return;
    }
    
    const gameData = {
      nomeJogo,
      plataforma,
      genero,
      statusJogo,
      nota,
      dataInicio: dataInicio || null,
      dataFim: dataFim || null,
    };
    
    console.log('Dados do jogo:', gameData);
    // Aqui você poderia enviar esses dados para uma API ou salvar localmente
    
    // Resetar formulário após o envio
    setNomeJogo('');
    setPlataforma('');
    setGenero('');
    setStatusJogo('');
    setNota(null);
    setDataInicio('');
    setDataFim('');
    
    // Resetar erros
    setErrors({
      nomeJogo: false,
      plataforma: false,
      genero: false,
      statusJogo: false,
      dataInicio: false,
      dataFim: false
    });
  };
  
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
            />
          ))}
        </View>
        
        {/* Data de Início - Com formatação automática */}
        <TextInput
          label="Data de Início"
          value={dataInicio}
          onChangeText={(text) => {
            handleDataChange(text, setDataInicio);
            if (errors.dataInicio) setErrors({...errors, dataInicio: false});
          }}
          style={styles.input}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          left={<TextInput.Icon icon="calendar" />}
          error={errors.dataInicio}
        />
        {errors.dataInicio && (
          <HelperText type="error" visible={errors.dataInicio}>
            Formato de data inválido. Use DD/MM/AAAA
          </HelperText>
        )}
        
        {/* Data de Fim - Com formatação automática */}
        <TextInput
          label="Data de Fim"
          value={dataFim}
          onChangeText={(text) => {
            handleDataChange(text, setDataFim);
            if (errors.dataFim) setErrors({...errors, dataFim: false});
          }}
          style={styles.input}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
          left={<TextInput.Icon icon="calendar" />}
          error={errors.dataFim}
        />
        {errors.dataFim && (
          <HelperText type="error" visible={errors.dataFim}>
            Formato de data inválido. Use DD/MM/AAAA
          </HelperText>
        )}
        
        {/* Botão Salvar */}
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.button}
          icon="content-save"
        >
          Salvar Jogo
        </Button>
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
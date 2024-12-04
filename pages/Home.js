import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, LogBox, ScrollView } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage
import Aula from '../img/Aula.png';
import Config from '../img/Config.png';
import Expec from '../img/Expec.png';
import Foto from '../img/Foto.png';
import Map from '../img/Map.png';
import Obs from '../img/Obs.png';
import { supabase } from '../supabaseClient';

// Ignorar possíveis avisos irrelevantes de logs
// LogBox.ignoreLogs(['Warning: ...']); 

const Home = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null); // Estado para a imagem de perfil
  const [alunoId, setAlunoId] = useState(''); // Estado para armazenar o alunoId
  const [emailEducacional, setEmailEducacional] = useState('');
  const [nome, setNome] = useState('');
  const [freq, setFreq] = useState('');
  const [turma, setTurma] = useState('');

  useEffect(() => {
    // Busca o alunoId do AsyncStorage e os dados do Supabase
    const fetchAlunoData = async () => {
      try {
        // const storedAlunoId = await AsyncStorage.getItem('alunoId');
        const user_uuid = await AsyncStorage.getItem('user_uuid');
        if (user_uuid) {

          const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('aluno_id')
          .eq('id', user_uuid)
          .eq('tipo_usuario', 'aluno')
          .single();

          setAlunoId(profile.aluno_id);
          await AsyncStorage.setItem('alunoId', `${profile.aluno_id}`)

          const storedAlunoId = profile.aluno_id;
          const { data: faltasData, error: faltasError } = await supabase
            .from('faltas')
            .select('porcentagem_faltas')
            .eq('aluno_id', storedAlunoId);

          // console.log(faltasData, faltasError);


          // Recupera o email_educacional do banco de dados
          const { data, error } = await supabase
            .from('alunos')
            .select('email_educacional, nome, turma_id')
            .eq('id', storedAlunoId)
            .single(); // Garante que apenas um registro será retornado
          // console.log(faltas, data)
          const { data: turma, error: turmaErro} = await supabase
            .from('turmas')
            .select('nome_turma')
            .eq('id', data.turma_id)
            .single();

            
          if (error) {
            console.error('Erro ao buscar dados do aluno:', error);
          } else if (data && faltasData) {
            setEmailEducacional(data.email_educacional);
            setNome(data.nome);
            setFreq(parseFloat((100 - faltasData[0].porcentagem_faltas).toFixed(2)))
            setTurma(`${turma.nome_turma[0]}° Ano ${turma.nome_turma[1]}`)
            await AsyncStorage.setItem('turmaId', `${data.turma_id}`);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar o alunoId ou buscar dados do aluno:', error);
      }
    };

    fetchAlunoData();
  }, []);

  const handleProfilePicture = async () => {
    const options = [
      { text: 'Tirar Foto', onPress: handleTakePhoto },
      { text: 'Escolher da Galeria', onPress: handlePickImage },
      { text: 'Cancelar', style: 'cancel' }
    ];
    Alert.alert("Alterar Foto de Perfil", "Escolha uma opção:", options);
  };

  const handleImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets ? result.assets[0].uri : result.uri;
      setProfileImage(selectedImageUri);
    }
  };

  const handleTakePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      } else if (!result.canceled && result.uri) {
        setProfileImage(result.uri);
      }
    } else {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera para tirar uma foto.");
    }
  };

  const handlePickImage = async () => {
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryPermission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      } else if (!result.canceled && result.uri) {
        setProfileImage(result.uri);
      }
    } else {
      Alert.alert("Permissão negada", "Precisamos de acesso à galeria para escolher uma foto.");
    }
  };

  const handleNavigate = (option) => {
    navigation.navigate(option);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>SESI CE240 - Ferraz de Vasconcelos</Text>
      </View>

      <TouchableOpacity style={styles.profilePicture} onPress={handleProfilePicture}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileIcon} />
        ) : (
          <Image source={Foto} style={styles.profileIcon2} />
        )}
      </TouchableOpacity>
      <Text style={styles.profileName}>{nome}</Text>
      <Text style={styles.profileId}>{alunoId}</Text>
      <Text style={styles.profileAttendance}>% de Freq. - {freq}%</Text>

      <View style={styles.dataBox}>
        <Text style={styles.boxTitle}>Meus dados</Text>
        <Text style={styles.dataLabel}>E-mail</Text>
        <Text style={styles.dataInfo}>{emailEducacional}</Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.dataLabel}>Turma</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.dataInfo}>{turma}</Text>
        </View>
      </View>

      <View style={styles.dataBox}>
        <Text style={styles.boxTitle}>Aluno</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity style={[styles.iconBox]} onPress={() => handleNavigate('ObservacaoDosProfessores')}>
            <Image style={styles.iconImage} source={Obs} />
            <Text style={styles.iconText}>Obs. dos Professores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBox]} onPress={() => handleNavigate('MapeamentoDaSala')}>
            <Image style={styles.iconImage} source={Map} />
            <Text style={styles.iconText}>Mapeamento da Sala</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBox]} onPress={() => handleNavigate('Configuracoes')}>
            <Image style={styles.iconImage} source={Config} />
            <Text style={styles.iconText}>Configurações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconRowNoSpace}>
          <TouchableOpacity style={[styles.iconBox]} onPress={() => handleNavigate('ExpectativasDeAprendizagem')}>
            <Image style={styles.iconImage} source={Expec} />
            <Text style={styles.iconText}>Expec. de Aprendizagem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBox]} onPress={() => handleNavigate('AulasAnteriores')}>
            <Image style={styles.iconImage} source={Aula} />
            <Text style={styles.iconText}>Aulas Anteriores</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    backgroundColor: '#00C2FF',
  },
 
  headerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    width: 160,
    marginTop: -20
  },
  profilePicture: {
    marginTop: -60,
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 150, // Deixa a imagem do tamanho da caixa
    height: 150,
    borderRadius: 100, // Arredondar a imagem também
  },
  profileIcon2: {
    width: 50, // Deixa a imagem do tamanho da caixa
    height: 50,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileId: {
    fontSize: 14,
    color: '#666',
  },
  profileAttendance: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  dataBox: {
    width: '90%',
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
  },
  dataInfo: {
    fontSize: 14,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  changeButton: {
    color: '#1E90FF',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconRowNoSpace: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  iconBox: {
    width: '30%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 15,
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  iconText: {
    fontSize: 11,
    textAlign: 'center',
    width: '120%',
  },
});

export default Home;

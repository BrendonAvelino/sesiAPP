import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../supabaseClient'; // Importe o cliente Supabase

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        Alert.alert('Erro de Login', error.message);
        return;
      }

      if (data.session) {
        // Salvar o UUID no AsyncStorage
        const userId = data.user.id;
        await AsyncStorage.setItem('user_uuid', userId);
        Alert.alert('Login bem-sucedido!');
        navigation.navigate('Home'); // Navegar para a página "Home"
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry={!senhaVisivel}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
          <Icon
            name={senhaVisivel ? 'eye' : 'eye-off'}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00B8AE',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 30,
    },
    input: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      fontSize: 16,
      color: '#333',
    },
    passwordContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 0,
      paddingRight: 15,
    },
    passwordInput: {
      flex: 1,
      marginRight: 10,
    },
    button: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 8,
      marginTop: 20,
    },
    buttonText: {
      fontSize: 18,
      color: '#00B8AE',
    },
  });
  
  export default Login;
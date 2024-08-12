import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }

    try {
      const response = await fetch('http://api-mysql-s9hw.onrender.com/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to Home with the user's name
        navigation.navigate('Home', { userName: data.nombre });
      } else {
        Alert.alert('Error', data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la solicitud. Inténtelo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ImageBackground 
          source={require('../assets/background.png')}
          style={styles.backgroundImage} 
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
          </View>
        </ImageBackground>
      </View>
      <View style={styles.footer}>
        <View style={styles.centered}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar.</Text>
        </View>
        <TextInput
          label="Correo electrónico"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          theme={{ 
            colors: {
              primary: '#6200ee',
              background: '#f2f2f2' 
            },
            roundness: 10 
          }}
        />
        <TextInput
          label="Contraseña"
          style={styles.input}
          secureTextEntry
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          theme={{ 
            colors: {
              primary: '#6200ee', 
              background: '#f2f2f2'
            },
            roundness: 10 
          }}
        />
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.button}
          labelStyle={{ fontSize: 20 }}
          theme={{
            colors: {
              primary: '#5A6B79' 
            }
          }}
        >
          Iniciar sesión
        </Button>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('Register')} 
          labelStyle={styles.guestButton}
        >
          ¿Eres invitado?
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8ab6d6',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backgroundImage: {
    width: '100%',
    height: '150%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  centered: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#1C2120',
  },
  subtitle: {
    color: '#666',
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  guestButton: {
    fontSize: 20,
    color: '#5A6B79',
    textTransform: 'none',
  },
});

export default LoginScreen;

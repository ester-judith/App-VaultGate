import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const navigation = useNavigation();

  const handleGuestLogin = async () => {
    if (!username || !code) {
      Alert.alert('Error', 'Por favor, ingrese su usuario y código.');
      return;
    }

    try {
      const response = await fetch('http://api-mysql-s9hw.onrender.com/invitados/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreinv: username, codigoa: code }),
      });

      const data = await response.text();

      if (response.ok) {
        navigation.navigate('ControlG');
      } else {
        Alert.alert('Error', data || 'Código de invitado inválido');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la solicitud. Inténtelo de nuevo.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background2.jpg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Image
            source={require('../assets/arrow.png')}
            style={styles.backButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/guest.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Inicia sesión como invitado</Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconInput}>
            <Image
              source={require('../assets/email-icon.png')} 
              style={styles.icon}
            />
            <TextInput
              label="Usuario"
              style={styles.input}
              mode="outlined"
              value={username}
              onChangeText={setUsername}
              theme={{ 
                colors: {
                  primary: '#5A6B79',
                  background: '#ffffff'
                },
                roundness: 10
              }}
            />
          </View>
          <View style={styles.iconInput}>
            <Image
              source={require('../assets/lock-icon.png')} 
              style={styles.icon}
            />
            <TextInput
              label="Código"
              style={styles.input}
              secureTextEntry
              mode="outlined"
              value={code}
              onChangeText={setCode}
              theme={{ 
                colors: {
                  primary: '#5A6B79',
                  background: '#ffffff'
                },
                roundness: 10
              }}
            />
          </View>
        </View>
        <Button 
          mode="contained" 
          onPress={handleGuestLogin} 
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
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1, 
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C2120',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
  },
});

export default RegisterScreen;

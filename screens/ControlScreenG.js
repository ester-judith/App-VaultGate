import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ControlScreen = () => {
    const [garageStatus, setGarageStatus] = useState('cerrado');
    const navigation = useNavigation();

    const actualizarMotor = async () => {
        try {
            const response = await fetch('http://api-mysql-s9hw.onrender.com/puertaS/update-motor', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 1, motor: 'on' }), // Actualiza el motor a 'on'
            });

            const data = await response.text(); // Recibir el texto de la respuesta

            if (!response.ok) {
                throw new Error(data); // Lanzar error si la respuesta no es OK
            }

            console.log(data); // Puedes eliminar esto si no es necesario
        } catch (error) {
            console.error('Error al actualizar el motor:', error);
            Alert.alert('Error', 'Hubo un problema al actualizar el motor.');
        }
    };

    // Función para abrir el garaje
    const openGarage = () => {
        actualizarMotor(); // Actualiza el estado del motor a 'on'

        setGarageStatus('abierto'); // Cambia el estado del garaje a 'abierto'

        // Después de 5 segundos, cambia el estado del garaje a 'cerrado'
        setTimeout(() => {
            setGarageStatus('cerrado');
        }, 5000);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/background3.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Register')}>
                        <Image source={require('../assets/arrow.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/logo2.png')} style={styles.logo} />
                    </View>
                    <View style={styles.spacer} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.statusText}>El garaje está {garageStatus}</Text>
                    <Image source={require('../assets/garage.png')} style={styles.garageIcon} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={openGarage}>
                            <Image source={require('../assets/unlock.png')} style={styles.buttonIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}></View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    header: {
        width: '100%',
        height: 50,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    backButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 50,
        resizeMode: 'contain',
    },
    spacer: {
        width: 30,
        height: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#000',
    },
    garageIcon: {
        width: 170,
        height: 170, 
        marginBottom: 20,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 15, 
        overflow: 'hidden',
    },
    buttonIcon: {
        width: 120, 
        height: 120,
        resizeMode: 'contain',
    },
    footer: {
        width: '100%',
        height: 50,
        backgroundColor: '#ddd',
    },
});

export default ControlScreen;

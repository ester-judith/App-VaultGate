import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  DrawerLayoutAndroid,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';

// Constants for screen dimensions
const screenWidth = Dimensions.get('window').width;

// BarChart component to fetch and display data
const CustomBarChart = ({ apiUrl }) => {
  const [dataByDay, setDataByDay] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Process data to filter only the days with gate opening events
        const dayCounts = {};

        data.forEach((record) => {
          const date = new Date(record.fecha); // Ensure you have `fecha` field in your API
          const day = date.getDate();
          dayCounts[day] = (dayCounts[day] || 0) + 1; // Increment count for the respective day
        });

        const labels = Object.keys(dayCounts).map(day => `Day ${day}`);
        const dataValues = Object.values(dayCounts);

        setDataByDay({
          labels,
          datasets: [
            {
              data: dataValues,
              color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Optional
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <BarChart
      data={dataByDay}
      width={screenWidth - 40} // Width of the chart
      height={220}
      fromZero
      chartConfig={{
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0, // Optional, number of decimal places for the chart values
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: '#5A6B79',
        },
      }}
      verticalLabelRotation={30}
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const drawerRef = useRef(null);
  const route = useRoute();
  const userName = route.params?.userName || 'Mi cuenta';

  const [guests, setGuests] = useState([]);

  const openMenu = () => {
    drawerRef.current.openDrawer();
  };

  const closeMenu = () => {
    drawerRef.current.closeDrawer();
  };

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("https://api-mysql-s9hw.onrender.com/invitados");
        const data = await response.json();
        setGuests(data);
      } catch (error) {
        console.error('Error fetching guests:', error);
      }
    };

    fetchGuests();
  }, []);

  const renderGuestItem = ({ item }) => (
    <View style={styles.imageWithTitle}>
      <Image style={styles.userImage} source={require('../assets/icon.png')} />
      <Text style={styles.imageTitle}>{item.nombreinv}</Text>
    </View>
  );

  const menu = (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Control')}>
        <Text style={styles.menuButtonText}>Control</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.menuButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={() => menu}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
            <Text style={styles.menuIconText}>☰</Text>
          </TouchableOpacity>
          <Image style={styles.profileImage} source={require('../assets/icon.png')} />
          <Text style={styles.profileName}>{userName}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.weeklySummary}>Resumen Semanal</Text>
          <View style={styles.chartWrapper}>
            <CustomBarChart apiUrl="https://api-mysql-s9hw.onrender.com/apertura" />
          </View>
          <Text style={styles.chartTitle}>Invitados registrados</Text>
          <FlatList
            data={guests}
            renderItem={renderGuestItem}
            keyExtractor={(item) => item.idinvitado.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          />
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.footerText}></Text>
        </View>
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#BFC9C9',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuIconText: {
    fontSize: 28,
  },
  weeklySummary: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  chartWrapper: {
    marginVertical: 16, // Adds space above and below the chart
    alignItems: 'center', // Centers the chart horizontally
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageWithTitle: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  imageTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menu: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  menuButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuButtonText: {
    fontSize: 18,
  },
  footer: {
    width: '100%',
    height: 50,
    backgroundColor: '#BFC9C9',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default HomeScreen;

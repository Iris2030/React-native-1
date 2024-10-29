import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';

type Coords = {
  latitude: number;
  longitude: number
};

const GOOGLE_API_KEY = 'AIzaSyDqH68WOdeBYJ-LdTSfZMYem8ftgTV2rgE'; 

type MapScreenProps = {
  route: RouteProp<{ params: { location: string } }, 'params'>;
};

const MapScreen: React.FC<MapScreenProps> = ({ route }) => {
  const [location, setLocation] = useState<Coords | null>(null);

  const getCoordinates = async (address: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
      );
  
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        throw new Error("Address not found");
      }
    } catch (error) {
      console.error("Geocoding API error: ", error);
      throw error;
    }
  };

  useEffect(() => {
    const { location: address } = route.params; 
    getCoordinates(address).then(coords => {
      setLocation(coords);

    }).catch(error => {
      console.error("Error fetching coordinates:", error);
    });
  }, [route.params]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.mapStyle}
        region={{
          latitude: location ? location.latitude : 37.78825, 
          longitude: location ? location.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        onMapReady={() => console.log("Map is ready")}
        onRegionChange={() => console.log("Region change")}
      >
        {location && (
          <Marker
            title="Location from Post"
            description={route.params.location}  
            coordinate={location}
            onPress={() => console.log('marker is pressed')}
          />
        )}
      </MapView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
import React from 'react';
import MapView, {Polyline, Marker} from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import parkingSpaces from "./master.json"
import CreateMarkers from './createMarkers';

export default function App() {

  return (
    <View style={styles.container}>
          <MapView style={styles.map}
          initialRegion={{
            latitude: 45.765428893408995,
            longitude: 21.225671076923074,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0121,
          }}
          userInterfaceStyle='dark'
          showsUserLocation={true}
          showsTraffic={true}
          showsPointsOfInterest={false}
          minZoomLevel={13}
          maxZoomLevel={15}
          rotateEnabled={false}
          onPress={e => console.log(e.nativeEvent.coordinate)}
        >

          {parkingSpaces.map(({line}, {shortname}) => {
              return (
                  <Polyline 
                    coordinates={line}
                    strokeColor="yellow"
                    strokeWidth={15}
                    key={shortname}
                  />
              ); 
            })}

           {parkingSpaces.map(({streetname, lat, lng, shortname, emptyspots, price}) => {
              //console.log(shortname + " " + lat);
              return (
              <Marker
                style={{borderRadius: 20, backgroundColor:'yellow' , padding: 10 }}
                coordinate={{
                  latitude: lat,
                  longitude: lng
                }}
                key={shortname}
                title = {"parking markers"}
              >
                <View>
                  <Text style={{fontSize: 15, fontWeight: '800'}}>{emptyspots + " spots | RON " + price}</Text>
                </View>
              </Marker>
              ); 
            })}
          
          </MapView>


        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  }
});
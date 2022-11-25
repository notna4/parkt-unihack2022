import React from 'react';
import MapView, {Polyline, Marker} from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import Master from "./master.json"

export default function CreateMarkers() {
    console.log(Master[0].emptyspots);
    return (
        <View style={styles.container}>
            <Text>{Master[0].emptyspots}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 150,
    height: 100,
    backgroundColor: 'red'
  }
});
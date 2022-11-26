import React, { useCallback, useMemo, useRef, useState } from 'react';
import MapView, {Polyline, Marker} from 'react-native-maps';
import { StyleSheet, View, Text, Button  } from 'react-native';
import parkingSpaces from "./master.json";
import parkingInfo from "./parkingInfo.json";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

function FreeSpots({data}) {
    //console.log(data);
    let aux = [];
    let counter = [one, two, three, four, five, six, seven, eight, nine, ten];

    return(
        <View>
          {parkingInfo.map(({isemptyspot, endTime, shortname}) => {

            if(shortname === data) {
                for(let i = 0; i < 10; i++) {
                  console.log({isemptyspot}.isemptyspot[i].counter[i]);
                  //console.log(aux[i]);
                  // return (
                  //     <View>
                  //       <Text>da</Text>
                  //     </View>
                  // ); 
                }
            }
          })}
        </View>
      
      // <View style={styles.containerModal}>
      //   <Text style={{fontWeight: "800", fontSize: 16}}>{data}</Text>
      // </View>
    );
}

export default function App() {
  const [short, setShort] = useState(null);
  const [emptySpots, setEmptySpots] = useState([]);

  const bottomSheetModalRef = useRef(null);
  
  const snapPoints = ["60%"];

  function handlePresentModal(short) {
    bottomSheetModalRef.current?.present();
    setShort(short);
  }

   

  return (
    <BottomSheetModalProvider>
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
            //onPress={e => console.log(e.nativeEvent.coordinate)}
          >

            {parkingSpaces.map(({line, shortname}) => {
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
                  onPress={e => handlePresentModal(shortname)}
                >
                  <View>
                    <Text style={{fontSize: 15, fontWeight: '800'}}>{emptyspots + " spots | RON " + price}</Text>
                  </View>
                </Marker>
                ); 
              })}
            
            </MapView>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              backgroundStyle={styles.modal}
            >
              <FreeSpots 
                data={short}
              />
            </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
   map: {
    width: '100%',
    height: '100%',
  },
  modal: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    borderRadius: 45,
    backgroundColor: 'rgba(68, 99, 107, 1)',
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center"
  },
  containerModal: {
    backgroundColor: "rgba(40, 58, 63, 0.33)",
    padding: 20,
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 20
  }
});
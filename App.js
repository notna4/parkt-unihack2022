import React, { useCallback, useMemo, useRef, useState } from 'react';
import MapView, {Polyline, Marker} from 'react-native-maps';
import { StyleSheet, View, Text, Button, ScrollView, TouchableOpacity  } from 'react-native';
import parkingSpaces from "./master.json";
import caltor1 from "./Parking/caltor1.json";
import parkingInfo from "./parkingInfo.json";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RadioButtonRN from 'radio-buttons-react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications


function FreeSpots({data}) {

    const [park, setPark] = useState('Spot');
    const [numberHours, setNumberHours] = useState(1);
    

    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes

    const [currHour, setCurrHour] = useState(hours);
    const [currMin, setCurrMin] = useState(min);

    const [finHour, setFinHour] = useState(hours+1);
    const [finMin, setFinMin] = useState(min);


    return (
      <View style={styles.scrollView}>
        {parkingInfo.map(({isemptyspot, shortname, zona, name, price, endTime}) => {
          if(shortname === data) {
            //console.log(zona + " " + name);
            var states = []
            var times = [];
            var index = [];
            for(let i = 0; i < 10; i++) {
              if(Object.values(isemptyspot[i]) == 0) {
                states[i]={label: "Spot " + (i+1)};
              }
              else {
                times[i] = Object.values(endTime[i]);
              }
              index[i] = i+1;
              //console.log(states);
            }
            return (
              <View>
                <View style={styles.containerModal}>
                  <View style={{backgroundColor: `${zona.toLowerCase()}`, padding: 10, borderRadius: 20}}>
                    <Text style={{fontWeight: '800', fontSize: 17, color: `${zona.toLowerCase()}`==="yellow" ? 'black' : 'white'}}>{zona} Zone</Text>
                  </View>
                  <View style={{ padding: 10, borderRadius: 20}}>
                    <Text style={{fontWeight: '800', fontSize: 17, color: 'white'}}>{name}</Text>
                  </View>
                </View>
                <View style={styles.priceTag}>
                  <View style={{backgroundColor: "rgba(40, 58, 63, 0.33)", padding: 10, borderRadius: 20, paddingLeft: 30, paddingRight: 30}}>
                    <Text style={{fontWeight: '800', fontSize: 17, color: 'white'}}>{price} RON/hour</Text>
                  </View>
                </View>
                <View style={{backgroundColor: 'rrgba(40, 58, 63, 0.33)', display: 'flex', flexDirection: 'column', margin: 10, borderRadius: 40, padding: 10}}>
                  <Text style={{fontSize: 17, fontWeight: '800', color: 'white', marginBottom: 10, padding: 10}}>Select your parking spot</Text>
                  <View style={styles.empSpotsContainerBig}>
                      <View style={styles.empSpotsContainer}>
                        {/* <Button style={isSelected === type ? styles.activeButton : styles.button} onPress={() => buttonHandler()} title={"Spot " + (i+1).toString()} /> */}
                        <RadioButtonRN
                            key={states}
                            style={{fontWeight: "bold", borderRadius: 30}}
                            textStyle={{fontWeight: "800", color: 'white'}}
                            boxActiveBgColor="rgba(0, 0, 0, 0.33)"
                            boxDeactiveBgColor="rgba(27, 71, 83, 0.33)"
                            data={states}
                            selectedBtn={(e) => {
                              setPark(e.label);
                            }}
                          />
                      </View>
                  </View>
                </View>
                <View style={{backgroundColor: 'rrgba(40, 58, 63, 0.33)', display: 'flex', flexDirection: 'column', margin: 10, borderRadius: 40, padding: 10}}>
                  <Text style={{fontSize: 17, fontWeight: '800', color: 'white', marginBottom: 10, padding: 10}}>🚨 Expiring soon 🚨</Text>
                  <View style={styles.empSpotsContainerBig}>
                    {times.map((item, i) => {
                      return (
                        <View style={styles.expContainer}>
                          <Text style={styles.empSpots}>Spot {i+1} expires at {item}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.containerModalHours}>
                  <View style={{ borderRadius: 20}}>
                    <TouchableOpacity style={{backgroundColor: "rgba(11, 22, 25, 0.33)", paddingRight: 20, paddingLeft: 20, borderRadius: 20, display: 'flex', justifyContent: 'center', alignContent: 'center'}} onPress={() => {
                      setNumberHours(numberHours - 1);
                      setFinHour(finHour - 1);
                    }}>
                      <Text style={{fontSize: 35, fontWeight: "800", textAlign: 'center', textAlignVertical: 'center'}}>-</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{backgroundColor: "rgba(11, 22, 25, 0.33)", padding: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 20, display: 'flex', justifyContent: 'center'}}>
                    <Text style={{fontWeight: '800', fontSize: 17, color: 'white'}}>{numberHours} hours</Text>
                  </View>
                  <View style={{ borderRadius: 20}}>
                    <TouchableOpacity style={{backgroundColor: "rgba(11, 22, 25, 0.33)", paddingRight: 20, paddingLeft: 20, borderRadius: 20}} onPress={() => {
                      setNumberHours(numberHours + 1);
                      setFinHour(finHour + 1);
                    }}>
                      <Text style={{fontSize: 35, fontWeight: "800", textAlign: 'center', textAlignVertical: 'center'}}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.containerModalFinal}>
                  <View style={{backgroundColor: "#3430DE", padding: 10, borderRadius: 20, display: "flex", justifyContent: "center", alignContent: "center"}}>
                    <Text style={{fontWeight: '800', fontSize: 17, color: 'white', textAlign: "center", textAlignVertical: "center"}}>{numberHours*price} RON</Text>
                  </View>
                  <View style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
                    <Text style={{fontWeight: "800", fontSize: 15, color: 'gray'}}>From {currHour}:{currMin}</Text>
                    <Text style={{fontWeight: "800", fontSize: 15, color: 'white'}}>To {finHour}:{finMin}</Text>
                  </View>
                  <View style={{ borderRadius: 20 }}>
                    <TouchableOpacity title={"Park at " + park} style={{backgroundColor: "#3430DE", padding: 10, borderRadius: 20, display: "flex", justifyContent: "center", alignContent: "center"}} >
                      <Text style={{fontWeight: '800', fontSize: 17, color: 'white', textAlign: "center", textAlignVertical: "center"}} onPress={() => {
                        setPark("| Done! ✔️")
                      }}>Park at {park}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ); 
          }
        })}
      </View>
    );


}

export default function App() {
  const [short, setShort] = useState(null);
  const [emptySpots, setEmptySpots] = useState([]);
  const [isSelected, setIsSelected] = useState(''); 
  const [goRegion, setGoRegion] = useState({});

  const bottomSheetModalRef = useRef(null);
  
  const snapPoints = ["60%", "90%"];

  function handlePresentModal(short) {
    bottomSheetModalRef.current?.present();
    setShort(short);
  }

   

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
            <MapView style={styles.map}
            ref = {(mapView) => { _mapView = mapView; }}
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

            {parkingSpaces.map(({line, shortname, zona}) => {
                return (
                    <Polyline 
                      coordinates={line}
                      strokeColor={zona.toLowerCase()}
                      strokeWidth={15}
                      key={shortname}
                    />
                ); 
              })}

            {parkingSpaces.map(({streetname, lat, lng, shortname, emptyspots, price, zona}) => {
                //console.log(shortname + " " + lat);
                return (
                <Marker
                  style={{borderRadius: 20, backgroundColor: `${zona.toLowerCase()}` , padding: 10 }}
                  coordinate={{
                    latitude: lat,
                    longitude: lng
                  }}
                  key={shortname}
                  onPress={() => {
                    const coordinate = {
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.0022,
                      longitudeDelta: 0.0121
                    }
                    handlePresentModal(shortname);
                    _mapView.animateToRegion({
                      latitude: lat-0.005,
                      longitude: lng+0.0005,
                      latitudeDelta: 0.0022,
                      longitudeDelta: 0.0121,

                    }, 1000)
                  }}
                >
                  <View>
                    <Text style={{fontSize: 15, fontWeight: '800', color: `${zona.toLowerCase()}`==="yellow" ? 'black' : 'white'}}>{emptyspots + " spots | RON " + price}</Text>
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
              <ScrollView>
                <FreeSpots 
                  data={short}
                />
              </ScrollView>
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
    justifyContent: "center",
  },
  containerModal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "rgba(40, 58, 63, 0.33)",
    padding: 15,
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 60
  },
  priceTag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5,
    marginLeft: 60,
    marginRight: 60,
    borderRadius: 60
  },
  empSpotsContainerBig: {
    display: 'flex',
    flexDirection: 'column',
  },
  empSpotsContainer: {
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  empSpots: {
    fontSize: 16,
    fontWeight: "700",
    padding: 15,
    color: 'white',
    textAlign: "center"
  },
  expContainer: {
    backgroundColor: "rgba(40, 58, 63, 0.33)",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: "center"
  },
  containerModalHours: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: "rgba(40, 58, 63, 0.33)",
    padding: 15,
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 60
  },
  containerModalFinal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: "rgba(40, 58, 63, 0.33)",
    padding: 15,
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 100,
    borderRadius: 60
  }
});
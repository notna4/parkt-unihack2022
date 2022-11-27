import 'react-native-gesture-handler';
import React, { useCallback, useMemo, useRef, useState, useEffect, Fragment } from 'react';
import MapView, {Polyline, Marker} from 'react-native-maps';
import { StyleSheet, View, Text, Button, ScrollView, TouchableOpacity, ViewStyle, TextInput  } from 'react-native';
import parkingSpaces from "./master.json";
import parkingInfo from "./parkingInfo.json";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RadioButtonRN from 'radio-buttons-react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
import Cyclists from "./Cyclists.json";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';


function FreeSpots({data, refs, navigation}) {
    console.log("data " + data);

    var one = 0;

    const [park, setPark] = useState('Select Spot');
    const [auxPark, setAuxPark] = useState('Select Spot');
    const [numberHours, setNumberHours] = useState(1);
    

    var hours = new Date().getHours(); //Current Hours
    var mymin = new Date().getMinutes(); //Current Minutes
    var min = ("0" + mymin).slice(-2);
    

    const [currHour, setCurrHour] = useState(hours);
    const [currMin, setCurrMin] = useState(min);

    const [finHour, setFinHour] = useState(hours+1);
    const [finMin, setFinMin] = useState(min);
    
    const [text, setText] = useState('TM22UNI');

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
                <View style={{borderColor:'white',borderBottomWidth:5, padding: 10, marginRight: 30, marginLeft: 30, borderRadius: 20, backgroundColor: "rgba(40, 58, 63, 0.33)"}}>
                  <TextInput defaultValue={text} onChangeText={newText => setText(newText)} style={{fontSize: 20, color:"white", fontWeight:"500", textAlign: "center", paddingRight:30, paddingLeft: 30}}/>
                </View>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                  <View style={styles.priceTag}>
                    <View style={{backgroundColor: "rgba(40, 58, 63, 0.33)", padding: 10, borderRadius: 20, paddingLeft: 30, paddingRight: 30, marginRight: 10}}>
                      <Text style={{fontWeight: '800', fontSize: 17, color: 'white'}}>{price} RON/hour</Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceTag}>
                    <View style={{backgroundColor: "rgba(108, 140, 243, 0.8)", padding: 10, borderRadius: 20, paddingLeft: 30, paddingRight: 30}}>
                      {parkingSpaces.map(({shortname, lat, lng, streetname}) => {
                                if(shortname === data) {
                                  if(one == 0) {
                                    one = 1;
                                    console.log(shortname);
                                    return (
                                      <TouchableOpacity onPress={() => {
                                          const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                                          const latLng = `${lat},${lng}`;
                                          const label = `${streetname}`;
                                          const url = Platform.select({
                                            ios: `${scheme}${label}@${latLng}`,
                                            android: `${scheme}${latLng}(${label})`
                                          });

                                              
                                          Linking.openURL(url);
                                        }}>
                                        <Text style={{fontSize: 17, fontWeight: "600", color: "white"}}>See On Maps</Text>
                                      </TouchableOpacity>
                                    );
                                  }
                                }
                            })}
                    </View>
                  </View>
                </View>
                <View style={{backgroundColor: 'rrgba(40, 58, 63, 0.33)', display: 'flex', flexDirection: 'column', margin: 10, borderRadius: 40, padding: 10}}>
                  <Text style={{fontSize: 17, fontWeight: '800', color: 'white', marginBottom: 10, padding: 10}}>Select your parking spot</Text>
                  <View style={styles.empSpotsContainerBig}>
                      <View style={styles.empSpotsContainer}>
                        {/* <Button style={isSelected === type ? styles.activeButton : styles.button} onPress={() => buttonHandler()} title={"Spot " + (i+1).toString()} /> */}
                        <RadioButtonRN
                            style={{fontWeight: "bold", borderRadius: 30}}
                            textStyle={{fontWeight: "800", color: 'white'}}
                            boxActiveBgColor="rgba(0, 0, 0, 0.33)"
                            boxDeactiveBgColor="rgba(27, 71, 83, 0.33)"
                            data={states}
                            selectedBtn={(e) => {
                              setPark("Park at " + e.label);
                              setAuxPark("Park at " + e.label);
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
                    <TouchableOpacity disabled={`${numberHours}` == 1 ? true : false} style={{backgroundColor: "rgba(11, 22, 25, 0.33)", paddingRight: 20, paddingLeft: 20, borderRadius: 20, display: 'flex', justifyContent: 'center', alignContent: 'center'}} onPress={() => {
                      setNumberHours(numberHours - 1);
                      setFinHour(finHour - 1);
                      if(finHour-1 < 20) {
                        setPark(auxPark);
                      }
                    }}>
                      <Text style={{fontSize: 35, fontWeight: "800", textAlign: 'center', textAlignVertical: 'center' }}>-</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{backgroundColor: "rgba(11, 22, 25, 0.33)", padding: 5, paddingRight: 20, paddingLeft: 20, borderRadius: 20, display: 'flex', justifyContent: 'center'}}>
                    <Text style={{fontWeight: '800', fontSize: 17, color: 'white'}}>{numberHours} hours</Text>
                  </View>
                  <View style={{ borderRadius: 20}}>
                    <TouchableOpacity disabled={`${finHour}` == 20 ? true : false} style={{backgroundColor: "rgba(11, 22, 25, 0.33)", paddingRight: 20, paddingLeft: 20, borderRadius: 20}} onPress={() => {
                      setNumberHours(numberHours + 1);
                      setFinHour(finHour + 1);
                      if(finHour+1 >= 20) {
                        setPark("Until 20:00");
                      }
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
                    <TouchableOpacity disabled={`${park}`==="Until 20:00" ? true : false} style={{backgroundColor: `${park}`==="Until 20:00" ? "red" : "#3430DE", padding: 10, borderRadius: 20, display: "flex", justifyContent: "center", alignContent: "center"}} >
                      <Text style={{fontWeight: '800', fontSize: 17, color: 'white', textAlign: "center", textAlignVertical: "center"}} onPress={() => {
                        setPark("Parked!")
                        if(park === "Select Spot" || park === "Choose Spot") {
                          setPark("Choose Spot");
                        }
                        else {
                          setPark("Parked");
                          navigation.navigate('Details');
                        }
                      }}>{park}</Text>
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


function HomeScreen({navigation}) {
  const [short, setShort] = useState(null);
  const [emptySpots, setEmptySpots] = useState([]);
  const [isSelected, setIsSelected] = useState(' '); 
  const [goRegion, setGoRegion] = useState({});
  const [bike, setBike] = useState('B');

  const bottomSheetModalRef = useRef(null);
  
  const snapPoints = ["15%", "60%"];

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

              {Cyclists.map(({streetname, lat, lng, totalspots}) => {
                //console.log(shortname + " " + lat);
                var on = 0;
                return (
                <Marker
                  style={{borderRadius: 20, backgroundColor: "white", padding: 10 }}
                  coordinate={{
                    latitude: lat,
                    longitude: lng
                  }}
                  key={streetname}
                  onPress={() => {
                    const coordinate = {
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.0022,
                      longitudeDelta: 0.0121
                    }
                    _mapView.animateToRegion({
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.0022,
                      longitudeDelta: 0.0121,

                    }, 1000)
                  }}
                >
                  <View>
                    <Text style={{fontSize: 10, fontWeight: '800', color: "black", padding: 2}}>{streetname + " | " + totalspots + " spots"}</Text>
                  </View>
                </Marker>
                ); 
              })}
            
            </MapView>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={styles.modal}
            >
              <ScrollView>
                <FreeSpots 
                  data={short}
                  refs={bottomSheetModalRef}
                  navigation={navigation}
                />
              </ScrollView>
            </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(40, 58, 63, 0.63)" }}>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
      <Text style={{color: "white", fontSize: 20, fontWeight: "800"}}>🎉 You parked! 🎉</Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Parkt">
        <Stack.Screen name="PARKT" component={HomeScreen}
          options={{
            title: 'PARKT',
            headerStyle: {
              backgroundColor: 'rgba(68, 99, 107, 1)',
              borderRadius: 20,
              height: 100,
              background: 'transparent'
            },
            headerTransparent: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: '900',
              backgroundColor: 'rgba(68, 99, 107, 1)',
              padding: 10,
              borderRadius: 20,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 20,
              overflow: "hidden"
            },
          }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} 
          options={{
            title: 'PARKT',
            headerStyle: {
              backgroundColor: 'rgba(68, 99, 107, 1)',
              borderRadius: 20,
              height: 100,
              background: 'transparent'
            },
            headerTransparent: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: '900',
              backgroundColor: 'rgba(68, 99, 107, 1)',
              padding: 10,
              borderRadius: 20,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: 20,
              overflow: "hidden"
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

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
    marginLeft: 0,
    marginRight: 0,
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
    marginBottom: 10
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
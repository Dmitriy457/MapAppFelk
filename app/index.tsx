import { useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from 'expo-router';
const myPoint = {
  latitude: 58.0102,
  longitude: 56.2283,
  latitudeDelta: 0.01,
  longitudeDelta: 0.005
}

function getMyStart () {
  return myPoint
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  },
});

export default function App() {
  const [markers, setMarkers] = useState([])

  const handleLongPress = (e) => {
    const coordinate = e.nativeEvent.coordinate; // Извлекаем координаты из события долгого нажатия
    const existingMarkerIndex = markers.findIndex(marker =>
      marker.latitude === coordinate.latitude && marker.longitude === coordinate.longitude
    ); // Проверяем, существует ли уже маркер с такими координатами
    if (existingMarkerIndex !== -1) {
      setMarkers(markers.filter((_, index) => index !== existingMarkerIndex)); // Если маркер существует, удаляем его из массива
    } else {
      setMarkers([...markers, coordinate]); // Если маркер не существует, добавляем новый маркер
    }
  };

  const router = useRouter()

  const handleMarkerPress = (coordinate) => {
    router.push(`/marker/${encodeURIComponent(JSON.stringify(coordinate))}`); // используем в качестве id json c координатами и переходим на экран маркера
  };

  const markersRendered = markers.map((elem, idx) => (
    <Marker coordinate={elem} key={idx}
      onPress={() => handleMarkerPress(elem)}
    />
  ));

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        initialRegion={getMyStart()}
        onLongPress={handleLongPress}
      >
        {markersRendered}
      </MapView>
    </View>
  );
}
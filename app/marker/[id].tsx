import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'; // для хранения изображений 
import ImageList from '@/components/ImageList'

export default function MarkerDetails() {
  const { id } = useLocalSearchParams();
  const coordinate = JSON.parse(decodeURIComponent(id));
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const savedImages = await AsyncStorage.getItem(`images_${coordinate.latitude}_${coordinate.longitude}`);
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    };
    loadImages();
  }, [coordinate]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images, result.assets[0].uri];
      setImages(newImages);
      await AsyncStorage.setItem(`images_${coordinate.latitude}_${coordinate.longitude}`, JSON.stringify(newImages));
    } else {
      alert('Вы не выбрали изображение');
    }
  };

  
  const handleLongPress = async (uri) => {
    const newImages = images.filter(image => image !== uri);
    setImages(newImages);
    await AsyncStorage.setItem(`images_${coordinate.latitude}_${coordinate.longitude}`, JSON.stringify(newImages));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.boldText}>Координаты маркера:</Text> {coordinate.latitude} {coordinate.longitude}
      </Text>

      <ImageList images={images} onLongPress={handleLongPress} />

      <TouchableOpacity style={styles.button} onPress={pickImageAsync}>
        <Text style={styles.buttonText}>Добавить изображение</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  button: {
    marginTop: 20,
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#00ff0055',
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
  }
});
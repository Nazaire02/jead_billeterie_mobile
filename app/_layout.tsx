import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';

import { Button, View, StyleSheet, SafeAreaView, Alert, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Overlay } from './scanner/Overlay';
import { ErrorIcon, SuccessIcon } from '@/components/Button';

export default function RootLayout() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScan, setHasScan] = useState(false);
  const [scanValue, setScanValue] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);

  const startScanning = () => {
    setScanValue("");
    if (permission?.status === 'denied' && !permission?.canAskAgain) {
      Alert.alert(
        'Autorisation de la caméra refusée',
        "L'accès à l'appareil photo est nécessaire. Veuillez l'activer dans les paramètres de l'application.",
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Ouvrir paramètres',
            onPress: () => Linking.openSettings(),
          },
        ],
        { cancelable: false }
      );
    } 

    else if (!permission?.granted) {
      requestPermission();
    } 
  
    if (!permission?.granted) {
      requestPermission();
    }

    if (permission?.granted) {
      setIsScanning(true);
    }
  };

  const handleBarcodeScanned = ({ data }: any) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      setHasScan(true);
      if (data) {
        console.log(data);
        setHasScan(false);
        setScanValue(data);
        setIsScanning(false);
        qrLock.current = false;
      }
    }
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Button title="Scanner" onPress={startScanning} />
      {isScanning &&
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
          <Overlay hasScan={hasScan}/>
        </>
      }
      {!isScanning && scanValue && <SuccessIcon/>}
      {/* <ErrorIcon/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  }
})

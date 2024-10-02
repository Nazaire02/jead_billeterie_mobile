import { useRef, useState } from 'react';
import 'react-native-reanimated';

import { Button, View, StyleSheet, SafeAreaView, Alert, Linking, Pressable, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Overlay } from './scanner/Overlay';
import { ErrorIcon, SuccessIcon } from '@/components/Button';
import { checkTicket } from '@/api/checkTicket';

export default function RootLayout() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [checkStatus, setCheckStatus] = useState<Boolean | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);

  const startScanning = async () => {
    if (permission?.status === 'denied' && !permission?.canAskAgain) {
      return Alert.alert(
        'Autorisation de la caméra refusée',
        "L'accès à l'appareil photo est nécessaire. Veuillez l'activer dans les paramètres de l'application.",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Ouvrir paramètres', onPress: () => Linking.openSettings() },
        ],
        { cancelable: false }
      );
    }

    if (!permission?.granted) {
      await requestPermission();
    }

    if (permission?.granted) {
      setCheckStatus(null);
      setIsScanning(true);
    }
  };

  const handleBarcodeScanned = async ({ data }: any) => {
    if (data && !qrLock.current) {
      setHasScanned(true);
      qrLock.current = true;
      try {
        const response = await checkTicket(data);
        setCheckStatus(response.canEnter);
      } catch (error) {
        console.error('Error checking ticket:', error);
        setCheckStatus(false);
      } finally {
        qrLock.current = false;
        setIsScanning(false);
        setHasScanned(false);
      }
    }
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Pressable style={styles.button} onPress={startScanning}>
        <Text style={styles.text}>Je scanne</Text>
      </Pressable>

      {isScanning && (
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
          <Overlay hasScan={hasScanned} />
        </>
      )}
      {!isScanning && checkStatus !== null && (
        checkStatus ? <SuccessIcon /> : <ErrorIcon />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

type Facing = 'front' | 'back';

export default function App() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [takingPicture, setTakingPicture] = useState(false);
  const [facing, setFacing] = useState<Facing>('front');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);

  if (!permission) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.permissionCard}>
          <Text style={styles.eyebrow}>GAZE LAB / V0</Text>
          <Text style={styles.permissionTitle}>Camera access</Text>
          <Text style={styles.body}>
            The first prototype captures one eye locally so we can test image
            quality before adding pupil and gaze measurements.
          </Text>
          <Pressable style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Allow camera</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const captureEye = async () => {
    if (!cameraRef.current || !cameraReady || takingPicture) return;

    try {
      setTakingPicture(true);
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });

      if (result) setPhoto(result);
    } finally {
      setTakingPicture(false);
    }
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.brand}>GAZE LAB</Text>
          <Text style={styles.step}>CAPTURE / 01</Text>
        </View>

        <View style={styles.resultFrame}>
          <Image source={{ uri: photo.uri }} style={styles.resultImage} />
        </View>

        <View style={styles.resultCopy}>
          <Text style={styles.resultTitle}>Eye image captured.</Text>
          <Text style={styles.body}>
            {photo.width} × {photo.height} px. This image is currently kept in
            the app cache and is not uploaded anywhere.
          </Text>
          <Text style={styles.note}>
            V0 only validates capture and framing. No health, attention, memory,
            or diagnostic interpretation is produced yet.
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setPhoto(null);
            setCameraReady(false);
          }}
        >
          <Text style={styles.primaryButtonText}>Retake</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.brand}>GAZE LAB</Text>
        <Text style={styles.step}>CAPTURE / 01</Text>
      </View>

      <View style={styles.cameraFrame}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onCameraReady={() => setCameraReady(true)}
        />

        <View pointerEvents="none" style={styles.overlay}>
          <View style={styles.eyeGuide}>
            <View style={styles.centerMark} />
          </View>
          <Text style={styles.guideText}>Align one eye inside the frame</Text>
        </View>
      </View>

      <Text style={styles.instructions}>
        Face a soft, even light. Keep the phone steady and move close enough for
        one eye to fill most of the guide.
      </Text>

      <View style={styles.controls}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            setCameraReady(false);
            setFacing((current) => (current === 'front' ? 'back' : 'front'));
          }}
        >
          <Text style={styles.secondaryButtonText}>
            {facing === 'front' ? 'Use back camera' : 'Use front camera'}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Capture eye image"
          disabled={!cameraReady || takingPicture}
          style={[
            styles.shutter,
            (!cameraReady || takingPicture) && styles.shutterDisabled,
          ]}
          onPress={captureEye}
        >
          <View style={styles.shutterInner} />
        </Pressable>
      </View>

      <Text style={styles.footer}>
        Experimental prototype · not a medical device
      </Text>
    </SafeAreaView>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.centeredContainer}>
      <StatusBar style="light" />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#f4f4f2',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  step: {
    color: '#777',
    fontSize: 11,
    letterSpacing: 1.3,
  },
  cameraFrame: {
    flex: 1,
    minHeight: 420,
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: '#151515',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeGuide: {
    width: '78%',
    aspectRatio: 1.85,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.88)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  guideText: {
    position: 'absolute',
    bottom: 24,
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.42)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    overflow: 'hidden',
  },
  instructions: {
    color: '#a8a8a3',
    fontSize: 13,
    lineHeight: 19,
    paddingVertical: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  secondaryButtonText: {
    color: '#bdbdb7',
    fontSize: 13,
  },
  shutter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#f4f4f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDisabled: {
    opacity: 0.35,
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#f4f4f2',
  },
  footer: {
    color: '#555',
    fontSize: 10,
    letterSpacing: 0.7,
    textAlign: 'center',
    marginTop: 14,
    textTransform: 'uppercase',
  },
  permissionCard: {
    width: '100%',
    maxWidth: 420,
    gap: 16,
  },
  eyebrow: {
    color: '#666',
    fontSize: 11,
    letterSpacing: 1.4,
  },
  permissionTitle: {
    color: '#f4f4f2',
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '600',
  },
  body: {
    color: '#aaa9a4',
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    color: '#70706c',
    fontSize: 12,
    lineHeight: 18,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#f4f4f2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  resultFrame: {
    flex: 1,
    minHeight: 360,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#151515',
  },
  resultImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  resultCopy: {
    gap: 8,
    paddingVertical: 18,
  },
  resultTitle: {
    color: '#f4f4f2',
    fontSize: 22,
    fontWeight: '600',
  },
});

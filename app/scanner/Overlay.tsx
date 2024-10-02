import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet, ActivityIndicator, View } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50 // Rounded corner radius
);

export const Overlay = (props: any) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Canvas
        style={Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject}
      >
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>
      {props.hasScan && <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

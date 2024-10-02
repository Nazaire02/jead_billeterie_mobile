import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

export const SuccessIcon = () => {
    return (
      <Animatable.View animation="bounceIn">
        <FontAwesome name="check-circle" size={400} color="green" />
      </Animatable.View>
    );
};

export const ErrorIcon = () => {
    return (
      <Animatable.View animation="bounceIn">
        <FontAwesome name="times-circle" size={400} color="red" />
      </Animatable.View>
    );
};
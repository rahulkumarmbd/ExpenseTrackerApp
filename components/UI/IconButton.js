import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const IconButton = ({ name, color, size, onPress, style }) => {
  const _pressable = ({ pressed }) => {
    return pressed && styles.pressed;
  };

  return (
    <Pressable onPress={onPress} style={_pressable}>
      <View style={style}>
        <Ionicons name={name} color={color} size={size} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});

import { KText } from "@/components/KText";
import { Screen } from "@/components/Screen";
import { View } from "react-native";

export default function CardDetailsScreen() {
  return (
    <Screen title="Card Details">
      <View className="flex-1 items-center justify-center">
        <KText label="Card Details" />
      </View>
    </Screen>
  );
}

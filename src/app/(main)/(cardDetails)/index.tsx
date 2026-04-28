import { KText } from "@/components/KText";
import { Screen } from "@/components/Screen";
import { useCardById } from "@/features/cards/hooks/useCard";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function CardDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { card } = useCardById(id ?? "");

  return (
    <Screen title="Card Details">
      <View className="flex-1  ">
        <KText variant="h1" label={card?.title} />
        <KText className="mt-5" label={card?.description} />
      </View>
    </Screen>
  );
}

import { KText } from "@/components/KText";
import { Screen } from "@/components/Screen";
import { View } from "react-native";

export default function CommentsScreen() {
  return (
    <Screen enableBack={false} title="Comments">
      <View className="flex-1 items-center justify-center">
        <KText label="Comments" />
      </View>
    </Screen>
  );
}

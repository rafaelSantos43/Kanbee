import { getInitialNames } from "@/core/utils/getInitilaNames";
import { Image } from "expo-image";
import { View } from "react-native";
import { KText } from "./KText";

type UserImageProps = {
  uri?: string;
  userDefault?: string;
};
export const UserImage = ({ uri, userDefault }: UserImageProps) => {
  if (uri === undefined || uri === null) {
    return (
      <View className="w-7 h-7 bg-kanbee-yellow  rounded-full overflow-hidden items-center justify-center">
        <KText
          className="text-xs font-semibold"
          label={getInitialNames(userDefault)}
        />
      </View>
    );
  }

  return (
    <View className="w-7 h-7 bg-kanbee-yellow  rounded-full overflow-hidden items-center justify-center">
      <Image source={{ uri }} className="w-full h-full" />
    </View>
  );
};

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { ClipboardList, MessageCircleMore } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACTIVE_COLOR = "#4B5563";
const INACTIVE_COLOR = "#8FA1B8";

const icons = {
  index: ClipboardList,
  comments: MessageCircleMore,
} as const;

function FloatingTelegramTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 items-center"
      style={{ paddingBottom: Math.max(insets.bottom, 14) }}
    >
      <View className="w-[92%] max-w-[420px] rounded-[28px] bg-white shadow-lg">
        <View className="flex-row items-center justify-around overflow-hidden rounded-[28px] px-[18px] py-4">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const Icon =
              icons[route.name as keyof typeof icons] ?? MessageCircleMore;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={
                  descriptors[route.key].options.title ?? route.name
                }
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                className="items-center justify-center rounded-2xl"
                android_ripple={{ color: "transparent", borderless: false }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View
                  className={
                    isFocused
                      ? "h-11 w-11 items-center justify-center rounded-xl bg-[#FFD24D]"
                      : "h-11 w-11 items-center justify-center bg-transparent"
                  }
                >
                  <Icon
                    size={22}
                    strokeWidth={2.2}
                    color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function CardDetailsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTelegramTabs {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "fade",
        sceneStyle: { backgroundColor: "#EEF2F7" },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="comments" />
    </Tabs>
  );
}

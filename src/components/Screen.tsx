import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { ReactNode, memo, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KText } from "./KText";

interface ScreenProps {
  testID?: string;
  title?: string;
  subtitle?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  backgroundColor?: string;
  enableBack?: boolean;
}

export const Screen = memo(function Screen({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  children,
  scroll = false,
  backgroundColor = "#FFFFFF",
  enableBack = true,
}: ScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const dynamicPadding = useMemo(() => {
    if (width > 600) return "px-12";
    if (width < 350) return "px-3";
    return "px-5";
  }, [width]);

  const containerStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor,
    }),
    [backgroundColor],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const renderLeft = () => {
    if (leftIcon) {
      return <View className="mr-3">{leftIcon}</View>;
    }

    if (enableBack) {
      return (
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 rounded-full items-center justify-center bg-slate-100"
        >
          <ChevronLeft />
        </Pressable>
      );
    }

    return null;
  };

  const Header = (
    <View
      style={{ paddingTop: Math.max(insets.top) }}
      className="px-4 pb-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1">
        {renderLeft()}

        <View className="flex-1 ml-2">
          {title && (
            <KText
              numberOfLines={1}
              className="text-xl font-bold text-slate-900"
              tx={title}
            />
          )}

          {subtitle && (
            <KText
              numberOfLines={1}
              className="text-xs text-slate-400 mt-0.5"
              tx={subtitle}
            />
          )}
        </View>
      </View>

      {rightIcon && <View className="ml-3">{rightIcon}</View>}
    </View>
  );

  const Content = scroll ? (
    <ScrollView
      className="flex-1 px-5"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      className={`flex-1 ${dynamicPadding}`}
      style={{ paddingBottom: Math.max(insets.bottom) }}
    >
      {children}
    </View>
  );

  return (
    <View style={containerStyle}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {Header}
        {Content}
      </KeyboardAvoidingView>
    </View>
  );
});

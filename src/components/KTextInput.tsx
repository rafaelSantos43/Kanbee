import React, { forwardRef, ReactNode } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface kTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const KTextInput = forwardRef<TextInput, kTextInputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName = "",
      inputClassName = "",
      ...props
    },
    ref,
  ) => {
    return (
      <View>
        {label && (
          <Text className="text-sm font-medium text-gray-700">{label}</Text>
        )}

        <View
          className={`flex-row items-center my-2 border-2 mb-3 rounded-xl border-neutral-400 dark:border-neutralDark-600 ${containerClassName}`}
        >
          {leftIcon && <View className="mx-2">{leftIcon}</View>}

          <TextInput
            ref={ref}
            className={`flex-1  py-4 text-base text-neutral-800 dark:text-neutral-200  ${inputClassName}`}
            placeholderTextColor="#94a3b8"
            {...props}
          />

          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>

        {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      </View>
    );
  },
);

KTextInput.displayName = "AppTextInput";

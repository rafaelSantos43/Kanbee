import { useRouter } from 'expo-router'
import React, { ReactNode, memo, useMemo } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KText } from './KText'

interface ScreenProps {
  title?: string
  subtitle?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
  scroll?: boolean
  backgroundColor?: string
  enableBack?: boolean
}

export const Screen = memo(function Screen({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  children,
  scroll = false,
  backgroundColor = '#FFFFFF',
  enableBack = true,
}: ScreenProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const containerStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor,
    }),
    [backgroundColor],
  )

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    }
  }

  const renderLeft = () => {
    if (leftIcon) {
      return <View className='mr-3'>{leftIcon}</View>
    }

    if (enableBack) {
      return (
        <Pressable
          onPress={handleBack}
          className='w-10 h-10 rounded-full items-center justify-center bg-slate-100'
        >
          <KText
            className='text-lg'
            label='←'
          />
        </Pressable>
      )
    }

    return null
  }

  const Header = (
    <View
      style={{ paddingTop: insets.top }}
      className='px-5 pb-4 flex-row items-center justify-between'
    >
      <View className='flex-row items-center flex-1'>
        {renderLeft()}

        <View className='flex-1 ml-2'>
          {title && (
            <KText
              numberOfLines={1}
              className='text-xl font-bold text-slate-900'
              tx={title}
            />
          )}

          {subtitle && (
            <KText
              numberOfLines={1}
              className='text-xs text-slate-400 mt-0.5'
              tx={subtitle}
            />
          )}
        </View>
      </View>

      {rightIcon && <View className='ml-3'>{rightIcon}</View>}
    </View>
  )

  const Content = scroll ? (
    <ScrollView
      className='flex-1 px-5'
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      className='flex-1 px-5'
      style={{ paddingBottom: insets.bottom }}
    >
      {children}
    </View>
  )

  return (
    <View style={containerStyle}>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {Header}
        {Content}
      </KeyboardAvoidingView>
    </View>
  )
})

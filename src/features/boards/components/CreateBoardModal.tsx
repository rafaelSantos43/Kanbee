import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  onSubmit: (data: { title: string; color?: string }) => void
}

export function CreateBoardModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [color, setColor] = useState('#4f46e5')

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({ title: title.trim(), color: color.trim() || undefined })
    setTitle('')
    setColor('#4f46e5')
    onClose()
  }

  const isIOS = Platform.OS === 'ios'

  return (
    <Modal
      animationType='slide'
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : undefined}
        className='flex-1'
        keyboardVerticalOffset={isIOS ? 80 : 0}
      >
        <View className='flex-1 bg-black/60'>
          <Pressable
            className='flex-1'
            onPress={onClose}
          />

          <View
            className={isIOS ? 'mx-4 mb-10 rounded-3xl bg-neutral-900 p-6' : 'mt-auto rounded-t-3xl bg-neutral-900 p-6'}
          >
            <Text className='text-lg font-semibold text-neutral-50 mb-1'>Create board</Text>
            <Text className='text-sm text-neutral-400 mb-4'>Give your board a name and optional color.</Text>

            <View className='mb-3'>
              <Text className='text-xs font-medium text-neutral-400 mb-1'>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder='Project roadmap'
                placeholderTextColor='#9ca3af'
                className='h-11 rounded-xl bg-neutral-800 px-3 text-neutral-50'
              />
            </View>

            <View className='mb-4'>
              <Text className='text-xs font-medium text-neutral-400 mb-1'>Color (hex)</Text>
              <TextInput
                value={color}
                onChangeText={setColor}
                placeholder='#4f46e5'
                placeholderTextColor='#9ca3af'
                autoCapitalize='none'
                autoCorrect={false}
                className='h-11 rounded-xl bg-neutral-800 px-3 text-neutral-50'
              />
            </View>

            <View className='flex-row justify-end gap-3'>
              <Pressable
                onPress={onClose}
                className='h-10 px-4 rounded-full border border-neutral-700 items-center justify-center'
              >
                <Text className='text-sm font-medium text-neutral-300'>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                className='h-10 px-5 rounded-full bg-indigo-500 items-center justify-center'
              >
                <Text className='text-sm font-semibold text-white'>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

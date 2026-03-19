import { KText } from '@/components/KText'
import { KTextInput } from '@/components/KTextInput'
import { CardStatus } from '@/core/entities'
import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, View } from 'react-native'

type Props = {
  visible: boolean
  onSubmit: ({ title, description, status }: { title: string; description?: string; status: CardStatus }) => void
  onClose: () => void
}
const isIOS = Platform.OS === 'ios'
export const CreateCardModal = ({ visible, onSubmit, onClose }: Props) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | undefined>('')
  const [status, setStatus] = useState<CardStatus>('todo')

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({ title, description, status })
    setTitle('')
    onClose()
  }
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
            <KText
              className='text-white'
              label='CREATE_CARD'
            />

            <KText
              variant='caption'
              className='text-neutral-400'
              label='GIVE_YOUR_CARD'
            />

            <View className='my-2 '>
              <KTextInput
                value={title}
                onChangeText={setTitle}
                placeholder='TITLE'
              />
            </View>

            <View className='my-2 '>
              <KTextInput
                value={description}
                onChangeText={setDescription}
                placeholder='DESCRIPTION'
              />
            </View>

            <View className='my-2 '>
              <KTextInput
                value={status}
                onChangeText={setStatus}
                placeholder='STATUS'
              />
            </View>

            <View className='flex-row justify-end gap-3'>
              <Pressable
                onPress={onClose}
                className='h-10 px-4 rounded-full border border-neutral-700 items-center justify-center'
              >
                <KText
                  className='text-white'
                  label='CANCEL'
                />
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                className='h-10 px-5 rounded-full bg-kanbee-yellow items-center justify-center'
              >
                <KText label='CREATE' />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

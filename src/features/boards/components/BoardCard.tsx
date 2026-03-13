import { KText } from '@/components/KText'
import type { Board } from '@/core/entities/board'
import { formatDate } from '@/core/utils/date.helper'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Pressable, View } from 'react-native'

type Props = {
  board: Board
}

export const BoardCard = ({ board }: Props) => {
  const backgroundColor = board.color ?? '#E5DEFF'

  return (
    <Pressable
      className='w-full  bg-white dark:bg-neutralDark-800 rounded-xl p-4 mb-6 shadow-sm shadow-black/5'
      style={({ pressed }) => [
        {
          backgroundColor,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={() =>
        router.push({
          pathname: '/(main)/(board)/[id]',
          params: { id: board.id },
        })
      }
    >
      <View className='flex-row'>
        <View className=' '>
          <Image
            source={{
              uri: 'https://object.pixocial.com/pixocial/dmxffni837f1xrj8pki9xgrl.jpg',
            }}
            style={{ width: 45, height: 45, borderRadius: 50 }}
            alt='icon'
            contentFit='cover'
          />
        </View>
      </View>

      <View className='py-2'>
        <KText
          variant='h2'
          label={board.title}
        />
        <KText label='8 tasks' />
      </View>

      <View>
        <View className='flex-row items-center gap-2'>
          <View className='w-2 h-2 rounded-full bg-red-600' />
          <KText label='Social Media' />
        </View>
        <View className='flex-row items-center gap-2'>
          <View className='w-2 h-2 rounded-full bg-blue-300' />
          <KText label='Email copy development' />
        </View>
      </View>

      <View className='flex-row items-center justify-between mt-4'>
        <View className='flex-row gap-4 opacity-40'>
          <View className='flex-row items-center gap-1'>
            <KText label={formatDate(board.createdAt)} />
          </View>
        </View>
        <View className='flex-row items-center bg-gray-100 dark:bg-neutralDark-500 p-1.5 rounded-full'>
          <View className='w-8 h-8 rounded-full bg-orange-200 border-2 border-white' />
          <View className='w-8 h-8 rounded-full bg-blue-200 border-2 border-white -ml-3' />
          <View className='w-8 h-8 rounded-full bg-green-200 border-2 border-white -ml-3 items-center justify-center'>
            <KText
              className='text-[10px] font-bold text-green-800'
              label='+'
            />
          </View>
        </View>
      </View>
    </Pressable>
  )
}

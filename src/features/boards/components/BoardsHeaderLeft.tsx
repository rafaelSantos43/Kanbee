import { KText } from '@/components/KText'
import { Image } from 'expo-image'
import { View } from 'react-native'

export const BoardsHeaderLeft = () => {
  return (
    <View className='flex-row items-center gap-3'>
      <View className='rounded-full bg-[#dfe1e9]'>
        <Image
          source={require('../../../../assets/images/icon_app.png')}
          style={{
            width: 40,
            height: 40,
          }}
          contentFit='cover'
          cachePolicy='memory-disk'
        />
      </View>
      <KText
        tx='Projects'
        variant='h2'
      />
    </View>
  )
}

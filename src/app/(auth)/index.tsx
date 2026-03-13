import { KText } from '@/components/KText'
import { KTextInput } from '@/components/KTextInput'
import { Screen } from '@/components/Screen'
import { Colors } from '@/constants/theme'
import { Image } from 'expo-image'
import { LockKeyhole, Mail } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

export default function LoginScreen() {
  return (
    <Screen enableBack={false}>
      <View className=' flex-1 justify-between '>
        <View className='items-center '>
          <Image
            source={require('../../../assets/images/icon_app.png')}
            style={{ width: 150, height: 150 }}
            contentFit='contain'
          />
        </View>
        <View className='flex-1   p-8  rounded-lg bg-slate-50'>
          <KTextInput
            leftIcon={<Mail color={Colors.light.icon} />}
            label='email'
            placeholder='devdesarrollo@company.com'
          />
          <KTextInput
            leftIcon={<LockKeyhole color={Colors.light.icon} />}
            label='password'
            placeholder='*******'
          />

          <Pressable className='items-center bg-kanbee-yellow p-4 rounded-lg'>
            <KText
              variant='label'
              label='SIGNIN'
            />
          </Pressable>
          <KText
            className='text-center py-4'
            label='------------or-----------'
          />
        </View>

        <View className='bottom-3 flex-row border justify-center gap-2'>
          <KText label='Dont have an account?' />
          <KText label='Create Cunt' />
        </View>
      </View>
    </Screen>
  )
}

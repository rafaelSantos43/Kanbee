import { KText } from '@/components/KText'
import { KTextInput } from '@/components/KTextInput'
import { Screen } from '@/components/Screen'
import { Colors } from '@/constants/theme'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { LoginFormData, loginSchema } from '@/features/auth/schemas/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { LockKeyhole, Mail } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'

const navigateToRegiterScreen = () => {
  router.push('/(auth)/register')
}
export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { submit, loadingSession } = useLogin()

  const onSubmit = (data: LoginFormData) => {
    submit(data.username, data.password)
  }

  return (
    <Screen
      scroll
      enableBack={false}
    >
      <View className=' justify-around  flex-1'>
        <View className='items-center'>
          <Image
            source={require('../../../assets/images/icon_app.png')}
            style={{ width: 180, height: 180 }}
            contentFit='contain'
          />
        </View>
        <View className='bottom-4 p-8  rounded-lg bg-slate-50'>
          <View style={{ minHeight: 80 }}>
            <Controller
              control={control}
              name='username'
              render={({ field: { onChange, onBlur, value } }) => (
                <KTextInput
                  label='email'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  leftIcon={<Mail color={Colors.light.icon} />}
                  placeholder='devdesarrollo@company.com'
                  autoCorrect={false}
                  spellCheck={false}
                  value={value}
                />
              )}
            />
            {errors.username && (
              <KText
                className='bottom-5'
                style={{ color: 'red' }}
                label={errors.username.message}
              />
            )}
          </View>

          <View style={{ minHeight: 80 }}>
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <KTextInput
                  leftIcon={<LockKeyhole color={Colors.light.icon} />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  label='password'
                  placeholder='*******'
                  autoCorrect={false}
                  spellCheck={false}
                  value={value}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <KText
                className='bottom-5'
                style={{ color: 'red' }}
                label={errors.password.message}
              />
            )}
          </View>

          <Pressable
            disabled={loadingSession}
            onPress={handleSubmit(onSubmit)}
            className='items-center bg-kanbee-yellow p-4  mt-2 rounded-lg'
          >
            <KText
              variant='label'
              label={loadingSession ? 'loading' : 'SIGNIN'}
            />
          </Pressable>
        </View>
        <View className='flex-row  justify-center gap-2'>
          <KText label='Dont have an account?' />
          <Pressable onPress={navigateToRegiterScreen}>
            <KText label='Create account' />
          </Pressable>
        </View>
      </View>
    </Screen>
  )
}

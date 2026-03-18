import { KText } from '@/components/KText'
import { KTextInput } from '@/components/KTextInput'
import { Screen } from '@/components/Screen'
import { Role } from '@/constants/roles'
import { Colors } from '@/constants/theme'
import { User } from '@/core/entities'
import { RoleSelector } from '@/features/auth/components/RoleSelector'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { RegisterFormData, registerSchema } from '@/features/auth/schemas/register.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'expo-image'
import { LockKeyhole, Mail, User2 } from 'lucide-react-native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'

export default function RegisterScreen() {
  const [role, setRole] = useState<Role>('user')

  const { submit } = useRegister()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    const user: User = {
      id: '',
      username: data.username,
      email: data.email,
      role,
      avatar: null,
      createdAt: Date.now(),
    }
    console.log('user')

    submit({ userData: user, password: data.password })
  }

  return (
    <Screen scroll>
      <View className='flex-1'>
        <View className='items-center '>
          <Image
            source={require('../../../assets/images/icon_app.png')}
            style={{ width: 150, height: 150 }}
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
                  autoCapitalize='none'
                  label='username'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  leftIcon={<User2 color={Colors.light.icon} />}
                  placeholder='dev00'
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
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <KTextInput
                  autoCapitalize='none'
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
            {errors.email && (
              <KText
                className='bottom-5'
                style={{ color: 'red' }}
                label={errors.email.message}
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
                  autoCapitalize='none'
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

          <View className='mb-6'>
            <RoleSelector
              setRole={setRole}
              role={role}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className='items-center bg-kanbee-yellow p-4 rounded-lg'
          >
            <KText
              variant='label'
              label='SIGNUP'
            />
          </TouchableOpacity>
          {/* <KText
            className='text-center py-4'
            label='------------or-----------'
          /> */}
        </View>
      </View>
    </Screen>
  )
}

import { Role } from '@/constants/roles';
import { Pressable, Text, View } from 'react-native';

export const RoleSelector = ({ setRole, role }: { setRole: (value: Role) => void; role: Role }) => {
  return (
    <View className='flex-row gap-5'>
      <Pressable
        onPress={() => setRole('user')}
        className='flex-row items-center gap-2'
      >
        <View className='w-6 h-6 rounded-xl border  items-center justify-center'>
          {role === 'user' && <View className='w-3 h-3 rounded-md bg-kanbee-yellow' />}
        </View>

        <Text>User</Text>
      </Pressable>

      <Pressable
        onPress={() => setRole('admin')}
        className='flex-row items-center gap-2'
      >
        <View className='w-6 h-6 rounded-xl border  items-center justify-center'>
          {role === 'admin' && <View className='w-3 h-3 rounded-md bg-kanbee-yellow' />}
        </View>

        <Text>Admin</Text>
      </Pressable>
    </View>
  )
}

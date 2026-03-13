import { Colors } from '@/constants/theme'
import { DrawerActions } from '@react-navigation/native'
import { useNavigation } from 'expo-router'
import { Bell } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

export const BoardsHeaderRight = () => {
  const navigation = useNavigation()
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }
  return (
    <View className='flex-row items-center gap-3'>
      <Bell
        size={23}
        color={Colors.light.icon}
      />
      <Pressable
        onPress={openDrawer}
        className='w-11 h-11  rounded-full bg-slate-200 overflow-hidden'
      >
        <View className='flex-1 bg-orange-200' />
      </Pressable>
    </View>
  )
}

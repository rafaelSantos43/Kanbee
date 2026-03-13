import { KTextInput } from '@/components/KTextInput'
import { useBoardStore } from '@/store/useBoardStore'
import { Search } from 'lucide-react-native'
import { View } from 'react-native'

export const SearchBoard = () => {
  const { searchQuery, setSearchQuery } = useBoardStore()
  return (
    <View>
      <KTextInput
        placeholder='Search board'
        leftIcon={
          <Search
            size={20}
            color='#64748b'
          />
        }
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
    </View>
  )
}

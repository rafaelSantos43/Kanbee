import { KText } from '@/components/KText'
import { Board } from '@/core/entities'
import { useBoardStore } from '@/store/useBoardStore'
import { useSessionStore } from '@/store/useSessionStore'
import { useCallback, useMemo } from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import { BoardCard } from './BoardCard'

interface BoardListProps {
  isLoading: boolean
}

const keyExtractor = (item: Board) => item.id
const renderItem = ({ item }: { item: Board }) => <BoardCard board={item} />

export const BoardList = ({ isLoading }: BoardListProps) => {
  const { boards, searchQuery, fetchBoards } = useBoardStore()
  const user = useSessionStore((state) => state.user)

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return boards

    const lowQuery = searchQuery.toLowerCase()
    return boards.filter((b) => b.title.toLowerCase().includes(lowQuery))
  }, [boards, searchQuery])

  const refetchList = useCallback(() => {
    if (!user?.id) return
    fetchBoards(user.id)
  }, [fetchBoards, user?.id])

  return (
    <View>
      {isLoading && filtered.length === 0 ? (
        <ActivityIndicator
          size='large'
          color='#4F86F7'
          className='mt-20'
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            flexGrow: 1,
          }}
          renderItem={renderItem}
          refreshing={isLoading}
          onRefresh={refetchList}
          ListEmptyComponent={() => (
            <View className='items-center py-20'>
              <KText
                className='text-slate-400'
                label='No hay tableros todavía.'
              />
            </View>
          )}
        />
      )}
    </View>
  )
}

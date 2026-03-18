import { useEffect, useState } from 'react'
import { Alert, Pressable, View } from 'react-native'

import { KText } from '@/components/KText'
import { Screen } from '@/components/Screen'
import { CreateBoardModal } from '@/features/boards/components/CreateBoardModal'
import { SearchBoard } from '@/features/boards/components/SearchBoard'
import { useBoardStore } from '@/store/useBoardStore'

import { BoardList } from '@/features/boards/components/BoardList'
import { BoardsHeaderLeft } from '@/features/boards/components/BoardsHeaderLeft'
import { BoardsHeaderRight } from '@/features/boards/components/BoardsHeaderRight'
import { useSessionStore } from '@/store/useSessionStore'

export default function BoardsScreen() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const user = useSessionStore((state) => state.user)
  const { isLoading, fetchBoards, addBoard } = useBoardStore()

  useEffect(() => {
    if (user?.id) {
      fetchBoards(user.id)
    }
  }, [fetchBoards, user?.id])

  return (
    <Screen
      scroll={false}
      enableBack={false}
      leftIcon={<BoardsHeaderLeft />}
      rightIcon={<BoardsHeaderRight />}
    >
      <View className='flex-1'>
        <SearchBoard />

        <BoardList isLoading={isLoading} />

        <Pressable
          onPress={() => setIsCreateOpen(true)}
          className='absolute bottom-10 self-end bg-kanbee-yellow w-16 h-16 rounded-full items-center justify-center'
        >
          <KText
            label='+'
            className='text-white text-3xl font-light'
          />
        </Pressable>

        <CreateBoardModal
          visible={isCreateOpen}
          onSubmit={({ title, color }) => {
            if (!user?.id) {
              Alert.alert('Error', 'No se encontró una sesión activa.')
              return
            }
            addBoard({ userId: user?.id, title, color, isFavorite: false })
          }}
          onClose={() => setIsCreateOpen(false)}
        />
      </View>
    </Screen>
  )
}

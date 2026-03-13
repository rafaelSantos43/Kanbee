import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import { KText } from '@/components/KText'
import { Screen } from '@/components/Screen'
import { CreateBoardModal } from '@/features/boards/components/CreateBoardModal'
import { SearchBoard } from '@/features/boards/components/SearchBoard'
import { useBoardStore } from '@/store/useBoardStore'

import { BoardList } from '@/features/boards/components/BoardList'
import { BoardsHeaderLeft } from '@/features/boards/components/BoardsHeaderLeft'
import { BoardsHeaderRight } from '@/features/boards/components/BoardsHeaderRight'

export default function BoardsScreen() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { isLoading, fetchBoards, addBoard } = useBoardStore()

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

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
          onClose={() => setIsCreateOpen(false)}
          onSubmit={({ title, color }) => {
            addBoard({ userId: 'demo-user', title, color, isFavorite: false })
          }}
        />
      </View>
    </Screen>
  )
}

import { KText } from '@/components/KText'
import { Card } from '@/core/entities'
import { View } from 'react-native'
import { Draggable } from 'react-native-reanimated-dnd'

type CardItemProps = {
  card: Card
  listId: string
  onDragStart?: () => void
  onDragEnd?: () => void
  onDragging?: (position: { x: number; y: number }) => void
}

export const CardItem = ({ card, listId, onDragStart, onDragEnd, onDragging }: CardItemProps) => {
  return (
    <Draggable
      data={{ cardId: card.id, fromListId: listId }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragging={onDragging}
    >
      <View className='border gap-3 my-3 rounded-xl p-3'>
        <KText label={card.title} />
        <KText label={card.description} />
        <KText label={card.status} />
      </View>
    </Draggable>
  )
}

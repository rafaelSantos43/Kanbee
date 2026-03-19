import { KText } from '@/components/KText'
import { Card } from '@/core/entities'
import { useRef } from 'react'
import { View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

type DraggableCardProps = {
  card: Card
  onDragStart: (card: Card, absoluteX: number, absoluteY: number, width: number, height: number) => void
  onDragEnd: () => void
  onDragging: (absoluteX: number, absoluteY: number) => void
  onDrop: (cardId: string, absoluteX: number, absoluteY: number) => void
}

export const DraggableCard = ({ card, onDragStart, onDragEnd, onDragging, onDrop }: DraggableCardProps) => {
  const viewRef = useRef<View>(null)
  const isDragging = useSharedValue(false)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value ? 0.3 : 1,
  }))

  const handleDragStart = (absX: number, absY: number) => {
    viewRef.current?.measureInWindow((x, y, width, height) => {
      onDragStart(card, absX, absY, width, height)
    })
  }

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((event) => {
      isDragging.value = true
      runOnJS(handleDragStart)(event.absoluteX, event.absoluteY)
    })
    .onUpdate((event) => {
      runOnJS(onDragging)(event.absoluteX, event.absoluteY)
    })
    .onEnd((event) => {
      isDragging.value = false
      runOnJS(onDrop)(card.id, event.absoluteX, event.absoluteY)
      runOnJS(onDragEnd)()
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <View ref={viewRef} className='border gap-3 my-3 rounded-xl p-3'>
          <KText label={card.title} />
          {card.description ? <KText label={card.description} /> : null}
          <KText label={card.status} />
        </View>
      </Animated.View>
    </GestureDetector>
  )
}

import { KText } from '@/components/KText'
import { Screen } from '@/components/Screen'
import { Card } from '@/core/entities'
import { CreateListModal } from '@/features/lists/components/CreateListModal'
import { ListColumn } from '@/features/lists/components/ListColumn'
import { useBoardStore } from '@/store/useBoardStore'
import { useCardStore } from '@/store/useCardStore'
import { useListStore } from '@/store/useListStore'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const GAP = 10
const EDGE_ZONE = 60
const SCROLL_SPEED = 10

export default function BoardDetailScreen() {
  const { width: screenWidth } = useWindowDimensions()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const COLUMN_WIDTH = screenWidth * 0.8

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [ghostCard, setGhostCard] = useState<Card | null>(null)
  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 })
  const [hoverListId, setHoverListId] = useState<string | null>(null)
  const [hoverInsertIndex, setHoverInsertIndex] = useState(0)
  const hoverListRef = useRef<string | null>(null)
  const hoverInsertIndexRef = useRef(0)
  const listTopRef = useRef(0)
  const CARD_HEIGHT = 80 // altura estimada de cada card (border + padding + gap)
  const LIST_HEADER_HEIGHT = 52 // altura del header de la lista (py-3 + texto)

  const scrollRef = useRef<ScrollView>(null)
  const scrollOffsetRef = useRef(0)
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Ghost card animated values
  const ghostX = useSharedValue(0)
  const ghostY = useSharedValue(0)
  const ghostScale = useSharedValue(1)
  const ghostOpacity = useSharedValue(1)

  const { boards, isLoading, fetchBoards } = useBoardStore()
  const { lists, fetchLists, addList, removeList, updateList } = useListStore()
  const { cards, fetchCards, addCard, updateCard, moveCard } = useCardStore()

  useEffect(() => {
    if (!boards.length && id) fetchBoards(id)
  }, [boards.length, id, fetchBoards])

  useEffect(() => {
    if (id) fetchLists(id)
  }, [id, fetchLists])

  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach((list) => fetchCards(list.id))
    }
  }, [lists.length])

  const board = useMemo(() => boards.find((b) => b.id === id), [boards, id])

  const getCardsForList = useCallback(
    (listId: string) => cards.filter((c) => c.listId === listId).sort((a, b) => a.orderIndex - b.orderIndex),
    [cards],
  )

  // --- Detección de columna destino ---
  const findTargetList = useCallback(
    (absoluteX: number): string | null => {
      const columnFullWidth = COLUMN_WIDTH + GAP * 2
      const positionInContent = absoluteX + scrollOffsetRef.current
      const columnIndex = Math.floor(positionInContent / columnFullWidth)

      if (columnIndex >= 0 && columnIndex < lists.length) {
        return lists[columnIndex].id
      }
      return null
    },
    [COLUMN_WIDTH, lists],
  )

  // --- Drag handlers ---
  const handleDragStart = useCallback(
    (card: Card, absoluteX: number, absoluteY: number, width: number, height: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsDragging(true)
      setGhostCard(card)
      setGhostSize({ width, height })
      setHoverListId(null)
      hoverListRef.current = null
      ghostX.value = absoluteX - width / 2
      ghostY.value = absoluteY - height / 2
      ghostScale.value = withSpring(1.05)
      ghostOpacity.value = 1
    },
    [ghostX, ghostY, ghostScale, ghostOpacity],
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setGhostCard(null)
    stopAutoScroll()
  }, [])

  const handleDragging = useCallback(
    (absoluteX: number, absoluteY: number) => {
      ghostX.value = absoluteX - ghostSize.width / 2
      ghostY.value = absoluteY - ghostSize.height / 2

      // Detectar sobre qué lista está el dedo
      const targetId = findTargetList(absoluteX)
      if (targetId !== hoverListRef.current) {
        if (targetId) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        hoverListRef.current = targetId
        setHoverListId(targetId)
      }

      // Calcular índice de inserción basado en Y (funciona para cualquier lista)
      if (targetId) {
        const cardsTop = listTopRef.current + LIST_HEADER_HEIGHT
        const relativeY = absoluteY - cardsTop
        const index = Math.max(0, Math.round(relativeY / CARD_HEIGHT))
        const targetCards = cards
          .filter((c) => c.listId === targetId && c.id !== ghostCard?.id)
          .sort((a, b) => a.orderIndex - b.orderIndex)
        const newInsertIndex = Math.min(index, targetCards.length)
        hoverInsertIndexRef.current = newInsertIndex
        setHoverInsertIndex(newInsertIndex)
      }

      // Auto-scroll por bordes
      const maxScroll = (COLUMN_WIDTH + GAP * 2) * (lists.length - 1)

      if (absoluteX > screenWidth - EDGE_ZONE && !autoScrollRef.current) {
        autoScrollRef.current = setInterval(() => {
          scrollOffsetRef.current = Math.min(scrollOffsetRef.current + SCROLL_SPEED, maxScroll)
          scrollRef.current?.scrollTo({ x: scrollOffsetRef.current, animated: false })
        }, 16)
      } else if (absoluteX < EDGE_ZONE && !autoScrollRef.current) {
        autoScrollRef.current = setInterval(() => {
          scrollOffsetRef.current = Math.max(scrollOffsetRef.current - SCROLL_SPEED, 0)
          scrollRef.current?.scrollTo({ x: scrollOffsetRef.current, animated: false })
        }, 16)
      } else if (absoluteX >= EDGE_ZONE && absoluteX <= screenWidth - EDGE_ZONE) {
        stopAutoScroll()
      }
    },
    [screenWidth, lists.length, COLUMN_WIDTH, ghostSize, ghostX, ghostY, findTargetList, ghostCard, cards],
  )

  const handleDrop = useCallback(
    (cardId: string, absoluteX: number, _absoluteY: number) => {
      const card = cards.find((c) => c.id === cardId)
      if (!card) return

      const targetListId = findTargetList(absoluteX)

      if (targetListId) {
        const dropIndex = hoverInsertIndexRef.current
        const isSameList = targetListId === card.listId
        const isSamePosition = isSameList && card.orderIndex === dropIndex

        if (!isSamePosition) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          moveCard(cardId, targetListId, dropIndex)

          if (!isSameList) {
            const targetIndex = lists.findIndex((l) => l.id === targetListId)
            if (targetIndex !== -1 && scrollRef.current) {
              scrollRef.current.scrollTo({ x: (COLUMN_WIDTH + GAP * 2) * targetIndex, animated: true })
            }
          }
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }

      // Animación de salida
      ghostScale.value = withSpring(0.9, { damping: 15 })
      ghostOpacity.value = withTiming(0, { duration: 200 })

      // Limpiar después de la animación
      setTimeout(() => {
        setGhostCard(null)
        setIsDragging(false)
        setHoverListId(null)
        setHoverInsertIndex(0)
        hoverInsertIndexRef.current = 0
        hoverListRef.current = null
      }, 220)

      stopAutoScroll()
    },
    [cards, lists, updateCard, findTargetList, COLUMN_WIDTH, ghostScale, ghostOpacity],
  )

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }, [])

  // Ghost card animated style
  const ghostAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: ghostX.value },
      { translateY: ghostY.value },
      { scale: ghostScale.value },
    ],
    opacity: ghostOpacity.value,
  }))

  if (isLoading && !board) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator color='#4F86F7' />
      </View>
    )
  }

  return (
    <Screen title={board?.title}>
      <View className='flex-1'>
        <ScrollView
          ref={scrollRef}
          onLayout={(e) => {
            e.target.measureInWindow((_x, y) => {
              listTopRef.current = y
            })
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={COLUMN_WIDTH + GAP * 2}
          decelerationRate='fast'
          scrollEnabled={!isDragging}
          onScroll={(e) => {
            scrollOffsetRef.current = e.nativeEvent.contentOffset.x
          }}
          scrollEventThrottle={16}
          className='flex-1'
        >
          {lists.map((item, index) => {
            const listCards = getCardsForList(item.id)
            return (
              <View key={item.id} style={{ width: COLUMN_WIDTH, marginHorizontal: GAP, flex: 1 }}>
                <ListColumn
                  list={item}
                  cards={listCards}
                  columnIndex={index}
                  isDropTarget={hoverListId === item.id}
                  insertIndex={hoverListId === item.id ? hoverInsertIndex : -1}
                  draggedCardId={ghostCard?.id ?? null}
                  onEdit={(listId, data) => updateList(listId, data)}
                  onDelete={(listId) => removeList(listId)}
                  onAddCard={({ title, description, status }) => {
                    addCard({ title, description, listId: item.id, status, orderIndex: listCards.length })
                  }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragging={handleDragging}
                  onDrop={handleDrop}
                />
              </View>
            )
          })}
        </ScrollView>

        {/* Ghost card — flota por encima de todo */}
        {ghostCard && (
          <Animated.View
            style={[styles.ghost, { width: ghostSize.width }, ghostAnimatedStyle]}
            pointerEvents='none'
          >
            <View className='border gap-3 rounded-xl p-3 bg-white shadow-lg'>
              <KText label={ghostCard.title} />
              {ghostCard.description ? <KText label={ghostCard.description} /> : null}
              <KText label={ghostCard.status} />
            </View>
          </Animated.View>
        )}

        <Pressable
          onPress={() => setIsCreateOpen(true)}
          className='absolute bottom-10 self-end bg-kanbee-yellow w-16 h-16 rounded-full items-center justify-center'
        >
          <KText
            label='+'
            className='text-white text-3xl font-light'
          />
        </Pressable>
        <CreateListModal
          visible={isCreateOpen}
          onSubmit={({ title }) => {
            addList({ title, boardId: id ? id : '', orderIndex: lists.length })
          }}
          onClose={() => setIsCreateOpen(false)}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  ghost: {
    position: 'absolute',
    top: 0,
    left: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
})

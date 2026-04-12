import { Card } from "@/core/entities";
import { useCardStore } from "@/store/useCardStore";
import { useListStore } from "@/store/useListStore";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import {
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const EDGE_ZONE = 60;
const SCROLL_SPEED = 10;
const LIST_HEADER_HEIGHT = 52;
const CARD_HEIGHT = 80;
const GAP = 10;

export const useDragAndDropBoard = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { cards, moveCard } = useCardStore();
  const lists = useListStore((state) => state.lists);

  const [ghostSize, setGhostSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [ghostCard, setGhostCard] = useState<Card | null>(null);
  const [hoverListId, setHoverListId] = useState<string | null>(null);
  const [hoverInsertIndex, setHoverInsertIndex] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const hoverListRef = useRef<string | null>(null);
  const scrollOffsetRef = useRef(0);
  const hoverInsertIndexRef = useRef(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listTopRef = useRef(0);

  const ghostX = useSharedValue(0);
  const ghostY = useSharedValue(0);
  const ghostScale = useSharedValue(1);
  const ghostOpacity = useSharedValue(1);

  const COLUMN_WIDTH = screenWidth * 0.8;

  const findTargetList = useCallback(
    (absoluteX: number): string | null => {
      const columnFullWidth = COLUMN_WIDTH + GAP * 2;
      const positionInContent = absoluteX + scrollOffsetRef.current;
      const columnIndex = Math.floor(positionInContent / columnFullWidth);

      if (columnIndex >= 0 && columnIndex < lists.length) {
        return lists[columnIndex].id;
      }
      return null;
    },
    [COLUMN_WIDTH, lists],
  );

  const handleDragStart = useCallback(
    (
      card: Card,
      absoluteX: number,
      absoluteY: number,
      width: number,
      height: number,
    ) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsDragging(true);
      setGhostCard(card);
      setGhostSize({ width, height });
      setHoverListId(null);
      hoverListRef.current = null;
      ghostX.value = absoluteX - width / 2;
      ghostY.value = absoluteY - height / 2;
      ghostScale.value = withSpring(1.05);
      ghostOpacity.value = 1;
    },
    [ghostX, ghostY, ghostScale, ghostOpacity],
  );

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setGhostCard(null);
    stopAutoScroll();
  }, []);

  const handleDragging = useCallback(
    (absoluteX: number, absoluteY: number) => {
      ghostX.value = absoluteX - ghostSize.width / 2;
      ghostY.value = absoluteY - ghostSize.height / 2;

      // Detectar sobre qué lista está el dedo
      const targetId = findTargetList(absoluteX);
      if (targetId !== hoverListRef.current) {
        if (targetId) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        hoverListRef.current = targetId;
        setHoverListId(targetId);
      }

      // Calcular índice de inserción basado en Y (funciona para cualquier lista)
      if (targetId) {
        const cardsTop = listTopRef.current + LIST_HEADER_HEIGHT;
        const relativeY = absoluteY - cardsTop;
        const index = Math.max(0, Math.round(relativeY / CARD_HEIGHT));
        const targetCards = cards
          .filter((c) => c.listId === targetId && c.id !== ghostCard?.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        const newInsertIndex = Math.min(index, targetCards.length);
        hoverInsertIndexRef.current = newInsertIndex;
        setHoverInsertIndex(newInsertIndex);
      }

      // Auto-scroll por bordes
      const maxScroll = (COLUMN_WIDTH + GAP * 2) * (lists.length - 1);

      if (absoluteX > screenWidth - EDGE_ZONE && !autoScrollRef.current) {
        autoScrollRef.current = setInterval(() => {
          scrollOffsetRef.current = Math.min(
            scrollOffsetRef.current + SCROLL_SPEED,
            maxScroll,
          );
          scrollRef.current?.scrollTo({
            x: scrollOffsetRef.current,
            animated: false,
          });
        }, 16);
      } else if (absoluteX < EDGE_ZONE && !autoScrollRef.current) {
        autoScrollRef.current = setInterval(() => {
          scrollOffsetRef.current = Math.max(
            scrollOffsetRef.current - SCROLL_SPEED,
            0,
          );
          scrollRef.current?.scrollTo({
            x: scrollOffsetRef.current,
            animated: false,
          });
        }, 16);
      } else if (
        absoluteX >= EDGE_ZONE &&
        absoluteX <= screenWidth - EDGE_ZONE
      ) {
        stopAutoScroll();
      }
    },
    [
      screenWidth,
      lists.length,
      COLUMN_WIDTH,
      ghostSize,
      findTargetList,
      ghostCard,
      cards,
    ],
  );

  const handleDrop = useCallback(
    (cardId: string, absoluteX: number, _absoluteY: number) => {
      const card = cards.find((c) => c.id === cardId);
      if (!card) return;

      const targetListId = findTargetList(absoluteX);

      if (targetListId) {
        const dropIndex = hoverInsertIndexRef.current;
        const isSameList = targetListId === card.listId;
        const isSamePosition = isSameList && card.orderIndex === dropIndex;

        if (!isSamePosition) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          moveCard(cardId, targetListId, dropIndex);

          if (!isSameList) {
            const targetIndex = lists.findIndex((l) => l.id === targetListId);
            if (targetIndex !== -1 && scrollRef.current) {
              scrollRef.current.scrollTo({
                x: (COLUMN_WIDTH + GAP * 2) * targetIndex,
                animated: true,
              });
            }
          }
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Animación de salida
      ghostScale.value = withSpring(0.9, { damping: 15 });
      ghostOpacity.value = withTiming(0, { duration: 200 });

      // Limpiar después de la animación
      setTimeout(() => {
        setGhostCard(null);
        setIsDragging(false);
        setHoverListId(null);
        setHoverInsertIndex(0);
        hoverInsertIndexRef.current = 0;
        hoverListRef.current = null;
      }, 220);

      stopAutoScroll();
    },
    [
      cards,
      lists,
      moveCard,
      findTargetList,
      COLUMN_WIDTH,
      ghostScale,
      ghostOpacity,
    ],
  );

  return {
    COLUMN_WIDTH,
    scrollOffsetRef,
    isDragging,
    ghostCard,
    ghostSize,
    hoverInsertIndex,
    hoverListId,
    scrollRef,
    listTopRef,
    ghostX,
    ghostScale,
    ghostY,
    ghostOpacity,
    handleDrop,
    handleDragStart,
    handleDragging,
    handleDragEnd,
  };
};

import { KText } from "@/components/KText";
import { Screen } from "@/components/Screen";
import { routeNames } from "@/constants/routeNames";
import { Card } from "@/core/entities/card";
import { CreateListModal } from "@/features/lists/components/CreateListModal";
import { ListColumn } from "@/features/lists/components/ListColumn";
import { useDragAndDropBoard } from "@/features/lists/hooks/useDragAndDropBoard";
import { useBoardStore } from "@/store/useBoardStore";
import { useCardStore } from "@/store/useCardStore";
import { useListStore } from "@/store/useListStore";
import { router, useLocalSearchParams } from "expo-router";
import { Settings } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const GAP = 10;

const goToSettingsBoard = (boardId: string) => {
  router.push({
    pathname: routeNames.board.settings(),
    params: { id: boardId },
  });
};

export default function BoardDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
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
  } = useDragAndDropBoard();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { boards, isLoading, fetchBoards } = useBoardStore();
  const { lists, fetchLists, addList, removeList, updateList } = useListStore();
  const { cards, fetchCards, addCard, updateCard, moveCard } = useCardStore();

  useEffect(() => {
    if (!boards.length && id) fetchBoards(id);
  }, [boards.length, id, fetchBoards]);

  useEffect(() => {
    if (id) fetchLists(id);
  }, [id, fetchLists]);

  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach((list) => fetchCards(list.id));
    }
  }, [lists.length]);

  const board = useMemo(() => boards.find((b) => b.id === id), [boards, id]);

  const cardsByList = useMemo(() => {
    const map: Record<string, Card[]> = {};

    for (const card of cards) {
      if (!map[card.listId]) {
        map[card.listId] = [];
      }
      map[card.listId].push(card);
    }

    // ordenar una sola vez
    for (const listId in map) {
      map[listId].sort((a, b) => a.orderIndex - b.orderIndex);
    }

    return map;
  }, [cards]);

  const ghostAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: ghostX.value },
      { translateY: ghostY.value },
      { scale: ghostScale.value },
    ],
    opacity: ghostOpacity.value,
  }));

  if (isLoading && !board) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#4F86F7" />
      </View>
    );
  }

  return (
    <Screen
      title={board?.title}
      rightIcon={
        <Pressable onPress={() => goToSettingsBoard(id ?? "")}>
          <Settings />
        </Pressable>
      }
    >
      <View className="flex-1">
        <ScrollView
          ref={scrollRef}
          onLayout={(e) => {
            e.target.measureInWindow((_x, y) => {
              listTopRef.current = y;
            });
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={COLUMN_WIDTH + GAP * 2}
          decelerationRate="fast"
          scrollEnabled={!isDragging}
          onScroll={(e) => {
            scrollOffsetRef.current = e.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
          className="flex-1 bg-slate-100 rounded-xl"
        >
          {lists.map((item, index) => {
            const listCards = cardsByList[item.id] || [];
            return (
              <View
                key={item.id}
                style={{ width: COLUMN_WIDTH, marginHorizontal: GAP, flex: 1 }}
              >
                <ListColumn
                  list={item}
                  cards={listCards}
                  columnIndex={index}
                  isDropTarget={hoverListId === item.id}
                  insertIndex={hoverListId === item.id ? hoverInsertIndex : -1}
                  draggedCardId={ghostCard?.id ?? null}
                  onEdit={(listId, data) => updateList(listId, data)}
                  onDelete={(listId) => removeList(listId)}
                  onAddCard={({
                    title,
                    description,
                    status,
                    priority,
                    responsibleId,
                    coverColor,
                    coverImage,
                    dueDate,
                    startDate,
                  }) => {
                    addCard({
                      title,
                      description,
                      listId: item.id,
                      status,
                      priority,
                      responsibleId,
                      coverColor,
                      coverImage,
                      dueDate,
                      startDate,
                      orderIndex: listCards.length,
                    });
                  }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragging={handleDragging}
                  onDrop={handleDrop}
                />
              </View>
            );
          })}
        </ScrollView>

        {/* Ghost card — flota por encima de todo */}
        {ghostCard && (
          <Animated.View
            style={[
              styles.ghost,
              { width: ghostSize.width },
              ghostAnimatedStyle,
            ]}
            pointerEvents="none"
          >
            <View className="gap-3 rounded-xl p-3 bg-white shadow-lg">
              <KText label={ghostCard.title} />
              {ghostCard.description ? (
                <KText label={ghostCard.description} />
              ) : null}
              <KText label={ghostCard.status} />
            </View>
          </Animated.View>
        )}

        <Pressable
          onPress={() => setIsCreateOpen(true)}
          className="absolute bottom-10 self-end bg-kanbee-yellow w-16 h-16 rounded-full items-center justify-center"
        >
          <KText label="+" className="text-white text-3xl font-light" />
        </Pressable>
        <CreateListModal
          visible={isCreateOpen}
          onSubmit={({ title, isArchived }) => {
            addList({
              title,
              boardId: id ? id : "",
              orderIndex: lists.length,
              isArchived,
            });
          }}
          onClose={() => setIsCreateOpen(false)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ghost: {
    position: "absolute",
    top: 0,
    left: 0,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
});

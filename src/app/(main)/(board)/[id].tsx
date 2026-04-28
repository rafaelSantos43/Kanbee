import { KText } from "@/components/KText";
import { Screen } from "@/components/Screen";
import { routeNames } from "@/constants/routeNames";
import { useBoardById } from "@/features/boards/hooks/useBoard";
import { useCreateCard } from "@/features/cards/hooks/useCard";
import { CreateListModal } from "@/features/lists/components/CreateListModal";
import { ListColumn } from "@/features/lists/components/ListColumn";
import { useDragAndDropBoard } from "@/features/lists/hooks/useDragAndDropBoard";
import { useCreateList, useListsByBoard } from "@/features/lists/hooks/useList";
import { useCardStore } from "@/store/useCardStore";
import { useListStore } from "@/store/useListStore";
import { router, useLocalSearchParams } from "expo-router";
import { Settings } from "lucide-react-native";
import { useState } from "react";
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
  const { board, isLoading } = useBoardById(id ?? "");

  const { lists, isLoading: isListsLoading } = useListsByBoard(id ?? "");
  const { mutate: addList } = useCreateList();
  const { removeList, updateList } = useListStore();
  const { mutate: addCard } = useCreateCard();
  const { fetchCards, updateCard, moveCard } = useCardStore();

  // const cardsByList = useMemo(() => {
  //   const map: Record<string, Card[]> = {};

  //   for (const card of cards) {
  //     if (!map[card.listId]) {
  //       map[card.listId] = [];
  //     }
  //     map[card.listId].push(card);
  //   }

  //   // ordenar una sola vez
  //   for (const listId in map) {
  //     map[listId].sort((a, b) => a.orderIndex - b.orderIndex);
  //   }

  //   return map;
  // }, [cards]);

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
          {lists?.map((item, index) => {
            return (
              <View
                key={item.id}
                style={{ width: COLUMN_WIDTH, marginHorizontal: GAP, flex: 1 }}
              >
                <ListColumn
                  list={item}
                  columnIndex={index}
                  isDropTarget={hoverListId === item.id}
                  insertIndex={hoverListId === item.id ? hoverInsertIndex : -1}
                  draggedCardId={ghostCard?.id ?? null}
                  onEdit={(listId, data) => updateList(listId, data)}
                  onDelete={(listId) => removeList(listId)}
                  onAddCard={(data, cardCount) => {
                    addCard(
                      {
                        card: {
                          ...data,
                          listId: item.id,
                          orderIndex: cardCount ?? 0,
                        },
                      },
                      {
                        onSuccess: () => setIsCreateOpen(false),
                      },
                    );
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
          isLoading={false}
          onSubmit={({ title, isArchived }) => {
            addList({
              title,
              boardId: id ? id : "",
              orderIndex: lists?.length ? lists.length : 0,
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

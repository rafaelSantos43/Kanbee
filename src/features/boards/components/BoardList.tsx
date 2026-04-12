import { KText } from "@/components/KText";
import { Board } from "@/core/entities";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useBoards } from "../hooks/useBoard";
import { BoardCard } from "./BoardCard";

const CARD_HEIGHT = 80;
const keyExtractor = (item: Board) => item.id;
const renderItem = ({ item }: { item: Board }) => <BoardCard board={item} />;

export const BoardList = ({ searchText }: { searchText: string }) => {
  const { boards, isLoading, refetch } = useBoards();

  const filtered = useMemo(() => {
    if (!boards) return [];
    if (!searchText.trim()) return boards;

    const lowSearchText = searchText.toLowerCase();
    return boards?.filter(
      (b) => b?.title.toLowerCase().includes(lowSearchText) ?? false,
    );
  }, [boards, searchText]);

  if (isLoading && !boards) {
    return <ActivityIndicator size="large" color="#4F86F7" className="mt-20" />;
  }

  return (
    <View>
      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        renderItem={renderItem}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={() => (
          <View className="items-center py-20">
            <KText
              className="text-slate-400"
              label="No hay tableros todavía."
            />
          </View>
        )}
      />
    </View>
  );
};

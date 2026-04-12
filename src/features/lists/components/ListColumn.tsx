import { KText } from "@/components/KText";
import { Card, List } from "@/core/entities";
import { CreateCardModal } from "@/features/cards/components/CreateCardModal";
import { DraggableCard } from "@/features/cards/components/DraggableCard";
import { useState } from "react";
import { Pressable, View } from "react-native";

type ListColumnProps = {
  list: List;
  cards: Card[];
  columnIndex: number;
  isDropTarget: boolean;
  insertIndex: number;
  draggedCardId: string | null;
  onEdit: (
    id: string,
    data: Partial<Pick<List, "title" | "orderIndex">>,
  ) => void;
  onDelete: (id: string) => void;
  onAddCard: (data: {
    title: string;
    description?: string;
    status: Card["status"];
    priority?: Card["priority"];
    responsibleId?: Card["responsibleId"];
    coverColor?: Card["coverColor"];
    coverImage?: Card["coverImage"];
    dueDate?: Card["dueDate"];
    startDate?: Card["startDate"];
  }) => void;
  onDragStart: (
    card: Card,
    absoluteX: number,
    absoluteY: number,
    width: number,
    height: number,
  ) => void;
  onDragEnd: () => void;
  onDragging: (absoluteX: number, absoluteY: number) => void;
  onDrop: (cardId: string, absoluteX: number, absoluteY: number) => void;
};

export const ListColumn = ({
  list,
  cards,
  columnIndex,
  isDropTarget,
  insertIndex,
  draggedCardId,
  onEdit,
  onDelete,
  onAddCard,
  onDragStart,
  onDragEnd,
  onDragging,
  onDrop,
}: ListColumnProps) => {
  const [visible, setVisible] = useState(false);

  const showPlaceholder = isDropTarget && insertIndex >= 0;

  return (
    <View className="flex-1 px-4">
      <View className="py-3 flex-row justify-between items-center">
        <KText variant="h2" label={`${list.title} (${cards.length})`} />
        <KText variant="h2" label="..." />
      </View>

      <View className="flex-1">
        {cards.length === 0 && !showPlaceholder && (
          <View className="flex-1 items-center justify-center py-10">
            <KText label="No cards yet" className="text-neutralDark-300" />
          </View>
        )}

        {/* Todas las cards se quedan en el DOM — la arrastrada baja a opacity 0.3 vía DraggableCard */}
        {cards.map((item) => (
          <DraggableCard
            key={item.id}
            card={item}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragging={onDragging}
            onDrop={onDrop}
          />
        ))}

        {/* Indicador de dónde se va a soltar */}
        {showPlaceholder && (
          <View
            className="absolute h-20 w-full rounded border-2 border-dashed border-blue-500"
            style={{
              top: insertIndex * 120 + 90,
            }}
          />
        )}
      </View>

      <Pressable
        onPress={() => setVisible(true)}
        className="mb-4 self-center p-3 w-72 bg-blue-500 rounded-xl items-center bg-"
      >
        <KText className="text-neutral-200 font-semibold" label="CREATE_CARD" />
      </Pressable>

      <CreateCardModal
        visible={visible}
        onSubmit={(data) => {
          onAddCard(data);
        }}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};

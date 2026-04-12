import { useState } from "react";
import { Pressable, View } from "react-native";

import { Screen } from "@/components/Screen";
import { CreateBoardModal } from "@/features/boards/components/CreateBoardModal";
import { SearchBoard } from "@/features/boards/components/SearchBoard";

import { BoardList } from "@/features/boards/components/BoardList";
import { BoardsHeaderLeft } from "@/features/boards/components/BoardsHeaderLeft";
import { BoardsHeaderRight } from "@/features/boards/components/BoardsHeaderRight";
import { useCreateBoard } from "@/features/boards/hooks/useBoard";
import { useSessionStore } from "@/store/useSessionStore";
import { Plus } from "lucide-react-native";

export default function BoardsScreen() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const user = useSessionStore((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const { mutate: addBoard } = useCreateBoard();

  return (
    <Screen
      enableBack={false}
      leftIcon={<BoardsHeaderLeft />}
      rightIcon={<BoardsHeaderRight />}
    >
      <View className="flex-1">
        <SearchBoard searchText={searchText} onSearch={setSearchText} />

        <BoardList searchText={searchText} />

        <Pressable
          onPress={() => setIsCreateOpen(true)}
          className="absolute bottom-10 self-end bg-kanbee-yellow w-16 h-16 rounded-full items-center justify-center"
        >
          <Plus />
        </Pressable>

        <CreateBoardModal
          visible={isCreateOpen}
          onSubmit={({ title, description, color, coverImage, isPublic }) => {
            addBoard(
              {
                userId: user?.id ?? "",
                title,
                description,
                color,
                coverImage,
                isFavorite: false,
                isPublic,
              },
              { onSuccess: () => setIsCreateOpen(false) },
            );
          }}
          onClose={() => setIsCreateOpen(false)}
        />
      </View>
    </Screen>
  );
}

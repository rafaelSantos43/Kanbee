import { KText } from "@/components/KText";
import { KTextInput } from "@/components/KTextInput";
import { Screen } from "@/components/Screen";
import { useBoardStore } from "@/store/useBoardStore";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { FolderKanban } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function SettingsBoard() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const board = useBoardStore(
    useShallow((state) => state.boards.find((b) => b.id === id)),
  );

  const { updateBoard, isLoading, error } = useBoardStore();

  const [title, setTitle] = useState(board?.title || "");
  const [description, setDescription] = useState(board?.description || "");

  const handleSave = async () => {
    if (!board) return;
    try {
      await updateBoard(board.id, { title, description });
      Alert.alert("Success", "Board updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update board");
    }
  };

  return (
    <Screen title="Settings">
      <View className="flex-1">
        <TouchableOpacity className="bg-blue-200 opacity-70 items-center h-48 justify-center mb-4 rounded-xl">
          {board?.coverImage ? (
            <Image source={{ uri: board?.coverImage }} />
          ) : (
            <FolderKanban />
          )}

          <KText label="Change cover image" />
        </TouchableOpacity>
        <View className="flex-1">
          <KTextInput label="TITLE" value={title} onChangeText={setTitle} />
          <KTextInput
            label="DESCRIPTION "
            multiline
            value={description}
            onChangeText={setDescription}
            inputClassName="max-h-44"
          />
        </View>

        <Pressable
          disabled={isLoading}
          onPress={handleSave}
          className=" items-center p-4 rounded-xl bg-blue-500"
        >
          <KText
            label={isLoading ? "Saving..." : "Save"}
            className="font-bold text-neutral-200"
          />
        </Pressable>
      </View>
    </Screen>
  );
}

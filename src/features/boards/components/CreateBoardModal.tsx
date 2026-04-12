import { KText } from "@/components/KText";
import { KTextInput } from "@/components/KTextInput";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Switch,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onSubmit: (data: {
    title: string;
    description?: string;
    color?: string;
    coverImage?: string;
    isPublic?: boolean;
  }) => void;
};

export function CreateBoardModal({
  visible,
  onClose,
  isLoading,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4f46e5");
  const [coverImage, setCoverImage] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      color: color.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      isPublic: isPublic,
    });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setColor("#4f46e5");
    setCoverImage("");
    setIsPublic(false);
    onClose();
  };

  const isIOS = Platform.OS === "ios";

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={isIOS ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={isIOS ? 80 : 0}
      >
        <View className="flex-1 bg-black/60">
          <Pressable className="flex-1" onPress={handleClose} />

          <View
            className={
              isIOS
                ? "mx-4 mb-10 rounded-3xl bg-neutral-100 p-6"
                : "mt-auto rounded-t-3xl bg-neutral-100 p-6"
            }
          >
            <KText variant="label" label="CREATE BOARD" />
            <KText
              variant="body"
              label=" Give your board a name and optional color."
            />

            <KTextInput
              label="TITLE"
              value={title}
              onChangeText={setTitle}
              placeholder="Project roadmap"
              className="px-3 "
            />

            <KTextInput
              label="DESCRIPTION"
              value={description}
              onChangeText={setDescription}
              placeholder="Board description"
              className="px-3"
            />

            <KTextInput
              label="COLOR (hex)"
              value={color}
              onChangeText={setColor}
              placeholder="#4f46e5"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              className="px-3"
            />

            <KTextInput
              label="COVER_IMAGE"
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="https://..."
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
              className="px-3"
            />

            <View className="flex-row items-center justify-between px-3 py-2 ">
              <KText variant="label" label="Make board public?" />
              <Switch value={isPublic} onValueChange={setIsPublic} />
            </View>

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={handleClose}
                className="h-10 px-4 rounded-full border border-neutral-700 items-center justify-center"
              >
                <KText className="text-xs" label="CANCEL" />
              </Pressable>

              <Pressable
                disabled={isLoading}
                onPress={handleSubmit}
                className="h-10 px-5 rounded-full bg-kanbee-yellow items-center justify-center"
              >
                <KText className="text-xs" label="CREATE" />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

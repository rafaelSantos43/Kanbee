import { KText } from "@/components/KText";
import { KTextInput } from "@/components/KTextInput";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onSubmit: ({
    title,
    isArchived,
  }: {
    title: string;
    isArchived?: boolean;
  }) => void;
  onClose: () => void;
};
const isIOS = Platform.OS === "ios";

export const CreateListModal = ({ visible, onSubmit, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [isArchived, setIsArchived] = useState("false");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      isArchived: isArchived.trim().toLowerCase() === "true",
    });
    setTitle("");
    setIsArchived("false");
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={isIOS ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={isIOS ? 80 : 0}
      >
        <View className="flex-1 bg-black/60">
          <Pressable className="flex-1" onPress={onClose} />

          <View
            className={
              isIOS
                ? "mx-4 mb-10 rounded-3xl bg-neutral-100 p-6"
                : "mt-auto rounded-t-3xl bg-neutral-100 p-6"
            }
          >
            <KText variant="label" label="CREATE_LIST" />

            <KText
              variant="caption"
              className="text-neutral-400"
              label="GIVE_YOUR_LIST_NAME"
            />
            <KTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="list name"
              placeholderTextColor="#9ca3af"
              className="px-3"
            />

            <KTextInput
              label="IS_ARCHIVED"
              value={isArchived}
              onChangeText={setIsArchived}
              placeholder="IS_ARCHIVED"
              placeholderTextColor="#9ca3af"
              className="px-3"
            />

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={onClose}
                className="h-10 px-4 rounded-full border border-neutral-700 items-center justify-center"
              >
                <KText label="CANCEL" />
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                className="h-10 px-5 rounded-full bg-kanbee-yellow items-center justify-center"
              >
                <KText label="CREATE" />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

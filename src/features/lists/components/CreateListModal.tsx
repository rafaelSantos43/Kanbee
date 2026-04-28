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
  isLoading?: boolean;
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

export const CreateListModal = ({
  visible,
  onSubmit,
  isLoading,
  onClose,
}: Props) => {
  const [title, setTitle] = useState("");
  const [isArchived, setIsArchived] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      isArchived: isArchived,
    });
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setIsArchived(false);
    onClose();
  };
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

            <View className="flex-row items-center justify-between px-3 py-2 ">
              <KText variant="label" label="Make list archived?" />
              <Switch value={isArchived} onValueChange={setIsArchived} />
            </View>

            <View className="flex-row justify-end gap-3">
              <Pressable
                onPress={handleClose}
                className="h-10 px-4 rounded-full border border-neutral-700 items-center justify-center"
              >
                <KText label="CANCEL" />
              </Pressable>

              <Pressable
                disabled={isLoading}
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

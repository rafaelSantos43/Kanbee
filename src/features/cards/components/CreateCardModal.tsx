import { KText } from "@/components/KText";
import { KTextInput } from "@/components/KTextInput";
import { Card, CardPriority, CardStatus } from "@/core/entities";
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
  onSubmit: (data: {
    title: string;
    description?: string;
    status: CardStatus;
    priority?: CardPriority;
    responsibleId?: string;
    coverColor?: string;
    coverImage?: string;
    dueDate?: number;
    startDate?: number;
  }) => void;
  onClose: () => void;
};

const CARD_STATUSES: CardStatus[] = ["todo", "in-progress", "done", "blocked"];
const CARD_PRIORITIES: CardPriority[] = ["low", "medium", "high", "critical"];

const normalizeStatus = (value: string): CardStatus => {
  const normalized = value.trim().toLowerCase() as CardStatus;
  return CARD_STATUSES.includes(normalized) ? normalized : "todo";
};

const normalizePriority = (value: string): CardPriority | undefined => {
  const normalized = value.trim().toLowerCase() as CardPriority;
  return CARD_PRIORITIES.includes(normalized) ? normalized : undefined;
};

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isIOS = Platform.OS === "ios";
export const CreateCardModal = ({ visible, onSubmit, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CardStatus>("todo");
  const [priority, setPriority] = useState("");
  const [responsibleId, setResponsibleId] = useState("");
  const [coverColor, setCoverColor] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: normalizeOptionalText(description),
      status,
      priority: normalizePriority(priority),
      responsibleId: normalizeOptionalText(responsibleId),
      coverColor: normalizeOptionalText(coverColor),
      coverImage: normalizeOptionalText(coverImage),
      dueDate: normalizeOptionalNumber(dueDate),
      startDate: normalizeOptionalNumber(startDate),
    });

    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("");
    setResponsibleId("");
    setCoverColor("");
    setCoverImage("");
    setDueDate("");
    setStartDate("");
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
            <KText variant="label" label="CREATE_CARD" />

            <KTextInput
              value={title}
              onChangeText={setTitle}
              placeholder="TITLE"
              className="px-3"
            />

            <KTextInput
              value={description}
              onChangeText={setDescription}
              placeholder="DESCRIPTION"
              className="px-3"
            />

            <KTextInput
              value={status}
              onChangeText={(value) => setStatus(normalizeStatus(value))}
              placeholder="STATUS"
              className="px-3"
            />

            <KTextInput
              value={priority}
              onChangeText={setPriority}
              placeholder="PRIORITY"
              className="px-3"
            />

            <KTextInput
              value={responsibleId}
              onChangeText={setResponsibleId}
              placeholder="RESPONSIBLE_ID"
              className="px-3"
            />

            <KTextInput
              value={coverColor}
              onChangeText={setCoverColor}
              placeholder="COVER_COLOR"
              className="px-3"
            />

            <KTextInput
              value={coverImage}
              onChangeText={setCoverImage}
              placeholder="COVER_IMAGE"
              className="px-3"
            />

            <KTextInput
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="DUE_DATE"
              keyboardType="numeric"
              className="px-3"
            />

            <KTextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="START_DATE"
              keyboardType="numeric"
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

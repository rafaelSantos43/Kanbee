import { KText } from "@/components/KText";
import { UserImage } from "@/components/UserImage";
import { Card } from "@/core/entities";
import { router } from "expo-router";
import { useRef } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type DraggableCardProps = {
  card: Card;
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

const goToCardDetails = (cardId: string) => {
  router.push({
    pathname: "/(main)/(cardDetails)",
    params: { id: cardId },
  });
};

export const DraggableCard = ({
  card,
  onDragStart,
  onDragEnd,
  onDragging,
  onDrop,
}: DraggableCardProps) => {
  const viewRef = useRef<View>(null);
  const isDragging = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isDragging.value ? 0.3 : 1,
  }));

  const handleDragStart = (absX: number, absY: number) => {
    viewRef.current?.measureInWindow((x, y, width, height) => {
      onDragStart(card, absX, absY, width, height);
    });
  };

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(200)
    .onStart((event) => {
      isDragging.value = true;
      runOnJS(handleDragStart)(event.absoluteX, event.absoluteY);
    })
    .onUpdate((event) => {
      runOnJS(onDragging)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      isDragging.value = false;
      runOnJS(onDrop)(card.id, event.absoluteX, event.absoluteY);
      runOnJS(onDragEnd)();
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={() => goToCardDetails(card.id)}
          ref={viewRef}
          className=" gap-3 my-3 rounded-xl p-4 bg-white"
        >
          <KText variant="label" label={card.title} />
          {card.description ? (
            <View className="px-1">
              <KText variant="body" label={card.description} />
            </View>
          ) : null}
          <View className="flex-row justify-between">
            <KText label={card.status} />
            <UserImage userDefault="John Doe" />
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

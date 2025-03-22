import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = 60;
const ITEM_SPACING = 10;

// Define colors for interpolation
const LOW_PRIORITY_COLOR = '#4CAF50';    // Green
const MID_PRIORITY_COLOR = '#FFC107';    // Yellow
const HIGH_PRIORITY_COLOR = '#F44336';   // Red
const INACTIVE_COLOR = '#666666';        // Gray

interface PrioritySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function PrioritySlider({ value, onChange }: PrioritySliderProps) {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [scrollX] = React.useState(() => new Animated.Value(0));
  const colorAnims = React.useRef<Animated.Value[]>([]);
  const priorities = Array.from({ length: 10 }, (_, i) => i + 1);
  
  // Initialize color animations if they don't exist
  if (colorAnims.current.length === 0) {
    colorAnims.current = priorities.map(() => new Animated.Value(0));
  }

  React.useEffect(() => {
    // Scroll to the initial value
    scrollViewRef.current?.scrollTo({
      x: (value - 1) * (ITEM_WIDTH + ITEM_SPACING),
      animated: false,
    });

    // Animate colors when value changes
    colorAnims.current.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index + 1 === value ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
  }, [value]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (ITEM_WIDTH + ITEM_SPACING));
    const newValue = priorities[index];
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {priorities.map((priority, index) => {
          const inputRange = [
            (priority - 2) * (ITEM_WIDTH + ITEM_SPACING),
            (priority - 1) * (ITEM_WIDTH + ITEM_SPACING),
            priority * (ITEM_WIDTH + ITEM_SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          // Get the target color based on priority
          let targetColor;
          if (priority <= 3) targetColor = LOW_PRIORITY_COLOR;
          else if (priority <= 7) targetColor = MID_PRIORITY_COLOR;
          else targetColor = HIGH_PRIORITY_COLOR;

          // Interpolate color based on selection state
          const color = colorAnims.current[index].interpolate({
            inputRange: [0, 1],
            outputRange: [INACTIVE_COLOR, targetColor],
          });

          return (
            <Animated.View
              key={priority}
              style={[
                styles.itemContainer,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.priorityText,
                  { color },
                ]}
              >
                {priority}
              </Animated.Text>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

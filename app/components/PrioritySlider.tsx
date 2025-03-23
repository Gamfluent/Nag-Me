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
  const priorities = Array.from({ length: 10 }, (_, i) => i + 1);

  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: (value - 1) * (ITEM_WIDTH + ITEM_SPACING),
      animated: true,
    });
  }, [value]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (ITEM_WIDTH + ITEM_SPACING));
    const newValue = priorities[Math.min(index, priorities.length - 1)];
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const getColorForPriority = (priority: number) => {
    if (priority <= 3) return LOW_PRIORITY_COLOR;
    if (priority <= 7) return MID_PRIORITY_COLOR;
    return HIGH_PRIORITY_COLOR;
  };

  return (
    <View style={styles.container}>
      <View style={styles.track} />
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
        {priorities.map((priority) => {
          const inputRange = [
            (priority - 2) * (ITEM_WIDTH + ITEM_SPACING),
            (priority - 1) * (ITEM_WIDTH + ITEM_SPACING),
            priority * (ITEM_WIDTH + ITEM_SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1.2, 0.9],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
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
              <Text
                style={[
                  styles.priorityText,
                  {
                    color: priority === value
                      ? getColorForPriority(priority)
                      : INACTIVE_COLOR,
                  },
                ]}
              >
                {priority}
              </Text>
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
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#E0E0E0',
    left: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
    right: SCREEN_WIDTH / 2 - ITEM_WIDTH / 2,
    top: '50%',
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

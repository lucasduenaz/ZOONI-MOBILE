import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function SkeletonLoader({ width, height, borderRadius = 8, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, borderRadius, opacity }, style]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#D0D0D0',
  },
});

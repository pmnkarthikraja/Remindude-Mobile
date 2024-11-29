import React, { useEffect, useRef, useState } from 'react';
import { Modal, Text, View, StyleSheet, Animated } from 'react-native';

interface SyncModalProps {
  visible: boolean;
  onRequestClose: () => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ visible, onRequestClose }) => {
  const lineAnim = useRef(new Animated.Value(0)).current; // Animation for the line
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      startShakingAnimation();
    }
  }, [visible]);

  const startShakingAnimation = () => {
    setIsAnimating(true);
    lineAnim.setValue(0); // Reset animation value

    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 2,
          duration: 500, // Duration for the shaking motion
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const translateX = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10], // Adjust the value for shaking distance
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Syncing Data to online...</Text>
          <Text style={styles.modalDescription}>Please Wait..</Text>
          <View style={styles.lineContainer}>
            {isAnimating && (
              <Animated.View
                style={[styles.shakeLine, { transform: [{ translateX }] }]}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lineContainer: {
    width: '100%',
    height: 2,
    backgroundColor: '#ddd', // Line color
    marginTop: 20,
    overflow: 'hidden',
  },
  shakeLine: {
    width: '50%',
    height: '100%',
    marginHorizontal:'auto',
    backgroundColor: '#4CAF50', // Line color (green for example)
  },
});

export default SyncModal;

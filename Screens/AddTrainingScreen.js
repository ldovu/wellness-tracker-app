import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const AddTrainingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Add Training Screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f9f8eb",
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddTrainingScreen;

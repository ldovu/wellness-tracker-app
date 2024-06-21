import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

/**
 * DatePicker component displays a date picker for selecting a date.
 * The component uses the DateTimePicker component from @react-native-community/datetimepicker.
 */

const DatePicker = ({ onSelectDate }) => {
  // State to keep track of the selected date initialized with the current date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handle date change event and update the state of selectedDate
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setSelectedDate(currentDate);
    onSelectDate(currentDate); // Callback to parent component with selected date
  };

  // Set the maximum selectable date to today
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate()); // Next day

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.textOptions}>Date</Text>

        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          maximumDate={maxDate}
          onChange={onChange}
          style={styles.datePicker}
        />
      </View>
    </SafeAreaView>
  );
};

// Style definition for the element of the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  textOptions: {
    flex: 1,
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 40,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
    marginTop: 20,
  },
  datePicker: {
    marginRight: 55,
  },
});

export default DatePicker;

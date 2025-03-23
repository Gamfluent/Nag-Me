import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton, SegmentedButtons } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../../store/taskStore';
import PrioritySlider from '../components/PrioritySlider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTask() {
  const params = useLocalSearchParams();
  const addTask = useTaskStore((state) => state.addTask);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState(5);
  const [dueDate, setDueDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [mode, setMode] = React.useState(params.mode === 'ai' ? 'ai' : 'manual');
  const [aiPrompt, setAiPrompt] = React.useState('');

  const handleAddTask = () => {
    if (mode === 'manual') {
      addTask({
        id: Date.now().toString(),
        title,
        description,
        priority,
        dueDate: dueDate.toISOString(),
        completed: false,
      });
    } else {
      // Here we'll handle AI task generation later
      console.log('AI task generation:', aiPrompt);
    }
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        icon="close"
        size={24}
        onPress={() => router.back()}
        style={styles.closeButton}
      />
      
      <SegmentedButtons
        value={mode}
        onValueChange={setMode}
        buttons={[
          { value: 'manual', label: 'Manual' },
          { value: 'ai', label: 'AI Assistant' }
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.content}>
        {mode === 'manual' ? (
          <>
            <TextInput
              label="Task Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
              numberOfLines={3}
              mode="outlined"
            />
            <Text style={styles.label}>Priority</Text>
            <PrioritySlider value={priority} onChange={setPriority} />
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              Due Date: {dueDate.toLocaleDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                onChange={handleDateChange}
              />
            )}
          </>
        ) : (
          <View style={styles.aiContainer}>
            <Text style={styles.aiPrompt}>
              Describe your task in natural language and I'll help you create it.
            </Text>
            <TextInput
              label="What would you like to do?"
              value={aiPrompt}
              onChangeText={setAiPrompt}
              style={styles.input}
              multiline
              numberOfLines={4}
              mode="outlined"
              placeholder="e.g., Remind me to call mom every Sunday at 6 PM with high priority"
            />
          </View>
        )}
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleAddTask}
        style={styles.addButton}
        disabled={mode === 'manual' ? !title : !aiPrompt}
      >
        {mode === 'manual' ? 'Add Task' : 'Generate Task'}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  addButton: {
    margin: 16,
  },
  aiContainer: {
    flex: 1,
  },
  aiPrompt: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
});

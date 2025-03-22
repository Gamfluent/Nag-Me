import * as React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../store/taskStore';
import PrioritySlider from './components/PrioritySlider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTask() {
  const { taskId: rawTaskId } = useLocalSearchParams();
  const taskId = Array.isArray(rawTaskId) ? rawTaskId[0] : rawTaskId;
  const { tasks, addTask, updateTask } = useTaskStore();
  
  const task = React.useMemo(() => {
    if (taskId) {
      return tasks.find(t => t.id === taskId);
    }
    return null;
  }, [taskId, tasks]);

  const [title, setTitle] = React.useState(task?.title || '');
  const [description, setDescription] = React.useState(task?.description || '');
  const [priority, setPriority] = React.useState(task?.priority || 5);
  const [dueDate, setDueDate] = React.useState(task ? new Date(task.dueDate) : new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const handleSubmit = async () => {
    try {
      if (taskId && task) {
        await updateTask(taskId, {
          title,
          description,
          priority,
          dueDate: dueDate.toISOString(),
        });
      } else {
        await addTask({
          title,
          description,
          priority,
          dueDate: dueDate.toISOString(),
        });
      }
      router.back();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="headlineMedium" style={styles.headerTitle}>
          {taskId ? 'Edit Task' : 'Add New Task'}
        </Text>
        <View style={{ width: 48 }} /> {/* Spacer to center title */}
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TextInput
          label="Task Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Priority</Text>
        <PrioritySlider value={priority} onChange={setPriority} />

        <Text variant="titleMedium" style={styles.sectionTitle}>Due Date & Time</Text>
        
        <View style={styles.dateTimeContainer}>
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(true)}
            style={styles.dateTimeButton}
          >
            <Text>{dueDate.toLocaleDateString()}</Text>
          </Button>
          
          <Button 
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
            style={styles.dateTimeButton}
          >
            <Text>{dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </Button>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="inline"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}

        <Button 
          mode="contained" 
          onPress={handleSubmit}
          disabled={!title}
          style={styles.submitButton}
        >
          <Text>{taskId ? 'Update' : 'Add'} Task</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateTimeButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
  },
});

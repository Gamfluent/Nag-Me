import * as React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, FAB, Card, IconButton, Menu, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useTaskStore, type Task } from '../store/taskStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { tasks, toggleComplete, deleteTask } = useTaskStore();
  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);
  const theme = useTheme();
  const [isAddMenuVisible, setIsAddMenuVisible] = React.useState(false);

  const isOverdue = (task: Task) => {
    if (task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < new Date();
  };

  const sortTasks = (taskList: Task[]) => {
    return [...taskList].sort((a, b) => {
      // First sort by due date
      const dateComparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // Then by priority (higher priority first)
      return b.priority - a.priority;
    });
  };

  const pendingTasks = sortTasks(tasks.filter(task => !task.completed));
  const completedTasks = sortTasks(tasks.filter(task => task.completed));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLongPress = (taskId: string) => {
    setMenuVisible(taskId);
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 3) return '#4CAF50'; // success color
    if (priority <= 7) return '#FFA000'; // warning color
    return theme.colors.error;
  };

  const renderTask = (task: Task) => {
    const overdue = isOverdue(task);
    
    return (
      <Pressable
        key={task.id}
        onLongPress={() => handleLongPress(task.id)}
        delayLongPress={300}
      >
        <Card 
          style={[
            styles.taskCard,
            overdue && styles.overdueCard
          ]}
        >
          <Card.Content>
            <View style={styles.taskHeader}>
              <View style={styles.taskTitleContainer}>
                <Text 
                  variant="titleMedium" 
                  style={[
                    task.completed && styles.completedText,
                    overdue && styles.overdueText
                  ]}
                >
                  {task.title}
                </Text>
                <Text variant="bodySmall" style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                  Priority: {task.priority}
                </Text>
              </View>
              <View style={styles.taskActions}>
                <Menu
                  visible={menuVisible === task.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <IconButton
                      icon={task.completed ? "checkbox-marked" : "checkbox-blank-outline"}
                      onPress={() => toggleComplete(task.id)}
                    />
                  }
                >
                  <Menu.Item 
                    onPress={() => {
                      setMenuVisible(null);
                      router.push(`/(screens)/add-task?taskId=${task.id}`);
                    }} 
                    title={<Text>Edit</Text>}
                  />
                  <Menu.Item 
                    onPress={() => {
                      setMenuVisible(null);
                      deleteTask(task.id);
                    }} 
                    title={<Text style={{ color: theme.colors.error }}>Delete</Text>}
                  />
                </Menu>
              </View>
            </View>
            {task.description ? (
              <Text 
                variant="bodyMedium" 
                style={[
                  styles.description,
                  task.completed && styles.completedText,
                  overdue && styles.overdueText
                ]}
              >
                {task.description}
              </Text>
            ) : null}
            <Text 
              variant="bodySmall" 
              style={[
                styles.dueDate,
                overdue && styles.overdueText
              ]}
            >
              Due: {formatDate(task.dueDate)}
              {overdue && ' (Overdue)'}
            </Text>
          </Card.Content>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.headerTitle}>
          Nag Me
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Pending Tasks</Text>
        {pendingTasks.length === 0 ? (
          <Text style={styles.emptyText}>No pending tasks</Text>
        ) : (
          pendingTasks.map(renderTask)
        )}

        <Text variant="titleLarge" style={[styles.sectionTitle, styles.completedSection]}>
          Completed Tasks
        </Text>
        {completedTasks.length === 0 ? (
          <Text style={styles.emptyText}>No completed tasks</Text>
        ) : (
          completedTasks.map(renderTask)
        )}
      </ScrollView>

      {isAddMenuVisible && (
        <View style={styles.addButtonsContainer}>
          <FAB
            icon="robot"
            label="AI Add"
            style={styles.addButton}
            onPress={() => {
              setIsAddMenuVisible(false);
              router.push('/(screens)/add-task?mode=ai');
            }}
          />
          <FAB
            icon="pencil"
            label="Manual Add"
            style={styles.addButton}
            onPress={() => {
              setIsAddMenuVisible(false);
              router.push('/(screens)/add-task');
            }}
          />
        </View>
      )}

      <FAB
        icon={isAddMenuVisible ? 'close' : 'plus'}
        style={styles.mainFab}
        onPress={() => setIsAddMenuVisible(!isAddMenuVisible)}
      />
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
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  sectionTitle: {
    marginBottom: 16,
  },
  completedSection: {
    marginTop: 32,
  },
  taskCard: {
    marginBottom: 8,
  },
  overdueCard: {
    borderColor: '#FF4444',
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    marginTop: 8,
  },
  dueDate: {
    marginTop: 8,
    opacity: 0.7,
  },
  priorityText: {
    marginTop: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  overdueText: {
    color: '#FF4444',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    marginBottom: 16,
  },
  addButtonsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 88,
    alignItems: 'flex-end',
    gap: 8,
  },
  addButton: {
    marginBottom: 8,
  },
  mainFab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

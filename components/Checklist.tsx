import { SubTask, Task } from '@/utils/task';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import uuid from 'react-native-uuid';
import { Input, Text, XStack, YStack } from 'tamagui';


interface ChecklistProps {
    setValue: UseFormSetValue<Task>,
    initialSubTasks: SubTask[],
    isEdit: boolean
}

const Checklist: FunctionComponent<ChecklistProps> = ({
    initialSubTasks,
    isEdit,
    setValue
}) => {
    const [tasks, setTasks] = useState(initialSubTasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const colorscheme = useColorScheme()

    useEffect(() => {
        setTasks(initialSubTasks)
    }, [initialSubTasks])

    const toggleComplete = (id: string) => {
        setValue('subTasks', tasks.map(task =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        ))
    };

    const addTask = () => {
        if (newTaskTitle.trim()) {
            setValue('subTasks', [...tasks, { id: uuid.v4().toString(), title: newTaskTitle, isCompleted: false }])
            setNewTaskTitle('');
        }
    };

    const handleDeleteSubtask = (id: string) => {
        const updatedSubtasks = tasks.filter((subtask, i) => subtask.id !== id);
        setValue('subTasks', updatedSubtasks)
    };


    return (
        <YStack space="$4">
            <Text style={styles.header}>Checklist</Text>

            {tasks.map((task) => (
                <XStack key={task.id} alignItems="center" justifyContent="space-between" space="$3" style={styles.taskRow}>
                    <Ionicons name="ellipsis-vertical" size={24} color="gray" />

                    <TouchableOpacity onPress={() => toggleComplete(task.id)} style={styles.checkbox}>
                        {task.isCompleted ? (
                            <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
                        ) : (
                            <Ionicons name="ellipse-outline" size={24} color="gray" />
                        )}
                    </TouchableOpacity>

                    <Text style={task.isCompleted ? styles.completedText : [styles.taskText, { color: colorscheme == 'light' ? 'black' : 'white' }]}>
                        {task.title}
                    </Text>

                    <AntDesign name="delete" size={15} color={'red'} style={{ padding: 5 }}
                        onPress={() => handleDeleteSubtask(task.id)} />
                </XStack>
            ))}

            <XStack space="$3" alignItems="center" marginBottom={20}>
                <Input
                    placeholder="Add checklist item"
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    style={styles.input}
                />
                <TouchableOpacity onPress={addTask}>
                    <Ionicons name="add-circle-outline" size={24} color="#007BFF" />
                </TouchableOpacity>
            </XStack>
        </YStack>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 10,
    },
    taskRow: {
        // borderBottomWidth: 0.2,
        // borderBottomColor: '#ddd',
        paddingBottom: 10,
        marginBottom: 10,
    },
    taskText: {
        flex: 1,
        fontSize: 16,
        color: 'black',
        marginLeft: 10,
    },
    completedText: {
        flex: 1,
        fontSize: 16,
        color: 'gray',
        marginLeft: 10,
        textDecorationLine: 'line-through',
    },
    checkbox: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
});

export default Checklist;

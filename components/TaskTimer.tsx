import { Task } from '@/utils/task';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { ThemedText } from './ThemedText';

const TaskTimer: FunctionComponent<{ task: Task }> = ({ task }) => {
    const [timeLeft, setTimeLeft] = useState<string>('00h 00m 00s');
    const [isTaskOverdue, setIsTaskOverdue] = useState<boolean>(false);
 
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const taskDate = new Date(task.datetime);
            const difference = taskDate.getTime() - now.getTime();
            const today = now.toLocaleDateString();
            const taskDateString = taskDate.toLocaleDateString();

            if (difference > 0) {
                // Task is in the future
                if (today === taskDateString) {
                    // Task is due today
                    const hours = Math.floor(difference / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                    setTimeLeft(`in ${hours}h ${minutes}m ${seconds}s ...`);
                    setIsTaskOverdue(false);
                } else {
                    // Task is in the future but not today
                    setTimeLeft('');
                    setIsTaskOverdue(false);
                }
            } else {
                // Task is overdue or expired
                if (today === taskDateString) {
                    // Task was due today but time has lapsed
                    setTimeLeft('Task overdue!');
                    setIsTaskOverdue(true);
                } else {
                    // Task is from yesterday or earlier
                    setTimeLeft('Task expired! Reset.');
                    setIsTaskOverdue(true);
                }
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [task.datetime]);

    return <ThemedText>{timeLeft}</ThemedText>
};

export default TaskTimer

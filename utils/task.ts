import { endOfMonth, endOfWeek, isSameDay, isWithinInterval, startOfMonth, startOfTomorrow, startOfWeek, startOfYesterday } from 'date-fns';

export type TaskKind = 'Task'|'Meeting'

export type TaskPriorityLevel ='Urgent'|'Moderate'|'Normal'

export type TaskStatus = 'In-Progress' | 'Pending' | 'Completed'

export interface SubTask{
    id:string,
    title:string,
    description:string
}

export interface Task{
    taskId:string,
    title:string,
    description:string,
    kind:TaskKind,
    priority:TaskPriorityLevel,
    datetime:Date,
    status:TaskStatus
    subTasks?:SubTask[]
}





const isToday = (date: Date) => isSameDay(date, new Date());
const isYesterday = (date: Date) => isSameDay(date, startOfYesterday());
const isTomorrow = (date: Date) => isSameDay(date, startOfTomorrow());
const isThisWeek = (date: Date) => isWithinInterval(date, { start: startOfWeek(new Date()), end: endOfWeek(new Date()) });
const isThisMonth = (date: Date) => isWithinInterval(date, { start: startOfMonth(new Date()), end: endOfMonth(new Date()) });


const isDateToday = (date: Date) => isToday(date);
const isDateYesterday = (date: Date) => isYesterday(date);
const isDateTomorrow = (date: Date) => isTomorrow(date);
const isDateThisWeek = (date: Date) => isThisWeek(date);
const isDateThisMonth = (date: Date) => isThisMonth(date);


export type FilterType = 'Today' | 'Yesterday' | 'Tomorrow' | 'ThisWeek' | 'ThisMonth' | 'DateRange' | 'All'


export const filterDateRangeTasks = (tasks: Task[], startDate?: Date, endDate?: Date): Task[] => {
    return tasks.filter(task => {
      const taskDate = new Date(task.datetime);
      if (startDate && endDate && taskDate >= startDate && taskDate <= endDate) return true;
      return false;
    });
  };


  export const filterTasks = (tasks: Task[]) => {
    return tasks.reduce(
      (acc, task) => {
        const taskDate = new Date(task.datetime);
  
        if (isDateToday(taskDate)) {
          acc.todayTasks.push(task);
        }
        if (isDateYesterday(taskDate)) {
          acc.yesterdayTasks.push(task);
        }
        if (isDateTomorrow(taskDate)) {
          acc.tomorrowTasks.push(task);
        }
        if (isDateThisWeek(taskDate)) {
          acc.thisWeekTasks.push(task);
        }
        if (isDateThisMonth(taskDate)) {
          acc.thisMonthTasks.push(task);
        }
        acc.allTasks.push(task);
  
        return acc;
      },
      {
        todayTasks: [] as Task[],
        yesterdayTasks: [] as Task[],
        tomorrowTasks: [] as Task[],
        thisWeekTasks: [] as Task[],
        thisMonthTasks: [] as Task[],
        allTasks: [] as Task[],
      }
    );
  };





  export const parseTaskDates = (data: Task[]): Task[] => {
    return data.map((item) => {
      return {
        ...item,
        datetime:new Date(item.datetime)
      }
    });
  };
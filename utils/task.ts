import { Filters } from '@/components/FilterTasks';
import { isSameDay, startOfYesterday } from 'date-fns';
import moment from 'moment';

export type TaskKind = 'Task' | 'Meeting'

export type TaskPriorityLevel = 'Urgent' | 'Moderate' | 'Normal'

export type TaskStatus = 'In-Progress' | 'Pending' | 'Completed'

export interface SubTask {
  id: string,
  title: string,
  isCompleted: boolean
}

export interface Task {
  taskId: string,
  title: string,
  description: string,
  kind: TaskKind,
  priority: TaskPriorityLevel,
  datetime: Date,
  status: TaskStatus
  subTasks?: SubTask[]
}





// const isToday = (date: Date) => isSameDay(date, new Date());
const isYesterday = (date: Date) => isSameDay(date, startOfYesterday());
// const isTomorrow = (date: Date) => isSameDay(date, startOfTomorrow());
// const isThisWeek = (date: Date) => isWithinInterval(date, { start: startOfWeek(new Date()), end: endOfWeek(new Date()) });
// const isThisMonth = (date: Date) => isWithinInterval(date, { start: startOfMonth(new Date()), end: endOfMonth(new Date()) });


// const isDateToday = (date: Date) => isToday(date);
// const isDateTomorrow = (date: Date) => isTomorrow(date);
// const isDateThisWeek = (date: Date) => isThisWeek(date);
// const isDateThisMonth = (date: Date) => isThisMonth(date);
// export const isDateYesterday = (date: Date|moment.Moment) => isYesterday(date);
export const isDateToday = (date: Date | moment.Moment) => moment().isSame(date, 'day');
export const isDateTomorrow = (date: Date | moment.Moment) => moment().add(1, 'days').isSame(date, 'day');
export const isDateYesterday = (date: Date | moment.Moment) => moment().subtract(1, 'days').isSame(date, 'day')
const isDateThisWeek = (date: Date | moment.Moment) => moment().isSame(date, 'week');
const isDateThisMonth = (date: Date | moment.Moment) => moment().isSame(date, 'month');




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
      datetime: new Date(item.datetime)
    }
  });
};



export const filterTasksCategory = (contextTasks: Task[], filters: Filters) => {
  const { priority, status, timePeriod, kind, startDate, endDate } = filters;

  return contextTasks.filter(task => {
    const taskDate = new Date(task.datetime);

    // Filter by priority (if any filter is set)
    if (priority && task.priority !== priority) {
      return false;
    }

    // Filter by status (if any filter is set)
    if (status && task.status !== status) {
      return false;
    }

    // Filter by kind (if any filter is set)
    if (kind && task.kind !== kind) {
      return false;
    }

    // Filter by time period (if any filter is set)
    if (timePeriod) {
      if (timePeriod === 'All Tasks') return true
      if (timePeriod === 'Today' && !isDateToday(taskDate)) return false;
      if (timePeriod === 'Yesterday' && !isDateYesterday(taskDate)) return false;
      if (timePeriod === 'Tomorrow' && !isDateTomorrow(taskDate)) return false;
      if (timePeriod === 'This Week' && !isDateThisWeek(taskDate)) return false;
      if (timePeriod === 'This Month' && !isDateThisMonth(taskDate)) return false;

      // If Calendar Range is selected, check between startDate and endDate
      if (timePeriod === 'Calendar Range' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!(taskDate >= start && taskDate <= end)) return false;
      }
    }

    // If the task passes all filters, return true
    return true;
  });
}


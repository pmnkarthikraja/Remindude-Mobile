export type TaskKind = 'Task'|'Meeting'

export type TaskPriorityLevel ='Urgent'|'Moderate'|'Normal'

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
    subTasks?:SubTask[]
}

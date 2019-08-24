/**
 * Модель данных элемента списка TODO
 */
export interface ToDo {
    /** Идентификатор задачи */
    id: string;

    /** Текст задачи */
    text: string;

    /** Статус: выполнено/не выполнено */
    complete: boolean;

    /** Время последнего изменения */
    timestamp: Date;
}

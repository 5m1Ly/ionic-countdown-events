import { CountdownEventBuilder } from "./countdownEventBuilder";

export class CountdownEvent {
    constructor(
        private readonly _uuid: string,
        private readonly _name: string,
        private readonly _finish_date: Date
    ) {}

    uuid(): string {
        return this._uuid;
    }

    name(): string {
        return this._name;
    }

    finishDate(): Date {
        return this._finish_date;
    }

    edit(): CountdownEventBuilder {
        const builder = new CountdownEventBuilder(this._uuid);
        builder.setName(this._name);
        builder.setFinishDate(this._finish_date);
        return builder;
    }

    async save(): Promise<boolean> {
        return true;
    }

    async delete(): Promise<boolean> {
        return true
    }
}

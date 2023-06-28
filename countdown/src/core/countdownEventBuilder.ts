import { CountdownEvent } from './countdownEvent';

export class CountdownEventBuilder {
    name!: string;
    finish_date!: Date;

    constructor(
        private readonly uuid: string
    ) {}

    setName(name: string): CountdownEventBuilder {
        this.name = name;
        return this;
    }

    setFinishDate(finishDate: Date): CountdownEventBuilder {
        this.finish_date = finishDate;
        return this;
    }

    build(): CountdownEvent {
        return new CountdownEvent(this.uuid, this.name, this.finish_date);
    }
}

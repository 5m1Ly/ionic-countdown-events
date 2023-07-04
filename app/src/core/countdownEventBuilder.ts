import { CountdownEvent } from './countdownEvent';

export class CountdownEventBuilder {
	name!: string;
	finish_date!: string;

	constructor(private readonly uuid: string) {}

	setName(name: string): CountdownEventBuilder {
		this.name = name;
		return this;
	}

	setFinishDate(finish_date: string): CountdownEventBuilder {
		this.finish_date = finish_date;
		return this;
	}

	build(): CountdownEvent {
		return new CountdownEvent(this.uuid, this.name, this.finish_date);
	}
}

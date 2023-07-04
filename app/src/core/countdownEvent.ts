import { CountdownEventBuilder } from './countdownEventBuilder';

export class CountdownEvent {
	constructor(
		private readonly _uuid: string,
		private readonly _name: string,
		private readonly _finish_date: string
	) {}

	uuid(): string {
		return this._uuid;
	}

	name(): string {
		return this._name;
	}

	finishDate(): string {
		return this._finish_date;
	}

	edit(): CountdownEventBuilder {
		const builder = new CountdownEventBuilder(this._uuid);
		builder.setName(this._name);
		builder.setFinishDate(this._finish_date);
		return builder;
	}

	data() {
		return {
			uuid: this._uuid,
			name: this._name,
			finish_date: this._finish_date,
		};
	}

	async save(method: 'POST' | 'PUT'): Promise<boolean> {
		const body = {
			uuid: this._uuid,
			name: this._name,
			finish_date: this._finish_date,
		};
		try {
			await fetch('http://localhost:3000/api/v1/events', {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});
		} catch (e) {
			return false;
		}
		return true;
	}

	async delete(): Promise<boolean> {
		return true;
	}
}

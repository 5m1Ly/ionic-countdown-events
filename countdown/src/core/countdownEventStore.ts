import { CountdownEvent } from './countdownEvent';
import { CountdownEventBuilder } from './countdownEventBuilder';

export class CountdownEventStore {
    cache = new Map<string, CountdownEvent>();
    passed = new Set<string>();
    active = new Set<string>();

    private readonly loaded: Promise<boolean>;

    private async ready(): Promise<boolean> {
        return await this.loaded;
    }

    private async initialize(): Promise<boolean> {
        const response = await fetch('http://localhost:3000/api/v1/events', { method: 'GET' });
        const events = await response.json();
        if (!events.data) return false;
        if (events.data.length === 0) return true;
        await Promise.all(events.data.map(async (
            data: {
                uuid: string;
                name: string;
                finished_on: string;
                created_on: string;
                updated_on: string;
                deleted_on: string;
            },
            index: number
        ) => {
            const event = new CountdownEvent(data.uuid, data.name, new Date(data.finished_on));
            this.cache.set(event.uuid(), event);
            if (event.finishDate().valueOf() <= Date.now()) {
                this.passed.add(event.uuid());
            } else {
                this.active.add(event.uuid());
            }
        }))
        return true;
    }

    constructor() {
        this.loaded = this.initialize();
    }

    async event(uuid: string): Promise<CountdownEvent | null> {
        if (!this.ready()) return null;
        if (this.cache.has(uuid)) {
            return this.cache.get(uuid)!;
        }
        return null
    }

    async events(uuids: string[] = [], active: boolean = true): Promise<Array<CountdownEvent> | null> {
        if (!this.ready()) return null;
        const events: Array<CountdownEvent> = [];
        if (uuids.length > 0) {
            await Promise.all(uuids.map(async (uuid) => {
                const use = active ? this.active.has(uuid) : this.passed.has(uuid);
                if (use && this.cache.has(uuid)) {
                    events.push(this.cache.get(uuid)!);
                }
            }));
        } else {
            for (const [_, event] of this.cache.entries()) {
                events.push(event)
            }
        }
        return events;
    }

    async editEvent(uuid: string): Promise<CountdownEventBuilder | null> {
        if (!this.ready()) return null;
        if (uuid && this.cache.has(uuid)) {
            const event = this.cache.get(uuid)!;
            return event.edit();
        }
        return null;
    }

    async deleteEvent(uuid: string): Promise<boolean> {
        if (!this.ready()) return false;
        if (uuid && this.cache.has(uuid)) {
            const event = this.cache.get(uuid)!;
            event.delete();
            return true;
        }
        return false;
    }

}

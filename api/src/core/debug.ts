export abstract class Debug {
	print(msg: string, ...args: any[]) {
		console.log(
			`[API:DEBUG:${this.constructor.name.toUpperCase()}]\t`,
			msg,
			...args
		);
	}

	timed(description: string) {
		const start = performance.now();
		return async () => {
			this.print(
				`task: ${description} | time: ${performance.now() - start}ms`
			);
		};
	}

	clock(desc: string, cb: Function) {
		const action = this.timed(desc);
		const result = cb();
		action();
		return result;
	}

	async clockAsync(desc: string, cb: Function) {
		const action = this.timed(desc);
		const result = await cb();
		action();
		return result;
	}
}

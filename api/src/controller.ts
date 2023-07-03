import { Express, Request, Response } from 'express';
import { Debug } from './core/debug';
import { Database } from './core/database';
import { HTTP_RESPONSE_STATUS, HTTPStatusCodes } from './core/status';
import { randomUUID } from 'node:crypto';

export default class Controller extends Debug {
	database = new Database();

	constructor(
		public readonly app: Express & { [key: string]: any },
		private readonly _path: string = '/api/v1'
	) {
		super();
	}

	path(addition?: string): string {
		return addition ? this._path + addition : this._path;
	}

	respond(
		req: Request,
		res: Response,
		json: ResObject = {},
		timed?: Function
	) {
		json.method ??= req.method;
		json.requested ??= req.path;
		json.status ??= HTTPStatusCodes.OK;
		json.statusText =
			HTTP_RESPONSE_STATUS[json.status] ||
			'Unknown HTTP response status code according to the mdn web docs (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)';
		json.message ??=
			'excecuted the request, but message was unset so this is the default message';
		json.data ??= {
			default:
				'there was no data given so this is a default response object',
		};

		res.status(json.status).json(json);

		if (timed) timed();
	}

	middleware(req: Request, res: Response, next: Function) {
		this.print(
			`${req.method} ${req.path} | requested by client (${req.ip})`
		);
		if (
			((req.path === this._path + '/events' && req.method !== 'GET') ||
				req.path === this._path + '/events/single') &&
			req.path !== this._path + '/uuid'
		) {
			this.print(
				`${req.method} ${req.path} | request body:`,
				JSON.stringify(req.body)
			);
			if (!req.body || Object.keys(req.body).length === 0)
				return this.respond(req, res, {
					status: HTTPStatusCodes.NotAcceptable,
					message: 'there was no json request body given',
				});
			switch (req.method) {
				case 'PUT':
				case 'DELETE':
				case 'GET':
					if (
						!(
							'uuid' in req.body &&
							typeof req.body.uuid === 'string' &&
							req.body.uuid.length == 36
						)
					) {
						this.print(
							`${req.method} ${req.path} | uuid property was not found within the request body`
						);
						return this.respond(req, res, {
							status: HTTPStatusCodes.BadRequest,
							message:
								"the 'uuid' property is missing within the given request body or is not of type 'string' or has a length shorter then 36 characters",
						});
					}
					if (req.path === this._path + '/single') break;
				case 'POST':
					if (
						!(
							'name' in req.body &&
							typeof req.body.name === 'string' &&
							req.body.name.length < 255
						)
					) {
						this.print(
							`${req.method} ${req.path} | name property was not found within the request body`
						);
						return this.respond(req, res, {
							status: HTTPStatusCodes.BadRequest,
							message:
								"the 'name' property is missing within the given request body or is not of type 'string' or has a length greater then 254 characters",
						});
					}
					console.log(Date.parse(req.body.finish_date));
					if (!('finish_date' in req.body)) {
						this.print(
							`${req.method} ${req.path} | finish_date property was not found within the request body`
						);
						return this.respond(req, res, {
							status: HTTPStatusCodes.BadRequest,
							message:
								"the 'finish_date' property is missing within the given request body",
						});
					}
					break;
				default:
					this.print(
						`${req.method} ${req.path} | unindexed request method within the middleware`
					);
					break;
			}
		}
		next();
	}

	async createUUID(req: Request, res: Response) {
		const timed = this.timed(
			`${req.method} ${req.path} | executing request`
		);
		this.respond(
			req,
			res,
			{
				status: HTTPStatusCodes.OK,
				message: 'created event successfuly',
				data: { uuid: randomUUID() },
			},
			timed
		);
	}

	async createEvent(req: Request, res: Response) {
		const timed = this.timed(
			`${req.method} ${req.path} | executing request`
		);
		const { uuid, name, finish_date } = req.body;
		try {
			const data = this.database.query(
				'INSERT INTO `events` (`uuid`, `name`, `finished_on`) VALUES (?, ?, ?)',
				[uuid, name, finish_date]
			);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.OK,
					message: 'created event successfuly',
					data,
				},
				timed
			);
		} catch (e) {
			console.error(e);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.InternalServerError,
					message: 'an error occured while fetching the request data',
					data: { details: e },
				},
				timed
			);
		}
	}

	async updateEvent(req: Request, res: Response) {
		const timed = this.timed(
			`${req.method} ${req.path} | executing request`
		);
		const { name, finish_date, uuid } = req.body;
		try {
			const data = this.database.query(
				'UPDATE `events` SET `name` = ?, `finished_on` = ?, updated_on = now() WHERE `uuid` = ?',
				[name, finish_date, uuid]
			);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.OK,
					message: 'updated event successfuly',
					data,
				},
				timed
			);
		} catch (e) {
			console.error(e);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.InternalServerError,
					message: 'an error occured while fetching the request data',
					data: { details: e },
				},
				timed
			);
		}
	}

	async deleteEvent(req: Request, res: Response) {
		const timed = this.timed(
			`${req.method} ${req.path} | executing request`
		);
		const { uuid } = req.body;
		try {
			const data = this.database.query(
				'UPDATE `events` SET `deleted_on` = now(), updated_on = now() WHERE `uuid` = ?',
				[uuid]
			);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.OK,
					message: 'deleted event successfuly',
					data,
				},
				timed
			);
		} catch (e) {
			console.error(e);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.InternalServerError,
					message: 'an error occured while fetching the request data',
					data: { details: e },
				},
				timed
			);
		}
	}

	async allEvents(req: Request, res: Response) {
		const timed = this.timed(
			`${req.method} ${req.path} | executing request`
		);
		try {
			const data = await this.database.query('SELECT * FROM `events`');
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.OK,
					message: 'fetched all events successfuly',
					data,
				},
				timed
			);
		} catch (e) {
			console.error(e);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.InternalServerError,
					message: 'an error occured while fetching the request data',
					data: { details: e },
				},
				timed
			);
		}
	}

	async singleEvent(req: Request, res: Response) {
		const timed = this.timed(
			`${req.method} ${req.path} | executing request`
		);
		try {
			const data = await this.database.query(
				'SELECT * FROM `events` WHERE `uuid` = ?',
				[req.body.uuid]
			);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.OK,
					message: 'fetched single event successfuly',
					data,
				},
				timed
			);
		} catch (e) {
			console.error(e);
			this.respond(
				req,
				res,
				{
					status: HTTPStatusCodes.InternalServerError,
					message: 'an error occured while fetching the request data',
					data: { details: e },
				},
				timed
			);
		}
	}
}

interface ResObject {
	method?: string;
	requested?: string;
	status?: HTTPStatusCodes;
	statusText?: (typeof HTTP_RESPONSE_STATUS)[HTTPStatusCodes];
	message?: string;
	data?: { [key: string]: any };
}

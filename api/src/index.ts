import express from 'express';
import Controller from './controller';
import cors from 'cors';

const controller = new Controller(express());

controller.app.use(cors());
controller.app.use(express.json());
controller.app.use((req, res, next) => controller.middleware(req, res, next));

controller.app.get(controller.path('/uuid'), (req, res) =>
	controller.createUUID(req, res)
);

controller.app.post(controller.path('/events'), (req, res) =>
	controller.createEvent(req, res)
);
controller.app.put(controller.path('/events'), (req, res) =>
	controller.updateEvent(req, res)
);
controller.app.delete(controller.path('/events'), (req, res) =>
	controller.deleteEvent(req, res)
);
controller.app.get(controller.path('/events'), (req, res) =>
	controller.allEvents(req, res)
);
controller.app.get(controller.path('/events/single'), (req, res) =>
	controller.singleEvent(req, res)
);

controller.app.listen(3000, () => console.log('API is running!'));

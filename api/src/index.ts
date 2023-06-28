import express from "express";
import Controller from './controller';
import cors from 'cors';

const controller = new Controller(express(), '/api/v1/events');

controller.app.use(cors())
controller.app.use(express.json())
controller.app.use((req, res, next) => controller.middleware(req, res, next))

controller.app.post(controller.path(), (req, res) => controller.createEvent(req, res))
controller.app.put(controller.path(), (req, res) => controller.updateEvent(req, res))
controller.app.delete(controller.path(),  (req, res) => controller.deleteEvent(req, res))
controller.app.get(controller.path(),  (req, res) => controller.allEvents(req, res))
controller.app.get(controller.path('/single'),  (req, res) => controller.singleEvent(req, res))

controller.app.listen(3000, () => console.log("API is running!"))

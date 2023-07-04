import React, { useState } from 'react';
import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonInput,
	IonDatetime,
	IonDatetimeButton,
	IonModal,
	IonButton,
	IonIcon,
} from '@ionic/react';
import { checkmark, trash, createOutline } from 'ionicons/icons';
import { CountdownEventBuilder } from '../../core/countdownEventBuilder';
import { CountdownEventStore } from '../../core/countdownEventStore';
import { CountdownEvent } from '../../core/countdownEvent';
import './style.css';

type PageProps = {
	events: CountdownEventStore;
	event?: CountdownEvent;
	type: string;
};

const Register: React.FC<PageProps> = ({ type, event, events }) => {
	function now() {
		const date = new Date();
		date.setHours(date.getHours() + 2);
		return date;
	}

	const create = type !== 'detail';

	const content = {
		title: create ? 'Create Event' : 'Event Details',
		saveLabel: create ? 'create' : 'update',
		savePadding: create ? '0' : '10px',
		saveIcon: create ? checkmark : createOutline,
	};

	const [UUID, setUUID] = useState(event ? event.uuid() : '');
	const [name, setName] = useState(event ? event.name() : '');
	const [finishDate, setFinishDate] = useState(
		event ? event.finishDate() : now().toISOString()
	);

	if (event && UUID !== event.uuid()) {
		setUUID(event.uuid());
		setName(event.name());
		setFinishDate(event.finishDate());
	} else if (create && UUID !== '') {
		setUUID('');
		setName('');
		setFinishDate(now().toISOString());
	}

	async function generateUUID(): Promise<string> {
		const raw = await fetch('http://localhost:3000/api/v1/uuid');
		const res = await raw.json();
		return res.data.uuid;
	}

	async function getCountdownEvent() {
		return new CountdownEventBuilder(UUID ? UUID : await generateUUID())
			.setName(name)
			.setFinishDate(finishDate)
			.build();
	}

	async function saveEvent() {
		const cevent = await getCountdownEvent();
		events.set(cevent);
		cevent.save(create ? 'POST' : 'PUT');
		setUUID('');
		setName('');
		setFinishDate(now().toISOString());
		return;
	}

	async function deleteEvent() {
		const cevent = await getCountdownEvent();
		events.deleteEvent(cevent.uuid());
		cevent.delete();
		setUUID('');
		setName('');
		setFinishDate(now().toISOString());
		return;
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>{content.title}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{content.title}</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className="container">
					<div className="event-input">
						<IonInput
							label="Event Name"
							labelPlacement="floating"
							mode="ios"
							style={{
								fontSize: '18px',
							}}
							onIonChange={(event) =>
								setName(
									event.detail.value ? event.detail.value : ''
								)
							}
							value={name}
						></IonInput>
						<IonDatetimeButton datetime="datetime" mode="ios" />
						<div className="actions">
							<IonButton
								className="save"
								color="success"
								onClick={async () => {
									await saveEvent();
									console.log('event saved');
								}}
								routerLink="/active"
								style={{
									paddingRight: content.savePadding,
								}}
							>
								<IonIcon
									slot="start"
									icon={content.saveIcon}
								></IonIcon>
								{content.saveLabel}
							</IonButton>
							{!create && (
								<IonButton
									className="delete"
									color="warning"
									onClick={async () => {
										await deleteEvent();
										console.log('event deleted');
									}}
									routerLink="/active"
								>
									<IonIcon slot="end" icon={trash}></IonIcon>
									Delete
								</IonButton>
							)}
						</div>
					</div>
				</div>
				<IonModal keepContentsMounted={true} mode="ios">
					<IonDatetime
						id="datetime"
						value={finishDate}
						min={now().toISOString()}
						mode="ios"
						onIonChange={(event) => {
							if (Array.isArray(event.detail.value)) {
								event.detail.value = event.detail.value[0];
							}
							setFinishDate(event.detail.value || '');
						}}
					></IonDatetime>
				</IonModal>
			</IonContent>
		</IonPage>
	);
};

export default Register;

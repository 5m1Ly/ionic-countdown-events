import React from 'react';
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
import { checkmark, trash } from 'ionicons/icons';
import { CountdownEventBuilder } from '../../core/countdownEventBuilder';
import { CountdownEventStore } from '../../core/countdownEventStore';
import './style.css';

type PageProps = {
	events: CountdownEventStore;
	type: string;
	id?: string;
};

const Register: React.FC<PageProps> = ({ events, type, id }) => {
	async function createBuilder(uuid?: string) {
		uuid ||= await (async () => {
			const raw = await fetch('http://localhost:3000/api/v1/uuid');
			const res = await raw.json();
			return res.data.uuid;
		})();
		return new CountdownEventBuilder(uuid!);
	}

	async function saveEvent() {
		const countdownEvent = (await builder).build();
		countdownEvent.save();
		builder = createBuilder();
	}

	async function deleteEvent() {
		const countdownEvent = (await builder).setName('test_event-').build();
		const uuid = countdownEvent.uuid();
		console.log(uuid);
		console.log('the delete button has been clicked');
	}

	async function setEventName(nameStr: any) {
		const name: string = nameStr;
		console.log('the new name:', nameStr);
		(await builder).setName(name);
	}

	async function setEventFinishDate(dateStr: any) {
		const datetime: string = dateStr;
		console.log('the new datetime:', datetime);
		(await builder).setFinishDate(datetime);
	}

	const edit = type === 'edit';

	let builder: Promise<CountdownEventBuilder> = createBuilder(id);

	const date = new Date();
	date.setHours(date.getHours() + 2);

	const iso = date.toISOString();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>{edit ? 'Edit' : 'Create'} Event</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Register</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className="container">
					<div className="event-input">
						<IonInput
							label="Event Name"
							labelPlacement="floating"
							placeholder="My New Countdown Event"
							mode="ios"
							onIonChange={(event) =>
								setEventName(event.detail.value)
							}
						></IonInput>
						<IonDatetimeButton datetime="datetime" mode="ios" />
						<div className="actions">
							<IonButton
								className="save"
								color="success"
								onClick={() => saveEvent()}
								style={
									edit
										? { paddingRight: '10px' }
										: { paddingRight: '0' }
								}
							>
								<IonIcon
									slot="start"
									icon={checkmark}
								></IonIcon>
								Save
							</IonButton>
							{edit && (
								<IonButton
									className="delete"
									color="warning"
									onClick={() => deleteEvent()}
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
						value={iso}
						min={iso}
						mode="ios"
						onIonChange={(event) =>
							setEventFinishDate(event.detail.value)
						}
					></IonDatetime>
				</IonModal>
			</IonContent>
		</IonPage>
	);
};

export default Register;

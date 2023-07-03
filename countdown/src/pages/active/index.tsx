import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonButtons,
	IonButton,
	IonIcon,
} from '@ionic/react';
import { create } from 'ionicons/icons';
import { CountdownEventStore } from '../../core/countdownEventStore';
import CEventList from '../../components/event-list';

import './style.css';
import { useState, useEffect } from 'react';

type PageProps = { events: CountdownEventStore };

const Active: React.FC<PageProps> = ({ events }) => {
	const [editable, setState] = useState(false);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Events</IonTitle>
					<IonButtons slot="primary">
						<IonButton onClick={() => setState(!editable)}>
							<IonIcon slot="icon-only" icon={create}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Events</IonTitle>
					</IonToolbar>
				</IonHeader>
				<CEventList events={events} active={true} />
			</IonContent>
		</IonPage>
	);
};

export default Active;

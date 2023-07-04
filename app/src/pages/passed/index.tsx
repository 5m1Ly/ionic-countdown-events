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

type PageProps = { events: CountdownEventStore };

const Passed: React.FC<PageProps> = ({ events }) => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>History</IonTitle>
					<IonButtons slot="primary">
						<IonButton>
							<IonIcon slot="icon-only" icon={create}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">History</IonTitle>
					</IonToolbar>
				</IonHeader>
				<CEventList events={events} active={false} />
			</IonContent>
		</IonPage>
	);
};

export default Passed;

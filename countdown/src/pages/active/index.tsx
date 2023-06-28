import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import { CountdownEventStore } from '../../core/countdownEventStore';
import './style.css';

const Active: React.FC<{ eventStorage: CountdownEventStore }> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Events</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Events page" />
      </IonContent>
    </IonPage>
  );
};

export default Active;

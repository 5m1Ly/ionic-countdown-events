import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import { CountdownEventStore } from '../../core/countdownEventStore';
import './style.css';

const Passed: React.FC<{ eventStorage: CountdownEventStore }> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>History</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">History</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="History page" />
      </IonContent>
    </IonPage>
  );
};

export default Passed;

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, calendarNumberOutline, refreshCircleOutline, addCircleOutline } from 'ionicons/icons';
import ActivePage from './pages/active';
import PassedPage from './pages/passed';
import RegisterPage from './pages/register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* core */
import { CountdownEventStore } from './core/countdownEventStore';

setupIonicReact();

const App: React.FC = () => {
    const eventStorage = new CountdownEventStore();

    return (
        <IonApp>
            <IonReactRouter>
            <IonTabs>
                <IonRouterOutlet>
                <Route exact path="/active">
                    <ActivePage eventStorage={eventStorage} />
                </Route>
                <Route exact path="/passed">
                    <PassedPage eventStorage={eventStorage} />
                </Route>
                <Route path="/register">
                    <RegisterPage eventStorage={eventStorage} />
                </Route>
                <Route exact path="/">
                    <Redirect to="/active" />
                </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                <IonTabButton tab="active" href="/active">
                    <IonIcon aria-hidden="true" icon={calendarNumberOutline} size='large' />
                </IonTabButton>
                <IonTabButton tab="passed" href="/passed">
                    <IonIcon aria-hidden="true" icon={refreshCircleOutline} size='large' />
                </IonTabButton>
                <IonTabButton tab="register" href="/register">
                    <IonIcon aria-hidden="true" icon={addCircleOutline} size='large' />
                </IonTabButton>
                </IonTabBar>
            </IonTabs>
            </IonReactRouter>
        </IonApp>
    )
};

export default App;

import { Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonRouter,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, homeSharp, person, personSharp } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useUserData } from "./hooks/useUserData";
import Onboarding from "./pages/Onboarding";
import ManageAccount from "./pages/account/ManageAccount";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersDashboard from "./pages/admin/AdminUsersDashboard";
import AdminUserDashboard from "./pages/admin/AdminUserDashboard";

setupIonicReact();

export default function App() {
  const { userInfo, loaded, loggedIn } = useUserData();

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Onboarding />
            </Route>
            <Route exact path="/account">
              <ManageAccount />
            </Route>
            <Route exact path="/admin">
              <AdminDashboard />
            </Route>
            <Route exact path="/admin/users">
              <AdminUsersDashboard />
            </Route>
            <Route exact path="/admin/users/:id">
              <AdminUserDashboard />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            style={{
              "--background": "#333333",
              "--border": "0px solid transparent",
              "--color": "#3a7be0",
              borderTopRightRadius: "12px",
              borderTopLeftRadius: "12px",
            }}
          >
            <IonTabButton
              tab="onboarding"
              href="/"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={home} md={homeSharp} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="account"
              href="/account"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={person} md={personSharp} />
              <IonLabel>Konto</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

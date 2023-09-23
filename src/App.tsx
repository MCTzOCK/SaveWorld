import { Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  book,
  bookSharp,
  home,
  homeSharp,
  leaf,
  leafSharp,
} from "ionicons/icons";

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
import NotFound from "./pages/NotFound";
import Welcome from "./pages/introduction/Welcome";
import AdminContentDashboard from "./pages/admin/AdminContentDashboard";
import AdminContentCategoryDashboard from "./pages/admin/AdminContentCategoryDashboard";
import FinishWelcome from "./pages/introduction/FinishWelcome";
import ManageAccountInterests from "./pages/account/ManageAccountInterests";
import AdminVideosDashboard from "./pages/admin/AdminVideosDashboard";
import AdminVideoDashboard from "./pages/admin/AdminVideoDashboard";
import Videos from "./pages/learn/Videos";
import VideoSearchFTS from "./pages/learn/VideoSearchFTS";
import { Redirect } from "react-router";
import EcoTracker from "./pages/tracker/EcoTracker";

import OneSignal from "onesignal-cordova-plugin";
import { ONE_SIGNAL_APP_ID } from "./env";
import { useEffect } from "react";
import AppUrlListener from "./AppUrlListener";
import AdminLifestyleTemplates from "./pages/admin/AdminLifestyleTemplates";
import WelcomeLifestyle from "./pages/introduction/WelcomeLifestyle";
import E2 from "./pages/e2/E2";
import CommunityDashboard from "./pages/community/CommunityDashboard";
import CommunityProfile from "./pages/community/CommunityProfile";

setupIonicReact({
  mode: "ios",
});

export default function App() {
  const { userInfo, loaded, loggedIn } = useUserData();
  useEffect(() => {
    try {
      if (!isPlatform("desktop")) {
        OneSignal.init(ONE_SIGNAL_APP_ID);

        OneSignal.Notifications.requestPermission();
        if (loaded && loggedIn) {
          OneSignal.login(userInfo._id);
        }
      }
    } catch (e) {}
  }, [loggedIn, loaded]);

  return (
    <IonApp>
      <IonReactRouter>
        <AppUrlListener />
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/onboarding">
              <Onboarding />
            </Route>
            <Redirect to={"/onboarding"} from={"/"} exact />
            <Route exact path="/welcome">
              <Welcome />
            </Route>
            <Route exact path="/welcome/lifestyle">
              <WelcomeLifestyle />
            </Route>
            <Route exact path="/welcome/finish">
              <FinishWelcome />
            </Route>
            <Route exact path="/account">
              <ManageAccount />
            </Route>
            <Route exact path="/account/interests">
              <ManageAccountInterests />
            </Route>
            <Route exact path="/admin">
              <AdminDashboard />
            </Route>
            <Route exact path="/admin/content">
              <AdminContentDashboard />
            </Route>
            <Route exact path="/admin/content/categories">
              <AdminContentCategoryDashboard />
            </Route>
            <Route exact path="/admin/content/videos">
              <AdminVideosDashboard />
            </Route>
            <Route exact path="/admin/content/videos/:id">
              <AdminVideoDashboard />
            </Route>
            <Route exact path="/admin/users">
              <AdminUsersDashboard />
            </Route>
            <Route exact path="/admin/users/:id">
              <AdminUserDashboard />
            </Route>
            <Route exact path="/admin/lifestyle-templates">
              <AdminLifestyleTemplates />
            </Route>
            <Route exact path="/learn">
              <Videos />
            </Route>
            <Route exact path="/learn/fts-search">
              <VideoSearchFTS />
            </Route>
            <Route exact path="/eco-tracker">
              <EcoTracker />
            </Route>
            <Route exact path="/e2">
              <E2 />
            </Route>
            <Route exact path="/community">
              <CommunityDashboard />
            </Route>
            <Route exact path="/community/u/:username">
              <CommunityProfile />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            style={{
              "--background": "#444444",
              "--border": "0px solid transparent",
              "--color": "var(--ion-color-success-shade)",
              borderTopRightRadius: "12px",
              borderTopLeftRadius: "12px",
            }}
          >
            <IonTabButton
              tab="onboarding"
              href="/onboarding"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={home} md={homeSharp} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="e2"
              href="/e2"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={leaf} md={leafSharp} />
              <IonLabel>Tracker</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="learn"
              href="/learn"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={book} md={bookSharp} />
              <IonLabel>Lernen</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

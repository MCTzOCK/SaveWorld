import { Route, Switch } from "react-router-dom";
import {
  IonApp,
  IonFooter,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
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
import CommunityCreateBlog from "./pages/community/CommunityCreateBlog";
import CommunityBlogViewer from "./pages/community/CommunityBlogViewer";

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

  const routes: {
    [key: string]: any;
  } = {
    "/register": Register,
    "/login": Login,
    "/onboarding": Onboarding,
    "/welcome": Welcome,
    "/welcome/lifestyle": WelcomeLifestyle,
    "/welcome/finish": FinishWelcome,
    "/account": ManageAccount,
    "/account/interests": ManageAccountInterests,
    "/admin": AdminDashboard,
    "/admin/content": AdminContentDashboard,
    "/admin/content/categories": AdminContentCategoryDashboard,
    "/admin/content/videos": AdminVideosDashboard,
    "/admin/content/videos/:id": AdminVideoDashboard,
    "/admin/users": AdminUsersDashboard,
    "/admin/users/:id": AdminUserDashboard,
    "/admin/lifestyle-templates": AdminLifestyleTemplates,
    "/learn": Videos,
    "/learn/fts-search": VideoSearchFTS,
    "/eco-tracker": EcoTracker,
    "/e2": E2,
    "/community": CommunityDashboard,
    "/community/u/:username": CommunityProfile,
    "/community/create/blog": CommunityCreateBlog,
    "/community/r/:id": CommunityBlogViewer,
  };

  return (
    <IonApp>
      <IonReactRouter>
        <AppUrlListener />
        <Switch>
          <Redirect to={"/onboarding"} from={"/"} exact />
          {Object.keys(routes).map((route) => {
            const Component = routes[route];
            return (
              <Route
                exact
                path={route}
                render={(props) => {
                  return <Component key={props.location.key} />;
                }}
              />
            );
          })}
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </IonReactRouter>
    </IonApp>
  );
}

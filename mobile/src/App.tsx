import { Route, Switch } from "react-router-dom";
import { IonApp, isPlatform, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

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
import { ENDPOINT, ONE_SIGNAL_APP_ID } from "./env";
import { useEffect } from "react";
import AppUrlListener from "./AppUrlListener";
import AdminLifestyleTemplates from "./pages/admin/AdminLifestyleTemplates";
import WelcomeLifestyle from "./pages/introduction/WelcomeLifestyle";
import E2 from "./pages/e2/E2";
import CommunityDashboard from "./pages/community/CommunityDashboard";
import CommunityProfile from "./pages/community/CommunityProfile";
import CommunityCreateBlog from "./pages/community/CommunityCreateBlog";
import CommunityBlogViewer from "./pages/community/CommunityBlogViewer";
import { Box, ChakraProvider, Heading, Text, useToast } from "@chakra-ui/react";
import { theme } from "./theme/chakra";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support";
import AdminSupportRequestsDashboard from "./pages/admin/AdminSupportRequestsDashboard";
import AdminSupportRequestDashboard from "./pages/admin/AdminSupportRequestDashboard";
import Home from "./pages/Home";
import SocketTest from "./pages/SocketTest";
import { io } from "socket.io-client";
import CommunityMessagesChat from "./pages/community/CommunityMessagesChat";
import MdHelp from "./pages/resources/MdHelp";
import CommunityMessagesChatsList from "./pages/community/CommunityMessagesChatsList";
import CommunityMessagesGroupsList from "./pages/community/CommunityMessagesGroupsList";
import StartE2Project from "./pages/e2-projects/StartE2Project";
import MyE2Projects from "./pages/e2-projects/MyE2Projects";
import E2ProjectHomepage from "./pages/e2-projects/project/E2ProjectHomepage";
import E2ProjectEdit from "./pages/e2-projects/project/E2ProjectEdit";
import E2Projects from "./pages/e2-projects/E2Projects";

setupIonicReact({
  mode: "ios",
});

const socket = io(ENDPOINT);

export default function App() {
  const { userInfo, loaded, loggedIn } = useUserData();
  const toast = useToast();

  useEffect(() => {
    if (loaded && loggedIn) {
      socket.onAny((event, ...args) => {
        console.log("SCKT " + event, args);
      });

      socket.on("sw:notification.push", (data) => {
        toast({
          title: data.title,
          description: data.content,
          render: () => (
            <>
              <Box
                style={{ cursor: "pointer" }}
                bgColor={"saveworld_green.500"}
                borderRadius={"12px"}
                padding={6}
                onClick={() => {
                  window.location.assign(data.launch_url.split(".one")[1]);
                }}
              >
                <Heading size={"md"}>{data.title}</Heading>
                <Text>{data.content}</Text>
              </Box>
            </>
          ),
          status: "info",
          duration: 9000,
          isClosable: true,
        });
      });
    }
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
    "/old-onboarding": Onboarding,
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
    "/admin/support-requests": AdminSupportRequestsDashboard,
    "/admin/support-requests/:id": AdminSupportRequestDashboard,
    "/learn": Videos,
    "/learn/fts-search": VideoSearchFTS,
    "/eco-tracker": EcoTracker,
    "/e2": E2,
    "/e2-projects/new": StartE2Project,
    "/e2-projects/my": MyE2Projects,
    "/e2-projects/search": E2Projects,
    "/e2-projects/:id": E2ProjectHomepage,
    "/e2-projects/:id/edit": E2ProjectEdit,
    "/community": CommunityDashboard,
    "/community/u/:username": CommunityProfile,
    "/community/create/blog": CommunityCreateBlog,
    "/community/r/:id": CommunityBlogViewer,
    "/community/messages": CommunityMessagesChatsList,
    "/community/messages-groups": CommunityMessagesGroupsList,
    "/community/messages/:id": CommunityMessagesChat,
    "/notifications": Notifications,
    "/support": Support,
    "/onboarding": Home,
    "/s2": SocketTest,
    "/resources/md-help": MdHelp,
  };

  return (
    <>
      <ChakraProvider theme={theme}>
        <div id={"__chakra-manual-mount-point-do-not-use"}></div>
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
                      return (
                        <Component key={props.location.key} socket={socket} />
                      );
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
      </ChakraProvider>
    </>
  );
}

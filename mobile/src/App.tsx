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
import "./theme/globals.scss";
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
import AdminVideosDashboard from "./pages/admin/AdminVideosDashboard";
import AdminVideoDashboard from "./pages/admin/AdminVideoDashboard";
import Videos from "./pages/learn/Videos";
import VideoSearchFTS from "./pages/learn/VideoSearchFTS";
import { Redirect, useParams } from "react-router";
import EcoTracker from "./pages/tracker/EcoTracker";

import OneSignal from "onesignal-cordova-plugin";
import { ENDPOINT, FLAGSMITH_ENDPOINT, ONE_SIGNAL_APP_ID } from "./env";
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
import E2ProjectTodoListViewer from "./pages/e2-projects/project/todos/E2ProjectTodoListViewer";
import C02 from "./pages/tools/C02";
import CO2Car from "./pages/tools/CO2Car";
import CO2ECar from "./pages/tools/CO2ECar";
import CO2HCar from "./pages/tools/CO2HCar";
import Sustainability from "./pages/sustainability/Sustainability";
import GhostArticles from "./components/GhostArticles";
import * as React from "react";
import GhostArticle from "./components/GhostArticle";
import DirectusPosts from "./components/DirectusPosts";
import DirectusPost from "./components/DirectusPost";
import Quizzes from "./pages/quizzes/Quizzes";
import { FlagsmithProvider, useFlags } from "flagsmith/react";
import flagsmith from "flagsmith";
//KEEP_IMPORTS

setupIonicReact({
  mode: "ios",
});

const socket = io(ENDPOINT);

export default function App() {
  const flags = useFlags([
    "videos",
    "quizzes",
    "tracker",
    "news",
    "sustainability_articles",
    "tools_co2_calc",
    "eco_projects",
    "community",
  ]);

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
                bgColor={"brand.500"}
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

  useEffect(() => {
    setRoutes({
      "/register": Register,
      "/login": Login,
      "/old-onboarding": Onboarding,
      "/welcome": Welcome,
      "/welcome/lifestyle": WelcomeLifestyle,
      "/welcome/finish": FinishWelcome,
      "/account": ManageAccount,
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
      "/learn": flags.videos.enabled ? Videos : NotFound,
      "/learn/fts-search": flags.videos.enabled ? VideoSearchFTS : NotFound,
      "/eco-tracker": flags.tracker.enabled ? EcoTracker : NotFound,
      "/e2": flags.tracker.enabled ? E2 : NotFound,
      "/e2-projects/new": flags.eco_projects.enabled
        ? StartE2Project
        : NotFound,
      "/e2-projects/my": flags.eco_projects.enabled ? MyE2Projects : NotFound,
      "/e2-projects/search": flags.eco_projects.enabled ? E2Projects : NotFound,
      "/e2-projects/:id": flags.eco_projects.enabled
        ? E2ProjectHomepage
        : NotFound,
      "/e2-projects/:id/edit": flags.eco_projects.enabled
        ? E2ProjectEdit
        : NotFound,
      "/e2-projects/:id/todos/:listId": flags.eco_projects.enabled
        ? E2ProjectTodoListViewer
        : NotFound,
      "/community": flags.community.enabled ? CommunityDashboard : NotFound,
      "/community/u/:username": flags.community.enabled
        ? CommunityProfile
        : NotFound,
      "/community/create/blog": flags.community.enabled
        ? CommunityCreateBlog
        : NotFound,
      "/community/r/:id": flags.community.enabled
        ? CommunityBlogViewer
        : NotFound,
      "/community/messages": flags.community.enabled
        ? CommunityMessagesChatsList
        : NotFound,
      "/community/messages-groups": flags.community.enabled
        ? CommunityMessagesGroupsList
        : NotFound,
      "/community/messages/:id": flags.community.enabled
        ? CommunityMessagesChat
        : NotFound,
      "/notifications": Notifications,
      "/support": Support,
      "/onboarding": Home,
      "/s2": SocketTest,
      "/resources/md-help": MdHelp,
      "/tools/co2": flags.tools_co2_calc.enabled ? C02 : NotFound,
      "/tools/co2/car": flags.tools_co2_calc.enabled ? CO2Car : NotFound,
      "/tools/co2/e-car": flags.tools_co2_calc.enabled ? CO2ECar : NotFound,
      "/tools/co2/h-car": flags.tools_co2_calc.enabled ? CO2HCar : NotFound,
      "/quizzes": flags.quizzes.enabled ? Quizzes : NotFound,
      "/sustainability": flags.sustainability_articles.enabled
        ? Sustainability
        : NotFound,
      "/sustainability/articles": flags.sustainability_articles.enabled
        ? () => {
            return (
              <DirectusPosts
                postBaseUrl={"/sustainability/articles"}
                pageTitle={"Nachhaltigkeit"}
                tagFilter={"sustainability"}
              />
            );
          }
        : NotFound,
      "/sustainability/articles/:id": flags.sustainability_articles.enabled
        ? () => {
            const { id } = useParams<{ id: string }>();
            return <DirectusPost postId={id} />;
          }
        : NotFound,
      "/news": flags.news.enabled
        ? () => {
            return (
              <DirectusPosts
                postBaseUrl={"/news"}
                pageTitle={"Neuigkeiten"}
                tagFilter={"news"}
              />
            );
          }
        : NotFound,
      "/news/:id": flags.news.enabled
        ? () => {
            const { id } = useParams<{ id: string }>();
            return <DirectusPost postId={id} />;
          }
        : NotFound,
      //KEEP_ROUTES
    });
  }, [flags]);

  const [routes, setRoutes] = React.useState<{
    [key: string]: any;
  }>({});

  return (
    <>
      <ChakraProvider theme={theme}>
        <div id={"__chakra-manual-mount-point-do-not-use"} />
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

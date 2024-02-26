import { Route, Switch } from "react-router-dom";
import {
  IonApp,
  isPlatform,
  setupIonicReact,
  useIonRouter,
} from "@ionic/react";
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

import OneSignal from "onesignal-cordova-plugin";
import {
  DIRECTUS_ENDPOINT,
  ENDPOINT,
  FLAGSMITH_ENDPOINT,
  ONE_SIGNAL_APP_ID,
  POSTHOG_ENDPOINT,
  POSTHOG_KEY,
} from "./env";
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
import Channels from "./pages/learn/Channels";
import Channel from "./pages/learn/Channel";
import Recipes from "./pages/recipes/Recipes";
import CreateRecipe from "./pages/recipes/CreateRecipe";
import RecipeViewer from "./pages/recipes/RecipeViewer";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";
import AdminRecipeDashboard from "./pages/admin/AdminRecipeDashboard";
import AdminEcoProjectsDashboard from "./pages/admin/AdminEcoProjectsDashboard";
import CO2LongDistanceTrain from "./pages/tools/CO2LongDistanceTrain";
import Calculator from "./components/Calculator";
import Cookbook from "./pages/recipes/Cookbook";
import EatingPlanOverview from "./pages/eatingplans/EatingPlanOverview";
import EatingPlanViewer from "./pages/eatingplans/EatingPlanViewer";
import Licenses from "./pages/account/Licenses";
import { $$ } from "./translations/i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";
import AITest from "./pages/AITest";
import AIHelper from "./pages/AIHelper";
import AdvancedDataPlatform from "./pages/admin/adp/AdvancedDataPlatform";
import Page from "./components/Page";
import {
  getChangelog,
  setChangelogShown,
  shouldShowChangelog,
} from "./util/changelog";
import PopupManager from "./util/PopupManager";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RESTEnv } from "@saveworld/api-js/dist/RESTEnv";
import Games from "./pages/games/Games";
import GameLeaderBoard from "./pages/games/GameLeaderBoard";
import AdminArticleDashboard from "./pages/admin/AdminArticleDashboard";
import SWArticles from "./components/SWArticles";
import SWArticle from "./components/SWArticle";
import AdminQuizzesDashboard from "./pages/admin/AdminQuizzesDashboard";
//KEEP_IMPORTS

setupIonicReact({
  mode: "ios",
});

const socket = io(RESTEnv.API_URL);

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
    "video_category_channels",
    "recipes",
    "eatingplans",
    "ai_helper",
  ]);

  const { userInfo, loaded, loggedIn } = useUserData();
  const toast = useToast();

  useEffect(() => {
    if (loaded && loggedIn) {
      posthog?.identify(userInfo.email, {
        name: userInfo.firstName + " " + userInfo.lastName,
        email: userInfo.email,
        username: userInfo.username,
      });
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
        OneSignal.initialize(ONE_SIGNAL_APP_ID);

        OneSignal.Notifications.requestPermission();
        if (loaded && loggedIn) {
          OneSignal.login(userInfo._id);
        }
      }
    } catch (e) {}
  }, [loggedIn, loaded]);

  useEffect(() => {
    if (localStorage) {
      if (shouldShowChangelog()) {
        getChangelog().then((data) => {
          if (data.hasChangelog) {
            setChangelogShown();
            PopupManager.alert({
              title: "Changelog",
              description: (
                <>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data.changelog}
                  </ReactMarkdown>
                </>
              ),
            });
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    setRoutes({
      "/language": LanguageSwitcher,
      "/register": Login,
      "/login": Login,
      "/old-onboarding": Onboarding,
      "/welcome": Welcome,
      "/welcome/lifestyle": WelcomeLifestyle,
      "/welcome/finish": FinishWelcome,
      "/account": ManageAccount,
      "/account/licenses": Licenses,
      "/admin": AdminDashboard,
      "/ai-test": AITest,
      "/ai": flags.ai_helper.enabled ? AIHelper : NotFound,
      "/admin/content": AdminContentDashboard,
      "/admin/content/categories": AdminContentCategoryDashboard,
      "/admin/content/videos": AdminVideosDashboard,
      "/admin/content/videos/:id": AdminVideoDashboard,
      "/admin/users": AdminUsersDashboard,
      "/admin/users/:id": AdminUserDashboard,
      "/admin/lifestyle-templates": AdminLifestyleTemplates,
      "/admin/support-requests": AdminSupportRequestsDashboard,
      "/admin/support-requests/:id": AdminSupportRequestDashboard,
      "/admin/recipes": AdminRecipeDashboard,
      "/admin/eco-projects": AdminEcoProjectsDashboard,
      "/admin/adp": AdvancedDataPlatform,
      "/admin/articles": AdminArticleDashboard,
      "/admin/quizzes": AdminQuizzesDashboard,
      "/learn": flags.videos.enabled ? Videos : NotFound,
      "/learn/channels": flags.video_category_channels.enabled
        ? Channels
        : NotFound,
      "/learn/channels/:id": flags.video_category_channels.enabled
        ? Channel
        : NotFound,
      "/learn/fts-search": flags.videos.enabled ? VideoSearchFTS : NotFound,
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
      "/tools/co2/long-distance-train": flags.tools_co2_calc.enabled
        ? CO2LongDistanceTrain
        : NotFound,
      "/quizzes": flags.quizzes.enabled ? Quizzes : NotFound,
      "/sustainability": flags.sustainability_articles.enabled
        ? Sustainability
        : NotFound,
      "/sustainability/articles": flags.sustainability_articles.enabled
        ? () => {
            return (
              <SWArticles
                pageTitle={$$("components.articles")}
                tag={"sustainability"}
              />
            );
          }
        : NotFound,
      "/articles/:id": SWArticle,
      "/news": flags.news.enabled
        ? () => {
            return (
              <SWArticles tag={"news"} pageTitle={$$("page.news.title")} />
            );
          }
        : NotFound,
      "/recipes": flags.recipes.enabled ? Recipes : NotFound,
      "/recipes/create": flags.recipes.enabled ? CreateRecipe : NotFound,
      "/recipes/cookbook": flags.recipes.enabled ? Cookbook : NotFound,
      "/recipes/:id": flags.recipes.enabled ? RecipeViewer : NotFound,
      "/eatingplans": flags.eatingplans.enabled ? EatingPlanOverview : NotFound,
      "/eatingplans/:date": flags.eatingplans.enabled
        ? EatingPlanViewer
        : NotFound,
      "/games": Games,
      "/games/:game/leaderboard": GameLeaderBoard,
      "/games/:name": () => {
        const router = useIonRouter();
        const { name } = useParams<{ name: string }>();
        return (
          <Page title={name} noPadding>
            <iframe
              src={"/_static/games/" + name + "/index.html"}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              onLoad={(e) => {
                const iframe = e.target as HTMLIFrameElement;
                const x =
                  iframe.contentWindow?.document.createElement("script");
                x!.src = "/_static/games/lib.js";
                x!.type = "text/javascript";
                x!.async = true;
                iframe.contentWindow?.document.head.appendChild(x!);
              }}
            />
          </Page>
        );
      },
      //KEEP_ROUTES
    });
  }, [flags]);

  const [routes, setRoutes] = React.useState<{
    [key: string]: any;
  }>({});

  return (
    <>
      <PostHogProvider
        apiKey={POSTHOG_KEY}
        options={{
          api_host: POSTHOG_ENDPOINT,
          loaded: (posthog) => {
            if (process.env.NODE_ENV === "development") {
              posthog.debug();
            }
          },
          autocapture: true,
        }}
      >
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
      </PostHogProvider>
    </>
  );
}

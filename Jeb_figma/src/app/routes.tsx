import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { JobHuntDetail } from "./pages/JobHuntDetail";
import { JobPostingDetail } from "./pages/JobPostingDetail";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "hunts/:huntId", Component: JobHuntDetail },
      { path: "hunts/:huntId/jobs/:jobId", Component: JobPostingDetail },
      { path: "settings", Component: Settings },
      { path: "profile", Component: Profile }
    ],
  },
]);

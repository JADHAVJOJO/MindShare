import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MindshareSelectGames from "./leftBar_Section/gaming/gaming";
import EventsApp from "./leftBar_Section/events/events";
import NewsSection from "./rightBar_Section/news/news";
import MindShareChat from "./leftBar_Section/chatroom/chatroom";
import Memories from "./leftBar_Section/Memories/Memories";


function App() {
  const currentUser = true;

  
  const queryClient = new QueryClient();
  
  
  const Layout = () => {
    const { darkMode } = useContext(DarkModeContext);
    return (
      <QueryClientProvider client={queryClient}>

      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/gaming",
          element: <MindshareSelectGames />,
        },
        {
          path: "/events",
          element: <EventsApp />,
        },
        {
          path: "/news",
          element: <NewsSection />,
        },
        {
          path: "/chat",
          element: <MindShareChat />,
        },
        {
          path: "/Memories",
          element: <Memories/>,
        },
       
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

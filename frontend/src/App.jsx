import { Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  ClipboardList,
  House,
  Package,
  Users,
  Megaphone,
  Newspaper,
  ChartNoAxesCombined,
  UserCog,
  ShieldAlert,
} from "lucide-react";
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/Overview";
import Incidents from "./pages/Incidents";
import Tasks from "./pages/Tasks";
import Shelters from "./pages/Shelters";
import Resources from "./pages/Resources";
import Volunteers from "./pages/Volunteers";
import Notices from "./pages/Notices";
import NewsReview from "./pages/NewsReview";
import Analytics from "./pages/Analytics";
import UsersPage from "./pages/Users";
import HazardTypes from "./pages/HazardTypes";
import IncidentDetails from "./pages/IncidentDetails";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";


const navigationItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Incidents", path: "/incidents", icon: AlertTriangle },
  { label: "Tasks", path: "/tasks", icon: ClipboardList },
  { label: "Shelters", path: "/shelters", icon: House },
  { label: "Resources", path: "/resources", icon: Package },
  { label: "Volunteers and teams", path: "/volunteers", icon: Users },
  { label: "Notices", path: "/notices", icon: Megaphone },
  { label: "News review", path: "/news-review", icon: Newspaper },
  { label: "Analytics", path: "/analytics", icon: ChartNoAxesCombined },
  { label: "Users and roles", path: "/users", icon: UserCog },
  { label: "Hazard types", path: "/hazard-types", icon: ShieldAlert },
];

export default function App() {
    return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
            <Route
                element={
                    <DashboardLayout navigationItems={navigationItems} />
                }
            >
                <Route path="/" element={<Overview />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/incidents/:id" element={<IncidentDetails />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/shelters" element={<Shelters />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/volunteers" element={<Volunteers />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/news-review" element={<NewsReview />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/hazard-types" element={<HazardTypes />} />
               
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
);
  
}

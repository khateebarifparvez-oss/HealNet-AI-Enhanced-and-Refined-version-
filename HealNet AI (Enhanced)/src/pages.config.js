import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Assessment from './pages/Assessment';
import AssessmentResult from './pages/AssessmentResult';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "Tracker": Tracker,
    "Assessment": Assessment,
    "AssessmentResult": AssessmentResult,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import PrivateRoutes from './utils/PrivateRoute'
import Modal from 'react-modal';
import Dashboard from "./pages/Dashboard";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function App() {

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<LandingPage/>} path='/'/>
            <Route element={<LoginPage/>} path='/login' />
            <Route element={<RegisterPage/>} path='/register' />
            <Route element={<PrivateRoutes />}>
              <Route element={<HomePage/>} path="/home" exact />
              <Route element={<Dashboard/>} path="/dashboard" exact />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

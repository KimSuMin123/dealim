import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // React Router 관련 컴포넌트 import
import './App.css';
import StudentSignup from './components/StudentSignup';
import DriverSignup from './components/DriverSignup';
import Login from './components/Login';
import Reservation from './components/Reservation';
import Check from './components/Check';
import ReservationNow from './components/ReservationNow';
import DriverCheck from './components/DriverCheck';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* URL 경로에 맞는 컴포넌트를 렌더링 */}
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/driver-signup" element={<DriverSignup />} />
          <Route path="/" element={<Login />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/check" element={<Check />} />
          <Route path="/reservation-now" element={<ReservationNow />} />
          <Route path="/drivercheck" element={<DriverCheck />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

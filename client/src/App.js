
import './App.css';
import StudentSignup from './components/StudentSignup';
import DriverSignup from './components/DriverSignup';
import Login from './components/Login';
import Reservation from './components/Reservation';
import Check from './components/Check';
import ReservationNow from './components/ReservationNow';



function App() {
  return (
    <div className="App">
      <StudentSignup/>
      <DriverSignup/>
      <Login/>
      <Reservation/>
      <ReservationNow/>
      <Check/>
    </div>
  );
}

export default App;

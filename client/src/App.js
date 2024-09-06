
import './App.css';
import StudentSignup from './components/StudentSignup';
import DriverSignup from './components/DriverSignup';
import Login from './components/Login';
import Reservation from './components/Reservation';
import Check from './components/Check';



function App() {
  return (
    <div className="App">
      <StudentSignup/>
      <DriverSignup/>
      <Login/>
      <Reservation/>
      <Check/>
    </div>
  );
}

export default App;


import './App.css';
import StudentSignup from './components/StudentSignup';
import DriverSignup from './components/DriverSignup';
import Login from './components/Login';
import Reservation from './components/Reservation';



function App() {
  return (
    <div className="App">
      <StudentSignup/>
      <DriverSignup/>
      <Login/>
      <Reservation/>
    </div>
  );
}

export default App;

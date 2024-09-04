import logo from './logo.svg';
import './App.css';
import StudentSignup from './components/StudentSignup';
import DriverSignup from './components/DriverSignup';
import Login from './components/Login';


function App() {
  return (
    <div className="App">
      <StudentSignup/>
      <DriverSignup/>
      <Login/>
    </div>
  );
}

export default App;

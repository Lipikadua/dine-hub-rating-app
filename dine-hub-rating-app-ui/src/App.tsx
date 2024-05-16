
import './App.css'
import { useNavigate } from 'react-router-dom'
import ROUTES from './routes/RoutesConstants'


function App() {
  // const [count, setCount] = useState(0)
  const navigate = useNavigate();

  return (
    <>
      <div>
        <img src='./dine-hub-bg.jpg' className="logo" alt="Vite logo" style={{ height: 500, width: 1200 }} />
      </div>
      <h1>Welcome to Dine-Hub</h1>
      <div className="card">
        <button onClick={() => { navigate(`${ROUTES.RESTAURANTS}`) }}>
          Let's go!
        </button>
      </div >

    </>
  )
}

export default App

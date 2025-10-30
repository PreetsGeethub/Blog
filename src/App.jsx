import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import './App.css'
import authService from './firebase/config'
import {login,logout} from './store/authSlice'
import { Outlet } from 'react-router-dom'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
function App() {
  const [loading,setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Fetching current user...");
    authService.getCurrentUser()
      .then((data) => {
        console.log("User data:", data);
        if (data) {
          dispatch(login(data));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => console.log("Error in getCurrentUser:", error))
      .finally(() => {
        console.log("Finished loading");
        setLoading(false);
      });
  }, []);
  
  return !loading ?(
    <div className='min-h-screen flex flex-wrap bg-gray-400'>
      <div className='w-full block'>
        <Header/>
        <main>
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
  ) : null
}

export default App

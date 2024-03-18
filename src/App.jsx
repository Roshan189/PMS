import { Outlet } from 'react-router-dom'
import Navbar from './component/Navbar'

export const App = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
   </>
  )
}

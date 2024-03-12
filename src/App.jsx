import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export const App = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
   </>
  )
}

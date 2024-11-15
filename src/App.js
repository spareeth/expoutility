import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
// import HomePage from './pages/HomePage'
import NavbarMain from './components/NavbarMain'
import Footer from './components/Footer'

import ScrollToTop from './components/ScrollToTop'
import Preloader from './components/Preloader'


const HomePage = lazy(() => import('./pages/HomePage'));
const DEWAConsumption = lazy(() => import('./pages/DEWAConsumption'));




const App = () => {
  
  return (
    <>
      <Router>
        <NavbarMain/>
        <Suspense fallback={<Preloader />}>
        <Routes>

        <Route path='/' element={<HomePage/>} />
        <Route path='/dewa' element={<DEWAConsumption/>} />


        </Routes>
        </Suspense>
        <ScrollToTop/>

      </Router>

    </>

  )
}

export default App
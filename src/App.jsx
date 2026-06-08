import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import AnimePage from './pages/AnimePage'
import Search from './pages/Search'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/anime/:id" element={<AnimePage />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  )
}

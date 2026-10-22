import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import World from './pages/World.jsx'
import Explore from './pages/Explore.jsx'
import Country from './pages/Country.jsx'
import Brewery from './pages/Brewery.jsx'
import Compare from './pages/Compare.jsx'
import Trail from './pages/Trail.jsx'
import Passport from './pages/Passport.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<World />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/country/:country" element={<Country />} />
        <Route path="/country/:country/:region" element={<Country />} />
        <Route path="/brewery/:id" element={<Brewery />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/trail" element={<Trail />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

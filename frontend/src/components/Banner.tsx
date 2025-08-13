import { Link } from 'react-router-dom'

import verlata from '../assets/Verlata.png'

const Banner = () => {
  return (
    <header className="mb-4 flex w-full items-center gap-7 bg-black px-6 py-3 text-white shadow md:mb-8">
      <Link to="/" className="transition-colors hover:text-gray-300">
        <div className="flex items-center gap-3">
          <img src={verlata} alt="Logo" className="h-8 w-8" />
        </div>
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/" className="transition-colors hover:text-gray-300">
          Home
        </Link>
        <Link to="/about" className="transition-colors hover:text-gray-300">
          About
        </Link>
      </nav>
    </header>
  )
}

export default Banner

import reactLogo from '../assets/react.svg'

const Banner = () => {
  return (
    <header className="mb-4 flex w-full items-center justify-between bg-black px-6 py-3 text-white shadow md:mb-8">
      <div className="flex items-center gap-3">
        <img src={reactLogo} alt="Logo" className="h-8 w-8" />
      </div>
    </header>
  )
}

export default Banner

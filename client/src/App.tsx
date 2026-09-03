import './App.css'
import CountryProd from './features/country/CountryProd'
import CountrySelect from './features/country/CountrySelect'

function App() {
  return (
    <>
    <div className="mainPanel">
    <CountryProd />
    <CountrySelect />
    </div>
    </>
  )
}

export default App
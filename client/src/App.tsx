import './App.css'
import CountryProd from './features/country/CountryProd'
import CountrySelect from './features/country/CountrySelect'
import ProductionGraphic from './features/production/ProductionGraphic'
function App() {
  return (
    <>
    <div className="mainPanel">
      <div>
    <CountryProd />
    <ProductionGraphic />
    </div>
    <CountrySelect />
    </div>
    </>
  )
}

export default App
import { useAppSelector } from '../../hooks/index'
import type { ProductionState } from './productionSlice';
import Graph from '../../components/Graph'

const ProductionGraphic = () => {
    // We use the selector hook to get state.production
    const fetch: ProductionState = useAppSelector(state => state.production);

    return (
        <section className="chart">
            {/* We ar passing whats inside state.production */}
            <Graph {...fetch}/>
        </section>
    )
}

export default ProductionGraphic
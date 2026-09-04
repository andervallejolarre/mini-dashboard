import { useAppSelector } from '../../hooks/index'
import type { ProductionState } from './productionSlice';
import Graph from '../../components/Graph'

const ProductionGraphic = () => {
    // Select the `state.posts` value from the store into the component
    const fetch: ProductionState = useAppSelector(state => state.production);

    return (
        <section className="chart">
            <Graph {...fetch}/>
        </section>
    )
}

export default ProductionGraphic
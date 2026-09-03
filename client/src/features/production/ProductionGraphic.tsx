import { useAppSelector } from '../../hooks/index'
import type { ProductionState } from './productionSlice';

const ProductionGraphic = () => {
    // Select the `state.posts` value from the store into the component
    const fetch: ProductionState = useAppSelector(state => state.production);

    const renderedProduction = fetch.production.map(prod => (
        <li className="years-prod" key={prod.year}>
            <p>{prod.year}</p>
            <p>{prod.value}</p>
        </li>
    ))

    return (
        <section className="chart">
            {renderedProduction}
        </section>
    )
}

export default ProductionGraphic
import { useAppSelector } from '../../hooks/index'
import type { Country } from './countrySlice';

const CountryProd = () => {
    // Select the `state.posts` value from the store into the component
    const selected: Country = useAppSelector(state => state.country);

    /*const renderedProduction = prod.map(post => (
        <li className="years-prod" key={Math.floor(Math.random() * 100)}>
            <p>{post.year}</p>
            <p>{post.value}</p>
        </li>
    ))*/

    return (
        <section className="chart">
            <h2>{selected.country}'s production </h2>
        </section>
    )
}

export default CountryProd
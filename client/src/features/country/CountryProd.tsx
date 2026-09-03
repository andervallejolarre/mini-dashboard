import { useAppSelector } from '../../hooks/index'

const CountryProd = () => {
    // Select the `state.posts` value from the store into the component
    const prod = useAppSelector(state => state.production)

    const renderedProduction = prod.map(post => (
        <li className="years-prod" key={Math.floor(Math.random() * 100)}>
            <p>{post.year}</p>
            <p>{post.value}</p>
        </li>
    ))

    return (
        <section >
            <ul className="posts-list">
                <h2>Production</h2>
                {renderedProduction}
            </ul>
        </section>
    )
}

export default CountryProd
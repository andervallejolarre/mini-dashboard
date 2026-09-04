import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/index'
import { fetchProduction } from '../production/productionSlice'
import type { Country } from './countrySlice';

const CountryProd = () => {
    const dispatch = useAppDispatch()
    // Select the `state.posts` value from the store into the component
    const selected: Country = useAppSelector(state => state.country);

    useEffect(() => {
    dispatch(fetchProduction())
  }, [selected.country, dispatch])

    return (
        <section className="chart">
            <h2>{selected.country}'s coffee production </h2>
        </section>
    )
}

export default CountryProd
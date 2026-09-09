import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/index'
import { fetchProduction } from '../production/productionSlice'
import type { Country } from './countrySlice';

const CountryProd = () => {
    const dispatch = useAppDispatch()
    // We use the selector hook to get `state.country`
    const selected: Country = useAppSelector(state => state.country);

    useEffect(() => {
        //Event Listenner. WHen ever country state changes fetchProduction is triggered
        dispatch(fetchProduction())
    }, [selected.country, dispatch])

    return (
        <section className="chart">
            {/*Displaying sountry State*/}
            <h2>{selected.country}'s coffee production </h2>
        </section>
    )
}

export default CountryProd
import { useAppDispatch } from '../../hooks/index'
import { type Country, countrySelected } from './countrySlice.ts'

const CountrySelect = () => {

    const allCountries = [
        'ecuador',
        'peru',
        'brazil',
        'colombia',
        'venezuela',
        'bolivia'
    ];

    const dispatch = useAppDispatch()

    const handleClick = (countrySelection: string) => {
        const newCountry: Country = { country: countrySelection };
        dispatch(countrySelected(newCountry));
    }

    return (
        <section>
            <ul className="countrySelection">
                <h3>Choose a country:</h3>
                {allCountries.map(country => (
                    <li key={country}>
                        <button type="button" onClick={() => handleClick(country)}>
                            {country}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default CountrySelect
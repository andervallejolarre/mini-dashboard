const CountrySelect = () => {

    const allCountries = [
        'ecuador',
        'peru',
        'brazil',
        'colombia',
        'venezuela',
        'bolivia'
    ];

    return (
        <section>
            <ul className="countrySelection">
                <h3>Choose a country:</h3>
                {allCountries.map(country =>(
                    <li key={Math.floor(Math.random() * 100)} /*onClick={()=>}*/>{country}</li>
                ))}
            </ul>
        </section>
    )
}

export default CountrySelect
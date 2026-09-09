import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import axios from 'axios'
import { afterEach, describe, expect, test, vi } from 'vitest'
import CountryProd from '../src/features/country/CountryProd'
import CountrySelect from '../src/features/country/CountrySelect'
import { countrySelected } from '../src/features/country/countrySlice'
import productionReducer, { fetchProduction } from '../src/features/production/productionSlice'
import { store } from '../src/store'

//Unit tests

//To avoid any cache contamination
afterEach(() => {
    cleanup()
})

//vitest components, run the tests
describe('country data interaction', () => {
    test('renders all available countries', () => {
        //react testing library, renders our app
        render(
            //We need this to emulate our App without calling the whole app
            <Provider store={store}>
                <CountrySelect />
            </Provider>
        )

        expect(screen.getAllByRole('button')).toHaveLength(6)
        expect(screen.getByRole('button', { name: 'ecuador' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'peru' })).toBeInTheDocument()
    })

    test('changes the selected country when a country is clicked', async () => {
        //user-event from testing library let us perform clicks
        const user = userEvent.setup()
        store.dispatch(countrySelected({ country: 'ecuador' }))

        render(
            <Provider store={store}>
                <CountrySelect />
            </Provider>
        )

        await user.click(screen.getByRole('button', { name: 'peru' }))

        expect(store.getState().country.country).toBe('peru')
    })

    test('updates the country state with the selected country action', () => {
        store.dispatch(countrySelected({ country: 'ecuador' }))

        store.dispatch(countrySelected({ country: 'brazil' }))

        expect(store.getState().country.country).toBe('brazil')
    })

    test('displays the selected country', () => {
        //Here vi.spyOn does the same as jest.spyOn in server tests
        const getProduction = vi.spyOn(axios, 'get').mockResolvedValue({ data: [] })
        store.dispatch(countrySelected({ country: 'colombia' }))

        render(
            <Provider store={store}>
                <CountryProd />
            </Provider>
        )

        expect(
            screen.getByRole('heading', { name: /colombia's coffee production/i })
        ).toBeInTheDocument()

        getProduction.mockRestore()
    })

    test('requests production for the selected country', async () => {
        const getProduction = vi.spyOn(axios, 'get').mockResolvedValue({ data: [] })
        store.dispatch(countrySelected({ country: 'peru' }))

        await store.dispatch(fetchProduction())

        expect(getProduction).toHaveBeenCalledWith('/api/production/peru')

        getProduction.mockRestore()
    })

    //testing thunks
    test('sets production status to pending while requesting data', () => {
        const pendingAction = fetchProduction.pending('request-id', undefined)

        const state = productionReducer(undefined, pendingAction)

        expect(state.status).toBe('pending')
        expect(state.error).toBeNull()
    })

    test('stores production statusto fulfilled when achieving an API response', async () => {
        const getProduction = vi.spyOn(axios, 'get').mockResolvedValue({data: []})
        store.dispatch(countrySelected({ country: 'peru' }))

        const response = await store.dispatch(fetchProduction())

        expect(response.type).toBe('production/fetch/fulfilled')
        expect(store.getState().production.status).toBe('succeeded')
        expect(store.getState().production.production).toEqual([])

        getProduction.mockRestore()
    })

    test('stores an error when production cannot be requested', async () => {
        const getProduction = vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'))
        store.dispatch(countrySelected({ country: 'peru' }))

        const response = await store.dispatch(fetchProduction())

        expect(response.type).toBe('production/fetch/rejected')
        expect(store.getState().production.status).toBe('failed')
        expect(store.getState().production.error).toBe('Network error')

        getProduction.mockRestore()
    })
})
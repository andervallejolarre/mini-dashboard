import { AreaChart } from '@mantine/charts';
import type { ProductionState } from '../features/production/productionSlice';

const Graph = (props: ProductionState)  => {
    return (
        <div>

            <AreaChart
                h={300}
                data={props.production}
                dataKey="year"
                series={[
                    { name: 'value', color: 'indigo.6' },
                ]}
                curveType="linear"
                tickLine="x"
            />
        </div>
    )
}

export default Graph
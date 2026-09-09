import { AreaChart } from '@mantine/charts';
import type { ProductionState } from '../features/production/productionSlice';

const Graph = (props: ProductionState)  => {
    return (
        <div>
            {/*using a Mantine widget*/}
            <AreaChart
                h={300}
                data={props.production}
                // X 
                dataKey="year"
                // Y 
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
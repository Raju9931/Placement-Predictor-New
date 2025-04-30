
import { FeatureContribution } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

interface FeatureImpactChartProps {
  positiveFeatures: FeatureContribution[];
  negativeFeatures: FeatureContribution[];
}

interface ChartDataItem {
  name: string;
  value: number;
  displayName: string;
  color: string;
}

const FeatureImpactChart: React.FC<FeatureImpactChartProps> = ({ 
  positiveFeatures, 
  negativeFeatures 
}) => {
  // Combine and transform data for chart
  const chartData: ChartDataItem[] = [
    ...positiveFeatures.map(feature => ({
      name: feature.feature,
      value: feature.contribution,
      displayName: feature.displayName,
      color: '#22c55e' // Green for positive
    })),
    ...negativeFeatures.map(feature => ({
      name: feature.feature,
      value: feature.contribution,
      displayName: feature.displayName,
      color: '#ef4444' // Red for negative
    }))
  ].sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          <p className="font-medium">{data.displayName}</p>
          <p className="text-gray-700">
            Impact: <span className={data.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.value >= 0 ? '+' : ''}{data.value.toFixed(1)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => value >= 0 ? `+${value}` : value.toString()}
          />
          <YAxis 
            dataKey="displayName" 
            type="category" 
            width={100}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#666" />
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImpactChart;

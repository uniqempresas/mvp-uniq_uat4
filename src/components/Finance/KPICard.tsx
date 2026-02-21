export interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color: 'green' | 'red' | 'blue' | 'purple';
  icon?: string;
  isLoading?: boolean;
}



const colorClasses: Record<string, { bg: string; text: string; badge: string }> = {
  green: {
    bg: 'bg-white',
    text: 'text-gray-900',
    badge: 'text-green-600 bg-green-50'
  },
  red: {
    bg: 'bg-white',
    text: 'text-gray-900',
    badge: 'text-red-600 bg-red-50'
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-900 to-blue-700',
    text: 'text-white',
    badge: 'text-white bg-white/20'
  },
  purple: {
    bg: 'bg-white',
    text: 'text-gray-900',
    badge: 'text-purple-600 bg-purple-50'
  }
};

export function KPICard({ title, value, trend, color, icon, isLoading }: KPICardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} rounded-xl p-4 md:p-6 shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm md:text-base ${color === 'blue' ? 'text-white/80' : 'text-gray-600'}`}>
          {title}
        </span>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.badge}`}>
            {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '' : ''}{trend.value}%
          </span>
        )}
        {icon && (
          <span className={`material-symbols-outlined text-[20px] ${color === 'blue' ? 'text-white/60' : 'text-gray-400'}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl md:text-3xl lg:text-4xl font-bold ${colors.text}`}>
          {isLoading ? '...' : value}
        </span>
      </div>
    </div>
  );
}

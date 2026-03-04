export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple';
  isLoading?: boolean;
}

const colorClasses: Record<string, { 
  bg: string; 
  text: string; 
  badge: string;
  iconBg: string;
  iconColor: string;
}> = {
  green: {
    bg: 'bg-white dark:bg-[#1a2e1f]',
    text: 'text-gray-900 dark:text-white',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-700 dark:text-green-400'
  },
  blue: {
    bg: 'bg-white dark:bg-[#1a2e1f]',
    text: 'text-gray-900 dark:text-white',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-700 dark:text-blue-400'
  },
  red: {
    bg: 'bg-white dark:bg-[#1a2e1f]',
    text: 'text-gray-900 dark:text-white',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-700 dark:text-red-400'
  },
  yellow: {
    bg: 'bg-white dark:bg-[#1a2e1f]',
    text: 'text-gray-900 dark:text-white',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-700 dark:text-yellow-400'
  },
  purple: {
    bg: 'bg-white dark:bg-[#1a2e1f]',
    text: 'text-gray-900 dark:text-white',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-700 dark:text-purple-400'
  }
};

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'green',
  isLoading 
}: KPICardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm`}>
      {/* Header: Icon + Title */}
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
          <span className={`material-symbols-outlined text-xl md:text-2xl ${colors.iconColor}`}>
            {icon}
          </span>
        </div>
        {trend && (
          <span className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full ${colors.badge}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${colors.text} truncate`}>
          {isLoading ? '...' : value}
        </p>
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

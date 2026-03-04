import type { BusinessHours } from '../../../types/attendant';

interface BusinessHoursConfigProps {
  businessHours: BusinessHours;
  onChange: (businessHours: BusinessHours) => void;
}

const DAYS = [
  { key: 'mon', label: 'Segunda-feira' },
  { key: 'tue', label: 'Terça-feira' },
  { key: 'wed', label: 'Quarta-feira' },
  { key: 'thu', label: 'Quinta-feira' },
  { key: 'fri', label: 'Sexta-feira' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
] as const;

export function BusinessHoursConfig({ businessHours, onChange }: BusinessHoursConfigProps) {
  const handleDayToggle = (day: keyof BusinessHours) => {
    const currentValue = businessHours[day];
    onChange({
      ...businessHours,
      [day]: currentValue ? null : { open: '09:00', close: '18:00' },
    });
  };

  const handleTimeChange = (
    day: keyof BusinessHours,
    field: 'open' | 'close',
    value: string
  ) => {
    const currentDay = businessHours[day];
    if (!currentDay) return;

    onChange({
      ...businessHours,
      [day]: { ...currentDay, [field]: value },
    });
  };

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Horário de Funcionamento</h2>
      
      <div className="space-y-3">
        {DAYS.map(({ key, label }) => {
          const dayConfig = businessHours[key];
          const isOpen = dayConfig !== null;

          return (
            <div key={key} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
              <label className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={() => handleDayToggle(key)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className={`font-medium ${isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </label>

              {isOpen && dayConfig && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={dayConfig.open}
                    onChange={(e) => handleTimeChange(key, 'open', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-gray-500">até</span>
                  <input
                    type="time"
                    value={dayConfig.close}
                    onChange={(e) => handleTimeChange(key, 'close', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}

              {!isOpen && (
                <span className="text-sm text-gray-400 italic">Fechado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

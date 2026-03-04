import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { attendantService } from '../../services/attendantService';
import { ModeSelector } from './components/ModeSelector';
import { PersonalityConfig } from './components/PersonalityConfig';
import { BusinessHoursConfig } from './components/BusinessHoursConfig';
import { UraConfig } from './components/UraConfig';
import type { AttendantConfig, AttendantConfigFormData } from '../../types/attendant';

export default function AttendantConfig() {
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [config, setConfig] = useState<AttendantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AttendantConfigFormData>({
    agent_name: 'Atendente UNIQ',
    mode: 'ura',
    welcome_message: 'Olá! Bem-vindo à nossa empresa. Como posso ajudar?',
    away_message: 'Nosso horário de atendimento é de segunda a sexta das 9h às 18h. Retornaremos em breve!',
    business_hours: {
      mon: { open: '09:00', close: '18:00' },
      tue: { open: '09:00', close: '18:00' },
      wed: { open: '09:00', close: '18:00' },
      thu: { open: '09:00', close: '18:00' },
      fri: { open: '09:00', close: '18:00' },
      sat: { open: '09:00', close: '12:00' },
      sun: null,
    },
  });

  useEffect(() => {
    loadEmpresaId();
  }, []);

  useEffect(() => {
    if (empresaId) {
      loadConfig();
    }
  }, [empresaId]);

  const loadEmpresaId = async () => {
    const id = await authService.getEmpresaId();
    setEmpresaId(id);
  };

  const loadConfig = async () => {
    if (!empresaId) return;
    
    try {
      setLoading(true);
      const data = await attendantService.getConfig(empresaId);
      if (data) {
        setConfig(data);
        setFormData({
          agent_name: data.agent_name,
          agent_personality: data.agent_personality,
          mode: data.mode,
          avatar_url: data.avatar_url,
          welcome_message: data.welcome_message || '',
          away_message: data.away_message || '',
          business_hours: data.business_hours,
          phone_number: data.phone_number,
          evolution_instance_id: data.evolution_instance_id,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!empresaId) return;
    
    try {
      setSaving(true);
      await attendantService.saveConfig(empresaId, formData);
      await loadConfig();
      alert('Configuração salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar configuração');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!empresaId || !config) return;
    
    const newStatus = config.status === 'active' ? 'paused' : 'active';
    try {
      await attendantService.updateStatus(empresaId, newStatus);
      await loadConfig();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuração do Atendente</h1>
        <p className="text-gray-600">Configure seu atendente virtual e as respostas automáticas</p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Status do Atendente</h2>
            <p className="text-sm text-gray-500">
              {config?.status === 'active' 
                ? 'Atendente ativo e pronto para receber mensagens' 
                : 'Atendente pausado - mensagens serão armazenadas mas não processadas'}
            </p>
          </div>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              config?.status === 'active'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {config?.status === 'active' ? 'Ativo' : 'Pausado'}
          </button>
        </div>
      </div>

      {/* Mode Selection */}
      <ModeSelector
        mode={formData.mode}
        onChange={(mode) => setFormData({ ...formData, mode })}
      />

      {/* Personality Config */}
      <PersonalityConfig
        formData={formData}
        onChange={(updates) => setFormData({ ...formData, ...updates })}
      />

      {/* Business Hours */}
      <BusinessHoursConfig
        businessHours={formData.business_hours}
        onChange={(business_hours) => setFormData({ ...formData, business_hours })}
      />

      {/* URA Config - Only show if mode is 'ura' */}
      {formData.mode === 'ura' && empresaId && (
        <UraConfig empresaId={empresaId} />
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
}

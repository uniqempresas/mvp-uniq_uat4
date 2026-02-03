export interface Service {
    id: number
    empresa_id: string
    nome: string
    descricao?: string
    categoria?: string
    preco: number
    duracao?: number // minutos
    ativo: boolean
    created_at?: string
    updated_at?: string
}

export const mockServices: Service[] = [
    {
        id: 1,
        empresa_id: 'mock-empresa-1',
        nome: 'Consultoria Estratégica',
        descricao: 'Análise de processos e planejamento estratégico empresarial',
        categoria: 'Consultoria',
        preco: 500.00,
        duracao: 120,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        empresa_id: 'mock-empresa-1',
        nome: 'Manutenção Preventiva',
        descricao: 'Manutenção periódica de equipamentos e sistemas',
        categoria: 'Manutenção',
        preco: 150.00,
        duracao: 60,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 3,
        empresa_id: 'mock-empresa-1',
        nome: 'Instalação de Sistema',
        descricao: 'Instalação e configuração completa de software',
        categoria: 'Instalação',
        preco: 300.00,
        duracao: 180,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 4,
        empresa_id: 'mock-empresa-1',
        nome: 'Treinamento de Equipe',
        descricao: 'Capacitação e treinamento de colaboradores',
        categoria: 'Treinamento',
        preco: 800.00,
        duracao: 240,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 5,
        empresa_id: 'mock-empresa-1',
        nome: 'Suporte Técnico Mensal',
        descricao: 'Pacote mensal de suporte técnico especializado',
        categoria: 'Suporte Técnico',
        preco: 400.00,
        duracao: undefined,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 6,
        empresa_id: 'mock-empresa-1',
        nome: 'Design de Interface',
        descricao: 'Criação de interfaces modernas e intuitivas',
        categoria: 'Design',
        preco: 1200.00,
        duracao: 480,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 7,
        empresa_id: 'mock-empresa-1',
        nome: 'Marketing Digital',
        descricao: 'Gestão completa de campanhas de marketing digital',
        categoria: 'Marketing',
        preco: 2000.00,
        duracao: undefined,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 8,
        empresa_id: 'mock-empresa-1',
        nome: 'Desenvolvimento Web',
        descricao: 'Desenvolvimento de aplicações web personalizadas',
        categoria: 'Desenvolvimento',
        preco: 3500.00,
        duracao: 960,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 9,
        empresa_id: 'mock-empresa-1',
        nome: 'Auditoria de Segurança',
        descricao: 'Análise e auditoria de segurança de sistemas',
        categoria: 'Consultoria',
        preco: 1500.00,
        duracao: 360,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 10,
        empresa_id: 'mock-empresa-1',
        nome: 'Backup e Recuperação',
        descricao: 'Serviço de backup e recuperação de dados',
        categoria: 'Suporte Técnico',
        preco: 250.00,
        duracao: 90,
        ativo: true,
        created_at: new Date().toISOString()
    },
    {
        id: 11,
        empresa_id: 'mock-empresa-1',
        nome: 'Consultoria Financeira',
        descricao: 'Orientação e planejamento financeiro empresarial',
        categoria: 'Consultoria',
        preco: 600.00,
        duracao: 180,
        ativo: false,
        created_at: new Date().toISOString()
    },
    {
        id: 12,
        empresa_id: 'mock-empresa-1',
        nome: 'Manutenção Corretiva',
        descricao: 'Correção de problemas e falhas em equipamentos',
        categoria: 'Manutenção',
        preco: 200.00,
        duracao: 120,
        ativo: true,
        created_at: new Date().toISOString()
    }
]

export const USE_MOCK_SERVICES = false

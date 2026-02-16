import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { moduleService } from '../../services/moduleService'
import Step1Personal from './Step1Personal'
import Step2Company from './Step2Company'
import Step3Config from './Step3Config'
import { getErrorMessage } from '../../utils/errorMessages'

export default function Onboarding() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Forçar light mode durante onboarding
    useEffect(() => {
        const html = document.documentElement
        const hadDarkClass = html.classList.contains('dark')

        // Remove dark mode
        html.classList.remove('dark')

        // Restaura ao sair
        return () => {
            if (hadDarkClass) {
                html.classList.add('dark')
            }
        }
    }, [])

    const [formData, setFormData] = useState({
        // Step 1: Personal
        fullName: '',
        email: '',
        cpf: '', // Used as user ID/document if needed
        password: '',
        confirmPassword: '',

        // Step 2: Company
        companyName: '',
        cnpj: '',
        phone: '',
        segment: '',
        employees: '',
        address: {
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
            ibge: ''
        },

        // Step 3: Config
        modules: {
            sales: true,
            stock: true,
            finance: false,
            fiscal: false,
            crm: false,
            projects: false,
        },
        termsAgreed: false
    })

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }))
    }

    const handleNext = () => {
        window.scrollTo(0, 0)
        setStep(prev => prev + 1)
    }

    const handleBack = () => {
        window.scrollTo(0, 0)
        setStep(prev => prev - 1)
    }

    const handleFinish = async () => {
        setLoading(true)
        try {
            // 1. Create User in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone
                    }
                }
            })

            if (authError) {
                console.error('Auth error:', authError)
                alert(getErrorMessage(authError))
                setLoading(false)
                return
            }

            if (!authData.user) throw new Error("Erro ao criar usuário")

            // Helper to generate slug
            const generateSlug = (name: string) => {
                return name
                    .toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
                    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
                    + '-' + Math.floor(Math.random() * 1000) // Add random suffix to ensure uniqueness
            }

            const slug = generateSlug(formData.companyName)

            // 2. Criar empresa + usuário + endereço + dados iniciais via RPC
            const { data: rpcData, error: rpcError } = await supabase.rpc(
                'criar_empresa_e_configuracoes_iniciais',
                {
                    p_usuario_id: authData.user.id,
                    p_nome_fantasia: formData.companyName,
                    p_cnpj: formData.cnpj,
                    p_telefone: formData.phone,
                    p_email: formData.email,
                    p_slug: slug,
                    // Endereço
                    p_cep: formData.address.cep,
                    p_logradouro: formData.address.logradouro,
                    p_numero: formData.address.numero,
                    p_complemento: formData.address.complemento,
                    p_bairro: formData.address.bairro,
                    p_cidade: formData.address.cidade,
                    p_uf: formData.address.uf,
                    p_ibge: formData.address.ibge,
                    p_nome_usuario: formData.fullName
                }
            )

            if (rpcError) {
                console.error('RPC error:', rpcError)

                // Tentar rollback automático (TRACK-009)
                try {
                    console.log('Tentando rollback automático do usuário...')
                    const { error: rollbackError } = await supabase.rpc('clean_up_failed_registration')

                    if (rollbackError) {
                        console.error('Falha no rollback:', rollbackError)
                        alert(`Erro no cadastro: ${getErrorMessage(rpcError)}. \n\nATENÇÃO: Sua conta foi criada, mas houve erro ao configurar a empresa. Contate o suporte.`)
                    } else {
                        console.log('Rollback executado com sucesso.')
                        // Forçar logout para limpar sessão
                        await supabase.auth.signOut()
                        alert(`Erro no processo de criação da empresa: ${getErrorMessage(rpcError)}. \n\nSua conta temporária foi removida. Tente novamente.`)
                    }
                } catch (e) {
                    console.error('Erro desconhecido no rollback:', e)
                    alert(`Erro no cadastro: ${getErrorMessage(rpcError)}`)
                }

                setLoading(false)
                return
            }

            // Success - auth.signUp já faz login automático!
            console.log('Empresa criada com dados iniciais:', rpcData)

            // 3. Ativar módulos selecionados
            const selectedModules = Object.entries(formData.modules)
                .filter(([_, isActive]) => isActive)
                .map(([code]) => code);

            if (selectedModules.length > 0) {
                try {
                    // Executar em paralelo para performance
                    await Promise.all(
                        selectedModules.map(moduleCode =>
                            moduleService.toggleModule(moduleCode, true)
                        )
                    );
                    console.log('Módulos ativados:', selectedModules);
                } catch (moduleError) {
                    console.error('Erro ao ativar módulos:', moduleError);
                    // Não bloquear o fluxo, pois a empresa foi criada.
                    // O usuário pode ativar depois em Configurações.
                }
            }

            navigate('/dashboard')

        } catch (error: any) {
            console.error("Error onboarding:", error)
            alert(getErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-background-light dark:bg-background-dark text-input-text antialiased">
            {/* Left Panel - Hero (Hidden on Mobile) */}
            <div className="hidden lg:flex w-5/12 relative flex-col justify-between p-12 bg-cover bg-center overflow-hidden group/brand" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwtTdSTqn2Hvkja7cVG14Ri370pk7NcSFWs2RYLCbQ3xQrBV1Le30c2QT0anGp3-Q2oJX0XF6U7Q-cSBK2X_9mfPCxnBelzETjXlF93b7Fsas0v2TAkKAon56tTdDN_ewWM_2yKwk4qj6eghi8eeXfWrvAo0SC2MCoeTPvQ3f7lBrDorhmj1mRmDBttSMalRknzlNwEQWgSzUNSgnYXGYtziw5Ydy-_H7M2nt0fHN5Ohq9KuwdZTppajsbxxNGP8J9NNdH67on1MA-')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 to-brand-dark/90 mix-blend-multiply"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-brand-teal rounded-lg flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-2xl">spa</span>
                            </div>
                            <span className="text-white text-2xl font-bold tracking-tight">UNIQ</span>
                        </div>
                    </div>
                    <div className="space-y-6 max-w-md">
                        <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">
                            O ecossistema completo para o crescimento do seu negócio.
                        </h1>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Gerencie finanças, estoque e vendas em um único lugar. Simples, rápido e eficiente.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Content */}
            <div className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center p-6 pb-0">
                    <div className="h-8 w-8 bg-brand-teal rounded-lg flex items-center justify-center mr-3">
                        <span className="material-symbols-outlined text-white text-lg">spa</span>
                    </div>
                    <span className="text-input-text dark:text-white text-xl font-bold">UNIQ</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24">
                    <div className="w-full max-w-[640px] flex flex-col">

                        {/* Stepper */}
                        <div className="flex items-center justify-between mb-12 relative w-full px-4">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-input-border z-0 rounded-full"></div>
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500 rounded-full"
                                style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }}
                            ></div>

                            {/* Step 1 Indicator */}
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => step > 1 && setStep(1)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background-light dark:ring-background-dark transition-all transform ${step >= 1 ? 'bg-primary text-white scale-105' : 'bg-white text-input-placeholder border-2 border-input-border'}`}>
                                    {step > 1 ? <span className="material-symbols-outlined text-xl">check</span> : <span className="material-symbols-outlined text-xl">person</span>}
                                </div>
                                <span className={`text-sm font-bold absolute -bottom-8 whitespace-nowrap ${step >= 1 ? 'text-primary' : 'text-input-placeholder'}`}>Conta</span>
                            </div>

                            {/* Step 2 Indicator */}
                            <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => step > 2 && setStep(2)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background-light dark:ring-background-dark transition-all transform ${step >= 2 ? 'bg-primary text-white scale-105' : 'bg-white text-input-placeholder border-2 border-input-border'}`}>
                                    {step > 2 ? <span className="material-symbols-outlined text-xl">check</span> : <span className="font-bold text-lg">2</span>}
                                </div>
                                <span className={`text-sm font-bold absolute -bottom-8 whitespace-nowrap ${step >= 2 ? 'text-primary' : 'text-input-text dark:text-white'}`}>Empresa</span>
                            </div>

                            {/* Step 3 Indicator */}
                            <div className="relative z-10 flex flex-col items-center gap-2 group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ring-4 ring-background-light dark:ring-background-dark transition-all transform ${step >= 3 ? 'bg-primary text-white scale-105' : 'bg-white text-input-placeholder border-2 border-input-border'}`}>
                                    <span className="font-bold text-lg">3</span>
                                </div>
                                <span className={`text-sm font-bold absolute -bottom-8 whitespace-nowrap ${step >= 3 ? 'text-primary' : 'text-input-placeholder'}`}>Configuração</span>
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="mt-8 bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-input-border p-8 sm:p-10 relative overflow-hidden animate-fadeIn">
                            {step === 1 && <Step1Personal formData={formData} updateFormData={updateFormData} onNext={handleNext} />}
                            {step === 2 && <Step2Company formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />}
                            {step === 3 && <Step3Config formData={formData} updateFormData={updateFormData} onSubmit={handleFinish} onBack={handleBack} loading={loading} />}
                        </div>

                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-input-placeholder">
                                Já tem uma conta empresarial? <a href="/" className="font-bold text-primary hover:underline">Fazer login</a>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

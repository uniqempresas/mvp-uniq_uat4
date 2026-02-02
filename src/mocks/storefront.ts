import type { PublicProduct } from '../services/publicService'

// Empresa mockada
export const mockCompany = {
    id: 'mock-empresa-1',
    nome_fantasia: 'Boutique Elegance',
    telefone: '11987654321',
    slug: 'boutique-elegance',
    avatar_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'
}

// Produtos mockados (tipados como any[] temporariamente para evitar erros de lint)
export const mockProducts = [
    {
        id: 1,
        empresa_id: 'mock-empresa-1',
        nome_produto: 'Camiseta Premium Básica',
        preco: 89.90,
        preco_varejo: 69.90,
        preco_custo: 35,
        descricao: 'Camiseta 100% algodão egípcio, macia e confortável. Perfeita para o dia a dia com estilo.',
        ativo: true,
        exibir_vitrine: true,
        estoque_atual: 45,
        categoria_id: 1,
        tipo: 'variavel',
        imagens: [
            {
                id: '1',
                produto_id: 1,
                imagem_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
                ordem_exibicao: 1
            },
            {
                id: '2',
                produto_id: 1,
                imagem_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
                ordem_exibicao: 2
            }
        ],
        variacoes: [
            { id: '1', produto_pai_id: 1, nome_variacao: 'P - Branco', preco: 69.90, preco_varejo: 69.90, estoque: 15 },
            { id: '2', produto_pai_id: 1, nome_variacao: 'M - Branco', preco: 69.90, preco_varejo: 69.90, estoque: 20 },
            { id: '3', produto_pai_id: 1, nome_variacao: 'G - Branco', preco: 69.90, preco_varejo: 69.90, estoque: 10 }
        ]
    },
    {
        id: 2,
        empresa_id: 'mock-empresa-1',
        nome_produto: 'Calça Jeans Skinny',
        preco: 189.90,
        preco_varejo: 149.90,
        preco_custo: 75,
        descricao: 'Calça jeans de corte moderno, com elastano para maior conforto.',
        ativo: true,
        exibir_vitrine: true,
        estoque_atual: 30,
        categoria_id: 1,
        tipo: 'variavel',
        imagens: [
            { id: '3', produto_id: 2, imagem_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', ordem_exibicao: 1 }
        ],
        variacoes: [
            { id: '4', produto_pai_id: 2, nome_variacao: '38', preco: 149.90, preco_varejo: 149.90, estoque: 8 },
            { id: '5', produto_pai_id: 2, nome_variacao: '40', preco: 149.90, preco_varejo: 149.90, estoque: 12 },
            { id: '6', produto_pai_id: 2, nome_variacao: '42', preco: 149.90, preco_varejo: 149.90, estoque: 10 }
        ]
    },
    {
        id: 3,
        empresa_id: 'mock-empresa-1',
        nome_produto: 'Tênis Esportivo Runner',
        preco: 299.90,
        preco_custo: 150,
        descricao: 'Tênis esportivo de alta performance com tecnologia de amortecimento.',
        ativo: true,
        exibir_vitrine: true,
        estoque_atual: 25,
        categoria_id: 2,
        tipo: 'simples',
        imagens: [
            { id: '7', produto_id: 3, imagem_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', ordem_exibicao: 1 },
            { id: '8', produto_id: 3, imagem_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', ordem_exibicao: 2 }
        ],
        variacoes: []
    },
    {
        id: 4,
        empresa_id: 'mock-empresa-1',
        nome_produto: 'Bolsa Feminina Transversal',
        preco: 159.90,
        preco_varejo: 129.90,
        preco_custo: 65,
        descricao: 'Bolsa elegante e prática, perfeita para o dia a dia.',
        ativo: true,
        exibir_vitrine: true,
        estoque_atual: 18,
        categoria_id: 3,
        tipo: 'variavel',
        imagens: [
            { id: '9', produto_id: 4, imagem_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', ordem_exibicao: 1 }
        ],
        variacoes: [
            { id: '10', produto_pai_id: 4, nome_variacao: 'Preta', preco: 129.90, preco_varejo: 129.90, estoque: 10 },
            { id: '11', produto_pai_id: 4, nome_variacao: 'Caramelo', preco: 129.90, preco_varejo: 129.90, estoque: 8 }
        ]
    },
    {
        id: 5,
        empresa_id: 'mock-empresa-1',
        nome_produto: 'Relógio Casual Minimalista',
        preco: 249.90,
        preco_varejo: 199.90,
        preco_custo: 100,
        descricao: 'Relógio de pulso com design clean e minimalista.',
        ativo: true,
        exibir_vitrine: true,
        estoque_atual: 12,
        categoria_id: 3,
        tipo: 'simples',
        imagens: [
            { id: '12', produto_id: 5, imagem_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600', ordem_exibicao: 1 }
        ],
        variacoes: []
    },
    {
        id: 6,
        empresa_id: 'mock-empresa-1',
        nome_produto: 'Óculos de Sol Aviador',
        preco: 179.90,
        preco_custo: 90,
        descricao: 'Óculos de sol estilo aviador com proteção UV400.',
        ativo: true,
        exibir_vitrine: true,
        estoque_atual: 20,
        categoria_id: 3,
        tipo: 'simples',
        imagens: [
            { id: '13', produto_id: 6, imagem_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', ordem_exibicao: 1 }
        ],
        variacoes: []
    }
] as PublicProduct[]

// Categorias mockadas
export const mockCategories = [
    { id: '1', nome_categoria: 'Roupas' },
    { id: '2', nome_categoria: 'Calçados' },
    { id: '3', nome_categoria: 'Acessórios' }
]

// Flag para ativar/desativar mock data
export const USE_MOCK_DATA = true

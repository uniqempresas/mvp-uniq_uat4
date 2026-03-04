import { TestData } from './data-loader'

export interface ProdutoTeste {
    nome: string
    descricao: string
    preco: number
    precoCusto: number
    estoque: number
    estoqueMinimo: number
    sku: string
    categoria: string
    tipo: 'simples' | 'variavel'
    variacoes?: string[]
}

const PRODUTOS_POR_TIPO: Record<string, ProdutoTeste[]> = {
    optica: [
        {
            nome: 'Armação de Óculos de Grau',
            descricao: 'Armação acetato resistente, estilo moderno',
            preco: 299.90,
            precoCusto: 120.00,
            estoque: 15,
            estoqueMinimo: 5,
            sku: 'ARM-001',
            categoria: 'Armações',
            tipo: 'simples'
        },
        {
            nome: 'Lente para Grau',
            descricao: 'Lente policarbonato antirreflexo',
            preco: 199.90,
            precoCusto: 80.00,
            estoque: 50,
            estoqueMinimo: 10,
            sku: 'LEN-001',
            categoria: 'Lentes',
            tipo: 'simples'
        },
        {
            nome: 'Óculos de Sol',
            descricao: 'Proteção UV400, armação leve',
            preco: 249.90,
            precoCusto: 100.00,
            estoque: 20,
            estoqueMinimo: 8,
            sku: 'SOL-001',
            categoria: 'Óculos de Sol',
            tipo: 'simples'
        },
        {
            nome: 'Estojo para Óculos',
            descricao: 'Estojo rígido com forro de veludo',
            preco: 49.90,
            precoCusto: 20.00,
            estoque: 100,
            estoqueMinimo: 30,
            sku: 'EST-001',
            categoria: 'Acessórios',
            tipo: 'simples'
        },
        {
            nome: 'Limpa Lentes',
            descricao: 'Spray limpador 60ml com flanela',
            preco: 29.90,
            precoCusto: 12.00,
            estoque: 200,
            estoqueMinimo: 50,
            sku: 'LIM-001',
            categoria: 'Acessórios',
            tipo: 'simples'
        }
    ],
    confeccao: [
        {
            nome: 'Camiseta Básica Algodão',
            descricao: '100% algodão, disponível em várias cores',
            preco: 59.90,
            precoCusto: 25.00,
            estoque: 100,
            estoqueMinimo: 30,
            sku: 'CAM-001',
            categoria: 'Camisetas',
            tipo: 'variavel',
            variacoes: ['P', 'M', 'G', 'GG']
        },
        {
            nome: 'Calça Jeans Masculina',
            descricao: 'Jeans premium, corte slim',
            preco: 149.90,
            precoCusto: 65.00,
            estoque: 50,
            estoqueMinimo: 15,
            sku: 'CAL-JEANS-M',
            categoria: 'Calças',
            tipo: 'variavel',
            variacoes: ['38', '40', '42', '44', '46']
        },
        {
            nome: 'Blusa Social Feminina',
            descricao: 'Tecido leve, ideal para escritório',
            preco: 119.90,
            precoCusto: 50.00,
            estoque: 40,
            estoqueMinimo: 12,
            sku: 'BLU-SOC-F',
            categoria: 'Blusas',
            tipo: 'variavel',
            variacoes: ['P', 'M', 'G']
        },
        {
            nome: 'Shorts Jeans',
            descricao: 'Shorts casual, lavagem stone',
            preco: 89.90,
            precoCusto: 38.00,
            estoque: 60,
            estoqueMinimo: 20,
            sku: 'SHO-JEANS',
            categoria: 'Shorts',
            tipo: 'variavel',
            variacoes: ['36', '38', '40', '42']
        },
        {
            nome: 'Vestido Casual',
            descricao: 'Viscose estampada, confortável',
            preco: 129.90,
            precoCusto: 55.00,
            estoque: 35,
            estoqueMinimo: 10,
            sku: 'VES-CAS',
            categoria: 'Vestidos',
            tipo: 'variavel',
            variacoes: ['P', 'M', 'G']
        }
    ],
    hamburgueria: [
        {
            nome: 'Hambúrguer Clássico',
            descricao: 'Carne 180g, queijo cheddar, alface, tomate, molho especial',
            preco: 29.90,
            precoCusto: 12.00,
            estoque: 100,
            estoqueMinimo: 20,
            sku: 'HAM-CLA',
            categoria: 'Hambúrgueres',
            tipo: 'simples'
        },
        {
            nome: 'Cheeseburger Duplo',
            descricao: 'Duas carnes 180g, duplo queijo, bacon crocante',
            preco: 39.90,
            precoCusto: 16.00,
            estoque: 80,
            estoqueMinimo: 15,
            sku: 'HAM-CHE-DUP',
            categoria: 'Hambúrgueres',
            tipo: 'simples'
        },
        {
            nome: 'Batata Frita (Média)',
            descricao: 'Porção média, sal e tempero especial',
            preco: 19.90,
            precoCusto: 6.00,
            estoque: 200,
            estoqueMinimo: 50,
            sku: 'BAT-MED',
            categoria: 'Acompanhamentos',
            tipo: 'simples'
        },
        {
            nome: 'Refrigerante Lata',
            descricao: 'Lata 350ml - Coca, Guaraná ou Sprite',
            preco: 7.90,
            precoCusto: 3.50,
            estoque: 300,
            estoqueMinimo: 100,
            sku: 'REF-LATA',
            categoria: 'Bebidas',
            tipo: 'variavel',
            variacoes: ['Coca-Cola', 'Guaraná', 'Sprite']
        },
        {
            nome: 'Milkshake de Chocolate',
            descricao: 'Sorvete artesanal, chantilly e calda',
            preco: 18.90,
            precoCusto: 7.00,
            estoque: 50,
            estoqueMinimo: 15,
            sku: 'MILK-CHOC',
            categoria: 'Sobremesas',
            tipo: 'simples'
        }
    ],
    loja_roupas: [
        {
            nome: 'Camiseta Estampada',
            descricao: 'Algodão premium, estampas exclusivas',
            preco: 79.90,
            precoCusto: 32.00,
            estoque: 80,
            estoqueMinimo: 25,
            sku: 'CAM-EST',
            categoria: 'Camisetas',
            tipo: 'variavel',
            variacoes: ['P', 'M', 'G', 'GG']
        },
        {
            nome: 'Calça Cargo',
            descricao: 'Estilo urbano, múltiplos bolsos',
            preco: 189.90,
            precoCusto: 78.00,
            estoque: 45,
            estoqueMinimo: 12,
            sku: 'CAL-CARGO',
            categoria: 'Calças',
            tipo: 'variavel',
            variacoes: ['38', '40', '42', '44']
        },
        {
            nome: 'Jaqueta Jeans',
            descricao: 'Jeans premium, forro interno',
            preco: 249.90,
            precoCusto: 105.00,
            estoque: 30,
            estoqueMinimo: 8,
            sku: 'JAQ-JEANS',
            categoria: 'Jaquetas',
            tipo: 'variavel',
            variacoes: ['P', 'M', 'G']
        },
        {
            nome: 'Tênis Esportivo',
            descricao: 'Conforto e estilo para o dia a dia',
            preco: 299.90,
            precoCusto: 125.00,
            estoque: 40,
            estoqueMinimo: 10,
            sku: 'TEN-ESP',
            categoria: 'Calçados',
            tipo: 'variavel',
            variacoes: ['38', '39', '40', '41', '42']
        },
        {
            nome: 'Boné Aba Curva',
            descricao: 'Bordado premium, ajuste snapback',
            preco: 69.90,
            precoCusto: 28.00,
            estoque: 60,
            estoqueMinimo: 20,
            sku: 'BON-ABA',
            categoria: 'Acessórios',
            tipo: 'simples'
        },
        {
            nome: 'Meia Kit c/3',
            descricao: 'Kit com 3 pares, algodão antiodor',
            preco: 39.90,
            precoCusto: 16.00,
            estoque: 150,
            estoqueMinimo: 40,
            sku: 'MEI-KIT3',
            categoria: 'Acessórios',
            tipo: 'simples'
        }
    ]
}

export function gerarProdutos(tipoEmpresa: string): ProdutoTeste[] {
    const produtos = PRODUTOS_POR_TIPO[tipoEmpresa] || PRODUTOS_POR_TIPO['optica']
    return produtos.map((p, index) => ({
        ...p,
        sku: `${p.sku}-${Date.now()}-${index}`
    }))
}

export function getNomesProdutos(tipoEmpresa: string): string[] {
    const produtos = PRODUTOS_POR_TIPO[tipoEmpresa] || PRODUTOS_POR_TIPO['optica']
    return produtos.map(p => p.nome)
}

export const formatCurrency = (value: number | string): string => {
    const numberValue = Number(value)
    if (isNaN(numberValue)) return 'R$ 0,00'

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numberValue)
}

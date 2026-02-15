/**
 * Gerador de CPF válido
 */
export function generateCPF(): string {
    const rnd = (n: number) => Math.round(Math.random() * n)
    const mod = (dividend: number, divisor: number) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor))

    const n1 = rnd(9)
    const n2 = rnd(9)
    const n3 = rnd(9)
    const n4 = rnd(9)
    const n5 = rnd(9)
    const n6 = rnd(9)
    const n7 = rnd(9)
    const n8 = rnd(9)
    const n9 = rnd(9)

    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10
    d1 = 11 - (mod(d1, 11))
    if (d1 >= 10) d1 = 0

    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11
    d2 = 11 - (mod(d2, 11))
    if (d2 >= 10) d2 = 0

    return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`
}

/**
 * Gerador de CNPJ válido
 */
export function generateCNPJ(): string {
    const rnd = (n: number) => Math.round(Math.random() * n)
    const mod = (dividend: number, divisor: number) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor))

    const n1 = rnd(9)
    const n2 = rnd(9)
    const n3 = rnd(9)
    const n4 = rnd(9)
    const n5 = rnd(9)
    const n6 = rnd(9)
    const n7 = rnd(9)
    const n8 = rnd(9)
    const n9 = 0 // Invariável para matriz geralmente
    const n10 = 0 // Invariável
    const n11 = 0 // Invariável
    const n12 = 1 // Invariável

    let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5
    d1 = 11 - (mod(d1, 11))
    if (d1 >= 10) d1 = 0

    let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6
    d2 = 11 - (mod(d2, 11))
    if (d2 >= 10) d2 = 0

    return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`
}

/**
 * Gerador de Telefone Celular
 */
export function generatePhone(): string {
    const ddd = Math.floor(Math.random() * (99 - 11 + 1)) + 11
    const part1 = 90000 + Math.floor(Math.random() * 9999)
    const part2 = 1000 + Math.floor(Math.random() * 8999)

    return `(${ddd}) ${part1}-${part2}`
}

/**
 * Gera um email aleatório único
 */
export function generateEmail(): string {
    const timestamp = new Date().getTime()
    return `test.auto.${timestamp}@uniq.example.com`
}

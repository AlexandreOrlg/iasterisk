export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36) // Convertit le timestamp en base 36
  const randomPart = Math.random().toString(36).substr(2, 5) // 5 caractères aléatoires
  const uniquePart = `${timestamp}-${randomPart}`
  return prefix ? `${prefix}_${uniquePart}` : uniquePart
}

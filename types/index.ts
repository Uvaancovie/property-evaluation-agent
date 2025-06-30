export interface Property {
  id: number
  address: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  status?: string
  created_at?: string
  updated_at?: string
}

export interface EvaluationResult {
  id: number
  summary: string
  estimatedValue: number
  confidenceScore?: number
  property?: Property
}

export interface EvaluationRequest {
  address: string
  bedrooms?: number
  bathrooms?: number
  area?: number
}

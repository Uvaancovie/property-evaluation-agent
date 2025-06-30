import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Property } from "@/types"

const PROPERTY_EVALUATION_PROMPT = `You are a professional property evaluator with expertise in South African real estate markets. 

Analyze the following property and provide:
1. A comprehensive summary (80-120 words) highlighting key features, location benefits, and market positioning
2. An estimated market value in South African Rand (ZAR)
3. Key factors influencing the valuation

Property Details:
- Address: {address}
- Bedrooms: {bedrooms}
- Bathrooms: {bathrooms}
- Floor Area: {area} square meters

Consider these factors in your evaluation:
- Location and neighborhood characteristics
- Property size and layout efficiency
- Current South African property market trends
- Comparable sales in the area
- Property condition assumptions (assume good condition unless noted)

Format your response as JSON with the following structure:
{
  "summary": "detailed property summary",
  "estimatedValue": number (in ZAR),
  "confidenceScore": number (0.0 to 1.0),
  "keyFactors": ["factor1", "factor2", "factor3"]
}`

export async function evaluateProperty(property: Omit<Property, "id">): Promise<{
  summary: string
  estimatedValue: number
  confidenceScore: number
  keyFactors: string[]
}> {
  try {
    const prompt = PROPERTY_EVALUATION_PROMPT.replace("{address}", property.address || "Not specified")
      .replace("{bedrooms}", property.bedrooms?.toString() || "Not specified")
      .replace("{bathrooms}", property.bathrooms?.toString() || "Not specified")
      .replace("{area}", property.area?.toString() || "Not specified")

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.3,
    })

    // Parse the JSON response
    const evaluation = JSON.parse(text)

    return {
      summary: evaluation.summary,
      estimatedValue: evaluation.estimatedValue,
      confidenceScore: evaluation.confidenceScore || 0.8,
      keyFactors: evaluation.keyFactors || [],
    }
  } catch (error) {
    console.error("Error evaluating property:", error)

    // Fallback evaluation
    const baseValue = 800000 // Base value in ZAR
    const bedroomMultiplier = (property.bedrooms || 2) * 150000
    const bathroomMultiplier = (property.bathrooms || 1) * 80000
    const areaMultiplier = (property.area || 100) * 8000

    const estimatedValue = Math.round(baseValue + bedroomMultiplier + bathroomMultiplier + areaMultiplier)

    return {
      summary: `Property located at ${property.address} with ${property.bedrooms || "unspecified"} bedrooms, ${property.bathrooms || "unspecified"} bathrooms, and ${property.area || "unspecified"} square meters. This property offers good potential in the current market based on its specifications and location.`,
      estimatedValue,
      confidenceScore: 0.6,
      keyFactors: ["Location", "Size", "Market conditions"],
    }
  }
}

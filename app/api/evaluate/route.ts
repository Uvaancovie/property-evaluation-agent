import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { evaluateProperty } from "@/lib/property-evaluator"
import type { EvaluationRequest } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body: EvaluationRequest = await request.json()

    // Validate required fields
    if (!body.address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Evaluate the property using AI
    const evaluation = await evaluateProperty(body)

    // Store in database
    const supabase = createServerClient()

    // First, insert the property
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        address: body.address,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        area: body.area,
        status: "EVALUATED",
      })
      .select()
      .single()

    if (propertyError) {
      console.error("Error inserting property:", propertyError)
      return NextResponse.json({ error: "Failed to save property" }, { status: 500 })
    }

    // Then, insert the evaluation
    const { data: evaluationRecord, error: evaluationError } = await supabase
      .from("evaluations")
      .insert({
        property_id: property.id,
        summary: evaluation.summary,
        estimated_value: evaluation.estimatedValue,
        confidence_score: evaluation.confidenceScore,
      })
      .select()
      .single()

    if (evaluationError) {
      console.error("Error inserting evaluation:", evaluationError)
      return NextResponse.json({ error: "Failed to save evaluation" }, { status: 500 })
    }

    return NextResponse.json({
      id: property.id,
      summary: evaluation.summary,
      estimatedValue: evaluation.estimatedValue,
      confidenceScore: evaluation.confidenceScore,
      keyFactors: evaluation.keyFactors,
      property,
    })
  } catch (error) {
    console.error("Error in evaluate API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

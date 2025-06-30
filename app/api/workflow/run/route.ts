import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { evaluateProperty } from "@/lib/property-evaluator"

export async function POST() {
  try {
    const supabase = createServerClient()

    // Get all properties with status 'NEW'
    const { data: properties, error: fetchError } = await supabase
      .from("properties")
      .select("*")
      .eq("status", "NEW")
      .limit(10) // Process in batches

    if (fetchError) {
      console.error("Error fetching properties:", fetchError)
      return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
    }

    if (!properties || properties.length === 0) {
      return NextResponse.json({
        message: "No new properties to evaluate",
        processed: 0,
      })
    }

    const results = []

    // Process each property
    for (const property of properties) {
      try {
        const evaluation = await evaluateProperty(property)

        // Insert evaluation
        const { error: insertError } = await supabase.from("evaluations").insert({
          property_id: property.id,
          summary: evaluation.summary,
          estimated_value: evaluation.estimatedValue,
          confidence_score: evaluation.confidenceScore,
        })

        if (insertError) {
          console.error(`Error inserting evaluation for property ${property.id}:`, insertError)
          continue
        }

        // Update property status
        await supabase.from("properties").update({ status: "EVALUATED" }).eq("id", property.id)

        results.push({
          propertyId: property.id,
          address: property.address,
          estimatedValue: evaluation.estimatedValue,
        })
      } catch (error) {
        console.error(`Error processing property ${property.id}:`, error)
      }
    }

    // Send notification (if webhook URL is configured)
    if (process.env.SLACK_WEBHOOK_URL && results.length > 0) {
      try {
        const message = {
          text: `🏠 Property Evaluation Complete!\n${results
            .map((r) => `• ${r.address}: R${r.estimatedValue.toLocaleString()}`)
            .join("\n")}`,
        }

        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        })
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError)
      }
    }

    return NextResponse.json({
      message: "Workflow completed successfully",
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Error in workflow:", error)
    return NextResponse.json({ error: "Workflow failed" }, { status: 500 })
  }
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Home, MapPin, Bed, Bath, Square } from "lucide-react"
import type { EvaluationRequest, EvaluationResult } from "@/types"

export default function HomePage() {
  const [formData, setFormData] = useState<EvaluationRequest>({
    address: "",
    bedrooms: undefined,
    bathrooms: undefined,
    area: undefined,
  })
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to evaluate property")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EvaluationRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "address" ? value : value ? Number(value) : undefined,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Property Evaluator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered property valuations for South African real estate. Enter your property details below
            for a comprehensive market analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Evaluation Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Property Details
              </CardTitle>
              <CardDescription>Enter the property information for evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Property Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="e.g., 123 Oak Street, Cape Town, Western Cape"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      Bedrooms
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      max="20"
                      placeholder="3"
                      value={formData.bedrooms || ""}
                      onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      Bathrooms
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="2"
                      value={formData.bathrooms || ""}
                      onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area" className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      Area (m²)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      min="0"
                      placeholder="150"
                      value={formData.area || ""}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !formData.address.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating Property...
                    </>
                  ) : (
                    "Evaluate Property"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className="shadow-lg border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Evaluation Complete</CardTitle>
                  <CardDescription>AI-powered property valuation results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Estimated Value */}
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-800">R{result.estimatedValue.toLocaleString()}</div>
                    <div className="text-sm text-green-600 mt-1">Estimated Market Value</div>
                    {result.confidenceScore && (
                      <Badge variant="secondary" className="mt-2">
                        {Math.round(result.confidenceScore * 100)}% Confidence
                      </Badge>
                    )}
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="font-semibold mb-2">Property Analysis</h3>
                    <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                  </div>

                  {/* Key Factors */}
                  {result.keyFactors && result.keyFactors.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Key Valuation Factors</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.keyFactors.map((factor, index) => (
                          <Badge key={index} variant="outline">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Property Details */}
                  {result.property && (
                    <div className="text-xs text-gray-500 pt-4 border-t">
                      Property ID: {result.property.id} • Evaluated: {new Date().toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            {!result && !loading && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-800 mb-2">How it works</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• AI analyzes your property details</li>
                    <li>• Compares with market data</li>
                    <li>• Provides instant valuation</li>
                    <li>• Stores results for future reference</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

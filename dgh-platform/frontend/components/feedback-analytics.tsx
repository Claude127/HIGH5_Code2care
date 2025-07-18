"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"

export function FeedbackAnalytics() {
  const { t } = useLanguage()

  const feedbackThemes = [
    { theme: t("theme.wait_time"), count: 234, sentiment: "negative", percentage: 65 },
    { theme: t("theme.service_quality"), count: 189, sentiment: "positive", percentage: 78 },
    { theme: t("theme.medical_staff"), count: 156, sentiment: "positive", percentage: 82 },
    { theme: t("theme.cleanliness"), count: 98, sentiment: "neutral", percentage: 45 },
    { theme: t("theme.equipment"), count: 87, sentiment: "positive", percentage: 71 },
  ]

  const sentimentData = [
    { label: t("dashboard.positive"), count: 687, percentage: 55, color: "bg-green-500" },
    { label: t("dashboard.neutral"), count: 312, percentage: 25, color: "bg-yellow-500" },
    { label: t("dashboard.negative"), count: 248, percentage: 20, color: "bg-red-500" },
  ]

  const languageDistribution = [
    { language: t("lang.french"), count: 456, percentage: 37 },
    { language: t("lang.english"), count: 389, percentage: 31 },
    { language: t("lang.duala"), count: 234, percentage: 19 },
    { language: t("lang.bassa"), count: 98, percentage: 8 },
    { language: t("lang.ewondo"), count: 70, percentage: 5 },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-red-500 rounded-full"></div>
            {t("dashboard.sentiment_analysis")}
          </CardTitle>
          <CardDescription>{t("dashboard.automatic_classification")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sentimentData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  {item.label}
                </span>
                <span className="font-medium">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.recurring_themes")}</CardTitle>
          <CardDescription>{t("dashboard.most_mentioned")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedbackThemes.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-white/20 rounded-lg bg-white/40 dark:bg-gray-700/40"
            >
              <div className="space-y-1">
                <div className="font-medium">{item.theme}</div>
                <div className="text-sm text-muted-foreground">
                  {item.count} {t("dashboard.mentions")}
                </div>
              </div>
              <Badge
                variant={
                  item.sentiment === "positive"
                    ? "default"
                    : item.sentiment === "negative"
                      ? "destructive"
                      : "secondary"
                }
              >
                {item.sentiment === "positive"
                  ? t("dashboard.positive")
                  : item.sentiment === "negative"
                    ? t("dashboard.negative")
                    : t("dashboard.neutral")}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.language_distribution")}</CardTitle>
          <CardDescription>{t("dashboard.languages_used")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {languageDistribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.language}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{item.count}</span>
                <div className="w-16">
                  <Progress value={item.percentage} className="h-2" />
                </div>
                <span className="text-sm font-medium w-8">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

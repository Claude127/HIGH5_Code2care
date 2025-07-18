"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const languages = [
  { code: "en" as const, name: "English", flag: "🇺🇸" },
  { code: "fr" as const, name: "Français", flag: "🇫🇷" },
  { code: "duala" as const, name: "Duala", flag: "🇨🇲" },
  { code: "bassa" as const, name: "Bassa", flag: "🇨🇲" },
  { code: "ewondo" as const, name: "Ewondo", flag: "🇨🇲" },
]

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()
  const selectedLanguage = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:bg-white/90 dark:hover:bg-gray-800/90"
        >
          <Globe className="h-4 w-4" />
          {selectedLanguage.flag} {selectedLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <span className="flex items-center gap-2">
              {lang.flag} {lang.name}
            </span>
            {language === lang.code && <Check className="h-4 w-4 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

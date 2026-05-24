import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/shared/i18n'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = i18n.language

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('common.changeLanguage')}
          title={t('common.language')}
        >
          <Languages className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((lng: SupportedLanguage) => (
          <DropdownMenuItem
            key={lng}
            onSelect={() => {
              void i18n.changeLanguage(lng)
            }}
            data-active={current === lng || undefined}
            className="justify-between"
          >
            <span>{t(`languages.${lng}`)}</span>
            {current === lng ? (
              <span aria-hidden className="text-xs text-zinc-500">
                ●
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

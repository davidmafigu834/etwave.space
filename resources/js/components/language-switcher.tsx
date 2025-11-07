import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { hasRole } from '@/utils/authorization';
import languageData from '@/../../resources/lang/language.json';

interface Language {
    code: string;
    name: string;
    countryCode: string;
}

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const { auth } = usePage().props as any;
    const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);

    const isAuthenticated = !!auth?.user;
    const userRoles = auth?.user?.roles?.map((role: any) => role.name) || [];
    const isSuperAdmin = isAuthenticated && hasRole('superadmin', userRoles);

    // Sync current language state with i18n
    useEffect(() => {
        const lang =
            languageData.find((l) => l.code === i18n.language) ||
            languageData[0];
        setCurrentLanguage(lang);
    }, [i18n.language]);
    const handleLanguageChange = (languageCode: string) => {
        if (languageCode === 'manage_languages') {
            router.get(route('manage-language'), { lang: i18n.language });
            return;
        }
        i18n.changeLanguage(languageCode);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-8 rounded-md">
                    <Globe className="h-4 w-4" />
                    {currentLanguage && (
                        <>
                            <span className="text-sm font-medium hidden md:inline-block">
                                {currentLanguage.name}
                            </span>
                            <ReactCountryFlag
                                countryCode={currentLanguage.countryCode}
                                svg
                                style={{ width: '1.2em', height: '1.2em' }}
                            />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                    {languageData.map((language: Language) => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className="flex items-center gap-2"
                        >
                            <ReactCountryFlag
                                countryCode={language.countryCode}
                                svg
                                style={{ width: '1.2em', height: '1.2em' }}
                            />
                            <span>{language.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                {isSuperAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleLanguageChange('manage_languages')}
                            className="justify-center text-primary font-semibold cursor-pointer"
                        >
                            Manage Languages
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

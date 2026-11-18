export function getJudge0LanguageId(
  language: string,
): number | undefined {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
    C: 50,
    CPP: 54,
    GO: 60,
  };

  return languageMap[language.toUpperCase()];
}

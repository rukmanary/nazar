const commonPatterns = process.env.EXPO_PUBLIC_COMMON_PATTERNS
  ? process.env.EXPO_PUBLIC_COMMON_PATTERNS.split(",")
  : [];

type PasswordStrength = {
  password: string;
  hasLowercase: boolean | undefined;
  hasUppercase: boolean | undefined;
  hasNumbers: boolean | undefined;
  hasSymbols: boolean | undefined;
};

type Level = "Weak" | "Medium" | "Strong" | undefined;

type ReturnType = {
  percentage: number;
  level: Level;
  hasCommonPatterns: boolean;
};

const calculatePasswordStrength = ({
  password,
  hasLowercase,
  hasUppercase,
  hasNumbers,
  hasSymbols,
}: PasswordStrength): ReturnType => {
  let score = 0;
  const maxScore = 6; // Total skor maksimal
  let hasCommonPatterns = false;

  if (password.length >= 8 && password.length <= 12) score += 1;
  if (password.length > 12) score += 2;

  if (hasLowercase) score += 1;
  if (hasUppercase) score += 1;
  if (hasNumbers) score += 1;
  if (hasSymbols) score += 1;

  if (
    commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))
  ) {
    score -= 2; // Penalti untuk pola umum
    hasCommonPatterns = true;
  }

  // Persentase kekuatan password
  const strengthPercentage = Math.max((score / maxScore) * 100, 0);

  // Level kekuatan password
  let strengthLevel: Level = "Weak";
  if (strengthPercentage > 40 && strengthPercentage <= 70) {
    strengthLevel = "Medium";
  } else if (strengthPercentage > 70) {
    strengthLevel = "Strong";
  }

  return {
    percentage: strengthPercentage,
    level: strengthLevel,
    hasCommonPatterns,
  };
};

export { calculatePasswordStrength };

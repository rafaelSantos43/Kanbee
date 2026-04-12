import { useTranslation } from "react-i18next";
import { Text, TextProps } from "react-native";

interface KTextPrps extends TextProps {
  variant?: "h1" | "h2" | "body" | "caption" | "label";
  label?: string;
  tx?: string;
}

export const KText = ({ label, tx, variant = "body", ...props }: KTextPrps) => {
  const { t } = useTranslation();
  const variants = {
    h1: "text-3xl font-bold tracking-tight",
    h2: "text-xl font-semibold tracking-tighter",
    body: "text-xs font-normal tracking-normal text-neutral-600 dark:text-neutral-400",
    caption: "text-xxs font-bold uppercase tracking-[0.2em] opacity-40",
    label: "text-base font-semibold tracking-tight",
  };
  return (
    <Text
      className={`text-black  dark:text-neutral-200 ${variants[variant]}`}
      {...props}
    >
      {label && label}
      {tx && t(tx)}
    </Text>
  );
};

interface FooterProps {
  text?: string;
  branch?: "SP" | "PE" | "ES";
}

export default function Footer({ text,  branch, }: FooterProps) {
  return (
    <div >
    <footer className="border-t h-14 border-gray-500 dark:border-gray-700 py-4 text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} • {text ?? "Dashboard de Ocorrências"} •  Filial {branch}
      </p>
    </footer>
    </div>
  );
}

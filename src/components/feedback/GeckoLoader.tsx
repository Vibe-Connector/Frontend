interface GeckoLoaderProps {
  inline?: boolean;
}

export default function GeckoLoader({ inline = false }: GeckoLoaderProps) {
  return (
    <div className={
      inline
        ? "flex flex-col items-center justify-center w-full h-full min-h-[400px]"
        : "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
    }>
      <div className="relative w-64 h-64">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          style={{ animation: 'gecko-orbit 3s linear infinite' }}
        >
          <svg
            width="50"
            height="62"
            viewBox="0 0 124 152"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: 'translateY(-80px) rotate(90deg)' }}
          >
            <rect x="24" width="4" height="4" fill="#F1863B"/>
            <rect x="28" width="4" height="4" fill="#F1863B"/>
            <rect x="32" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="4" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="4" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="4" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="4" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="8" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="8" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="8" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="8" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="8" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="8" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="12" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="16" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="20" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="24" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="28" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="32" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="32" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="32" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="32" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="32" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="32" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="36" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="40" width="4" height="4" fill="#F1863B"/>
            <rect x="4" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="12" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="44" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="44" width="4" height="4" fill="#F1863B"/>
            <rect y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="4" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="8" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="12" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="48" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="48" width="4" height="4" fill="#F1863B"/>
            <rect y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="4" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="8" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="12" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="16" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="24" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="52" width="4" height="4" fill="#F1863B"/>
            <rect x="4" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="8" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="12" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="16" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="20" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="56" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="56" width="4" height="4" fill="#F1863B"/>
            <rect y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="4" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="8" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="12" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="60" width="4" height="4" fill="#F1863B"/>
            <rect x="12" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="64" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="68" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="84" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="88" y="72" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="84" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="88" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="92" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="96" y="76" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="84" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="88" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="92" y="80" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="84" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="88" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="92" y="84" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="88" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="92" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="96" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="100" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="104" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="52" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="56" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="108" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="60" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="112" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="116" width="4" height="4" fill="#F1863B"/>
            <rect x="28" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="64" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="120" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="124" width="4" height="4" fill="#F1863B"/>
            <rect x="32" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="40" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="44" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="48" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="68" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="120" y="128" width="4" height="4" fill="#F1863B"/>
            <rect x="36" y="132" width="4" height="4" fill="#F1863B"/>
            <rect x="72" y="132" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="132" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="132" width="4" height="4" fill="#F1863B"/>
            <rect x="120" y="132" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="136" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="136" width="4" height="4" fill="#F1863B"/>
            <rect x="116" y="136" width="4" height="4" fill="#F1863B"/>
            <rect x="120" y="136" width="4" height="4" fill="#F1863B"/>
            <rect x="76" y="140" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="140" width="4" height="4" fill="#F1863B"/>
            <rect x="84" y="140" width="4" height="4" fill="#F1863B"/>
            <rect x="112" y="140" width="4" height="4" fill="#F1863B"/>
            <rect x="116" y="140" width="4" height="4" fill="#F1863B"/>
            <rect x="80" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="84" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="88" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="92" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="96" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="100" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="104" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="108" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="112" y="144" width="4" height="4" fill="#F1863B"/>
            <rect x="88" y="148" width="4" height="4" fill="#F1863B"/>
            <rect x="92" y="148" width="4" height="4" fill="#F1863B"/>
            <rect x="96" y="148" width="4" height="4" fill="#F1863B"/>
            <rect x="100" y="148" width="4" height="4" fill="#F1863B"/>
            <rect x="104" y="148" width="4" height="4" fill="#F1863B"/>
            <rect x="108" y="148" width="4" height="4" fill="#F1863B"/>
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes gecko-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p className="mt-4 text-accent font-medium text-lg animate-pulse">
        Loading...
      </p>
    </div>
  );
}

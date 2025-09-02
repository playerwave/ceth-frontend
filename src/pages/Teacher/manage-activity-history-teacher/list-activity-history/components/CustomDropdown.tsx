import React from "react";

type Opt = { label: string; value: string | number };

interface Props {
  placeholder?: string;
  value?: string | number | null;
  onChange: (v: string | number | null) => void;
  options: Opt[];
  className?: string;       // ใช้กำหนดความกว้าง ฯลฯ
}

const CustomDropdown: React.FC<Props> = ({
  placeholder = "เลือก",
  value = null,
  onChange,
  options,
  className = "min-w-[140px]",
}) => {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find(o => String(o.value) === String(value));

  // ปิดเมื่อคลิกข้างนอก
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!popRef.current || !btnRef.current) return;
      if (
        popRef.current.contains(e.target as Node) ||
        btnRef.current.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ปิดด้วย Esc
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        type="button"
        data-cy="custom-dropdown-button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-2 rounded text-sm bg-[#1E3A8A] text-white border border-white font-semibold
                   text-center hover:brightness-90 focus:outline-none"
      >
        {selected ? selected.label : placeholder}
      </button>

      {open && (
        <div
          ref={popRef}
          data-cy="custom-dropdown-menu"
          className="absolute top-[calc(100%+8px)] right-0 z-[1000] w-full bg-[#1E3A8A] text-white rounded-lg shadow-lg ring-1 ring-white/20 overflow-hidden"
        >
          <div className="max-h-150 overflow-auto py-1">
            {/* รายการ “ล้างค่า” */}
            <button
            data-cy="custom-dropdown-clear"
              className="w-full text-left px-4 py-2 text-sm bg-[#14306d] hover:bg-[#2349a6] transition"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              — ล้างค่า —
            </button>

            {options.map(opt => (
              <button
                key={String(opt.value)}
                data-cy={`custom-dropdown-item-${opt.value}`}
                className={`w-full text-left px-4 py-2 text-sm transition 
                  ${String(opt.value) === String(value)
                    ? "bg-[#2349a6]"
                    : "bg-[#1E3A8A] hover:bg-[#2349a6]"}`
                }
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

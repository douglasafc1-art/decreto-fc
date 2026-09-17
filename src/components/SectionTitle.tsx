interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ eyebrow, title, align = 'left' }: SectionTitleProps) {
  return (
    <div className={`relative ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && (
        <span className="relative font-script text-decreto-cyan text-xl md:text-2xl block mb-1 drop-shadow-[0_0_14px_rgba(62,216,240,0.25)]">
          {eyebrow}
        </span>
      )}
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

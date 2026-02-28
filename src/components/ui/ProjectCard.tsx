import Image from "next/image";

interface ProjectCardProps {
  title: string;
  company: string;
  category: string;
  result: string;
  tags: string[];
  imageSeed: number;
}

export default function ProjectCard({
  title,
  company,
  category,
  result,
  tags,
  imageSeed,
}: ProjectCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1">
      {/* Görsel */}
      <div className="relative h-52 overflow-hidden bg-surface-secondary">
        <Image
          src={`https://picsum.photos/seed/${imageSeed}/800/600`}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Sonuç rozeti - Yeşil/Başarı rengi */}
        <div className="absolute top-4 right-4 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-md z-10">
          {result}
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* İçerik */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[1px] text-orange">
              {company}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] sm:text-xs font-medium text-ink-muted">
              {category}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-ink leading-tight group-hover:text-accent transition-colors duration-200">
            {title}
          </h3>
        </div>

        {/* Tag'ler */}
        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-secondary px-2.5 py-1 text-[10px] font-bold text-ink-muted border border-border-light group-hover:border-accent/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export interface ProjectMetric {
  value: string;
  labelTR: string;
  labelEN: string;
}

export interface Project {
  id: string;
  titleTR: string;
  titleEN: string;
  company: string;
  categoryTR: string;
  categoryEN: string;
  resultTR: string;
  resultEN: string;
  tags: string[];
  imageSeed: number;
  logo?: string;
  problemTR: string;
  problemEN: string;
  solutionTR: string;
  solutionEN: string;
  metrics: ProjectMetric[];
}

// Vaka çalışmaları artık Supabase'de saklanır.
// Veri /api/vaka-calismalari endpoint'i üzerinden okunur ve studyo admin
// panelindeki "Vaka Çalışmaları" aracından düzenlenir.

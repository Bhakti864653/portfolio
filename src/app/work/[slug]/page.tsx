import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy";
import { PROJECTS, projectBySlug } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  const title = `${project.name}: ${project.tagline}`;
  return {
    title,
    description: project.intro,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.intro,
      images: [
        {
          url: project.screenshot.src,
          width: 1440,
          height: 900,
          alt: project.screenshot.alt,
        },
      ],
    },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}

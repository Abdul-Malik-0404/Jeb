import { TailoredResume, ResumeBlock } from '../data/mockData';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ResumeViewerProps {
  resume: TailoredResume;
}

export function ResumeViewer({ resume }: ResumeViewerProps) {
  const sortedBlocks = [...resume.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 bg-white text-black p-8 rounded-lg shadow-sm">
      {sortedBlocks.map((block) => (
        <ResumeBlockView key={block.id} block={block} />
      ))}
    </div>
  );
}

function ResumeBlockView({ block }: { block: ResumeBlock }) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-2 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold">{block.content.name}</h1>
          <p className="text-lg text-gray-700">{block.content.title}</p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {block.content.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {block.content.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {block.content.location}
            </span>
            {block.content.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {block.content.website}
              </span>
            )}
            {block.content.linkedIn && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                {block.content.linkedIn}
              </span>
            )}
          </div>
        </div>
      );

    case 'summary':
      return (
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{block.content.text}</p>
        </div>
      );

    case 'experience':
      return (
        <div className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-300 pb-1">
            Experience
          </h2>
          {block.content.positions.map((position: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{position.title}</h3>
                  <p className="text-gray-700">{position.company}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{position.period}</p>
                  <p>{position.location}</p>
                </div>
              </div>
              <ul className="space-y-1 ml-4">
                {position.achievements.map((achievement: string, idx: number) => (
                  <li key={idx} className="text-gray-700 text-sm leading-relaxed">
                    • {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'skills':
      return (
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="space-y-2">
            {block.content.categories.map((category: any, index: number) => (
              <div key={index}>
                <span className="font-bold text-sm">{category.name}: </span>
                <span className="text-gray-700 text-sm">{category.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'projects':
      return (
        <div className="space-y-3">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-300 pb-1">
            Projects
          </h2>
          {block.content.projects.map((project: any, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{project.name}</h3>
                {project.link && (
                  <span className="text-sm text-gray-600">{project.link}</span>
                )}
              </div>
              <p className="text-gray-700 text-sm">{project.description}</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Technologies: </span>
                {project.technologies.join(', ')}
              </p>
            </div>
          ))}
        </div>
      );

    case 'education':
      return (
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>
          {block.content.degrees.map((degree: any, index: number) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{degree.degree}</h3>
                <p className="text-gray-700">{degree.school}</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>{degree.year}</p>
                <p>{degree.location}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'certifications':
      return (
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wide border-b border-gray-300 pb-1">
            Certifications
          </h2>
          <ul className="space-y-1">
            {block.content.items?.map((item: string, index: number) => (
              <li key={index} className="text-gray-700">• {item}</li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

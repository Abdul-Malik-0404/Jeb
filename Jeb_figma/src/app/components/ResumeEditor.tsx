import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TailoredResume, ResumeBlock } from '../data/mockData';
import { GripVertical } from 'lucide-react';

interface ResumeEditorProps {
  resume: TailoredResume;
}

export function ResumeEditor({ resume }: ResumeEditorProps) {
  const [blocks, setBlocks] = useState(
    [...resume.blocks].sort((a, b) => a.order - b.order)
  );

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, removed);
    setBlocks(newBlocks.map((block, index) => ({ ...block, order: index })));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-4">
          Drag and drop blocks to rearrange your resume
        </div>
        {blocks.map((block, index) => (
          <DraggableResumeBlock
            key={block.id}
            block={block}
            index={index}
            moveBlock={moveBlock}
          />
        ))}
      </div>
    </DndProvider>
  );
}

interface DraggableBlockProps {
  block: ResumeBlock;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableResumeBlock({ block, index, moveBlock }: DraggableBlockProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'resume-block',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'resume-block',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`bg-white border-2 border-gray-200 rounded-lg p-4 transition-all ${
        isDragging ? 'opacity-50 border-primary' : 'hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          ref={drag}
          className="cursor-move p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <ResumeBlockPreview block={block} />
        </div>
      </div>
    </div>
  );
}

function ResumeBlockPreview({ block }: { block: ResumeBlock }) {
  const getBlockTitle = () => {
    switch (block.type) {
      case 'header': return 'Header';
      case 'summary': return 'Professional Summary';
      case 'experience': return 'Experience';
      case 'skills': return 'Skills';
      case 'projects': return 'Projects';
      case 'education': return 'Education';
      case 'certifications': return 'Certifications';
      default: return 'Block';
    }
  };

  const getBlockContent = () => {
    switch (block.type) {
      case 'header':
        return `${block.content.name} • ${block.content.title}`;
      case 'summary':
        return block.content.text.substring(0, 100) + '...';
      case 'experience':
        return `${block.content.positions.length} position(s)`;
      case 'skills':
        return `${block.content.categories.length} skill categories`;
      case 'projects':
        return `${block.content.projects.length} project(s)`;
      case 'education':
        return `${block.content.degrees.length} degree(s)`;
      case 'certifications':
        return `${block.content.items?.length || 0} certification(s)`;
      default:
        return '';
    }
  };

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{getBlockTitle()}</h4>
      <p className="text-sm text-gray-600">{getBlockContent()}</p>
    </div>
  );
}

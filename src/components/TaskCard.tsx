import React from 'react';
import { Task, Status, Priority, Category } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, MoreVertical, AlertCircle, Briefcase, Heart, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  isReadOnly: boolean;
  key?: React.Key;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

const categoryIcons = {
  work: <Briefcase size={14} />,
  personal: <User size={14} />,
  health: <Heart size={14} />,
};

export default function TaskCard({ task, onToggleStatus, onEdit, isReadOnly }: TaskCardProps): React.JSX.Element {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" size={24} />;
      case 'in-progress':
        return <Clock className="text-[#2a6df4]" size={24} />;
      default:
        return <Circle className="text-gray-300" size={24} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group transition-all",
        task.status === 'completed' && "opacity-75"
      )}
    >
      <button
        disabled={isReadOnly}
        onClick={() => onToggleStatus(task.id)}
        className={cn(
          "flex-shrink-0 transition-transform active:scale-90",
          isReadOnly && "cursor-not-allowed"
        )}
      >
        {getStatusIcon()}
      </button>

      <div className="flex-grow min-w-0" onClick={() => !isReadOnly && onEdit(task)}>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>
          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
            {categoryIcons[task.category]}
            {task.category}
          </span>
          {task.time && (
            <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1 ml-auto">
              <Clock size={10} />
              {task.time}
            </span>
          )}
        </div>
        <h3 className={cn(
          "text-sm font-semibold text-[#14181f] truncate",
          task.status === 'completed' && "line-through text-gray-400"
        )}>
          {task.title}
        </h3>
        {task.notes && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.notes}</p>
        )}
      </div>

      {!isReadOnly && (
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical size={18} />
        </button>
      )}
    </motion.div>
  );
}

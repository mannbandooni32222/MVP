import { Task, Priority, Category } from '../types';

/**
 * Simple regex-based parser for brain dump text.
 * Example: "Gym at 6am high priority, call mom 5pm work"
 */
export function parseBrainDump(text: string, date: string): Task[] {
  // Split by comma or newline
  const lines = text.split(/[,\n]/).filter(line => line.trim().length > 0);
  
  return lines.map(line => {
    const raw = line.trim().toLowerCase();
    
    // Extract Time (e.g., 6am, 5:30 pm, 5.30 am, 6.25 pm)
    const timeRegex = /(\d{1,2}([:.]\d{2})?\s*(am|pm))/gi;
    const timeMatch = raw.match(timeRegex);
    const time = timeMatch ? timeMatch[0] : undefined;
    
    // Extract Priority
    let priority: Priority = 'medium';
    if (raw.includes('high')) priority = 'high';
    else if (raw.includes('low')) priority = 'low';
    
    // Extract Category
    let category: Category = 'personal';
    if (raw.includes('work')) category = 'work';
    else if (raw.includes('health') || raw.includes('gym')) category = 'health';
    
    // Clean Title: Remove the extracted time, priority, and category keywords
    let title = line.trim();
    if (time) title = title.replace(new RegExp(time, 'gi'), '');
    title = title
      .replace(/high priority|medium priority|low priority/gi, '')
      .replace(/\b(high|medium|low|work|personal|health|gym)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Fallback if title becomes empty
    if (!title) title = line.trim();

    return {
      id: Math.random().toString(36).substr(2, 9),
      title,
      time,
      priority,
      category,
      status: 'pending',
      date,
    };
  });
}

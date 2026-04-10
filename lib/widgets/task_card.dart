import 'package:flutter/material.dart';
import '../models/task.dart';

class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback onToggle;
  final VoidCallback onEdit;
  final bool isReadOnly;

  const TaskCard({
    super.key,
    required this.task,
    required this.onToggle,
    required this.onEdit,
    required this.isReadOnly,
  });

  @override
  Widget build(BuildContext context) {
    final priorityColor = _getPriorityColor(task.priority);

    return Opacity(
      opacity: task.status == TaskStatus.completed ? 0.6 : 1.0,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey[100]!),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          children: [
            GestureDetector(
              onTap: isReadOnly ? null : onToggle,
              child: Icon(
                task.status == TaskStatus.completed 
                  ? Icons.check_circle 
                  : task.status == TaskStatus.inProgress 
                    ? Icons.pending 
                    : Icons.circle_outlined,
                color: task.status == TaskStatus.completed 
                  ? Colors.green 
                  : const Color(0xFF2A6DF4),
                size: 28,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: InkWell(
                onTap: isReadOnly ? null : onEdit,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: priorityColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            task.priority.name.toUpperCase(),
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: priorityColor),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          task.category.name,
                          style: TextStyle(fontSize: 10, color: Colors.grey[400], fontWeight: FontWeight.bold),
                        ),
                        if (task.time != null) ...[
                          const Spacer(),
                          Icon(Icons.access_time, size: 12, color: Colors.grey[400]),
                          const SizedBox(width: 4),
                          Text(task.time!, style: TextStyle(fontSize: 10, color: Colors.grey[400])),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      task.title,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        decoration: task.status == TaskStatus.completed ? TextDecoration.lineThrough : null,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getPriorityColor(Priority p) {
    switch (p) {
      case Priority.high: return Colors.redAccent;
      case Priority.medium: return Colors.orangeAccent;
      case Priority.low: return Colors.blueAccent;
    }
  }
}

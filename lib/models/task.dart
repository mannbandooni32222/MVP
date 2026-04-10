import 'dart:convert';

enum Priority { low, medium, high }
enum Category { work, personal, health }
enum TaskStatus { pending, inProgress, completed }

class Task {
  final String id;
  String title;
  String? time;
  Priority priority;
  Category category;
  TaskStatus status;
  DateTime date;
  String? notes;

  Task({
    required this.id,
    required this.title,
    this.time,
    this.priority = Priority.medium,
    this.category = Category.personal,
    this.status = TaskStatus.pending,
    required this.date,
    this.notes,
  });

  // Convert Task to JSON for storage
  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'time': time,
    'priority': priority.index,
    'category': category.index,
    'status': status.index,
    'date': date.toIso8601String(),
    'notes': notes,
  };

  // Create Task from JSON
  factory Task.fromJson(Map<String, dynamic> json) => Task(
    id: json['id'],
    title: json['title'],
    time: json['time'],
    priority: Priority.values[json['priority']],
    category: Category.values[json['category']],
    status: TaskStatus.values[json['status']],
    date: DateTime.parse(json['date']),
    notes: json['notes'],
  );
}

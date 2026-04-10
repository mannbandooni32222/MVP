import '../models/task.dart';
import 'package:uuid/uuid.dart';

class TaskParser {
  static List<Task> parseBrainDump(String text, DateTime date) {
    // Split by comma or new lines
    final lines = text.split(RegExp(r'[,\n]')).where((l) => l.trim().isNotEmpty);
    const uuid = Uuid();

    return lines.map((line) {
      String raw = line.trim().toLowerCase();
      
      // 1. Extract Time (Regex: 6am, 5:30 pm, 5.30 am, 6.25 pm)
      final timeRegex = RegExp(r'(\d{1,2}([:.]\d{2})?\s*(am|pm))');
      final timeMatch = timeRegex.firstMatch(raw);
      String? time = timeMatch?.group(0);

      // 2. Extract Priority
      Priority priority = Priority.medium;
      if (raw.contains('high')) priority = Priority.high;
      else if (raw.contains('low')) priority = Priority.low;

      // 3. Extract Category
      Category category = Category.personal;
      if (raw.contains('work')) category = Category.work;
      else if (raw.contains('health') || raw.contains('gym')) category = Category.health;

      // 4. Clean Title (Remove keywords and time from the original line)
      String title = line.trim();
      if (time != null) title = title.replaceAll(time, '');
      
      title = title
        .replaceAll(RegExp(r'\b(high|medium|low|priority|work|personal|health|gym)\b', caseSensitive: false), '')
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();

      if (title.isEmpty) title = line.trim();

      return Task(
        id: uuid.v4(),
        title: title,
        time: time,
        priority: priority,
        category: category,
        date: date,
      );
    }).toList();
  }
}

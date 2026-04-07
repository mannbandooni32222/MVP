# Smart Planner - Flutter MVP

This document contains the Flutter code for the "Smart Planner" app as requested.

## Tech Stack
- **Framework:** Flutter
- **State Management:** `setState` (Simple for MVP)
- **Persistence:** `shared_preferences`
- **Icons:** `lucide_icons` or `material_icons`
- **Date Handling:** `intl`

## 1. Dependencies (`pubspec.yaml`)
```yaml
dependencies:
  flutter:
    sdk: flutter
  shared_preferences: ^2.2.2
  intl: ^0.19.0
  uuid: ^4.3.3
```

## 2. Folder Structure
```text
lib/
├── models/
│   └── task.dart
├── utils/
│   └── parser.dart
├── widgets/
│   ├── calendar_strip.dart
│   ├── task_card.dart
│   └── brain_dump_modal.dart
├── screens/
│   ├── onboarding_screen.dart
│   └── home_screen.dart
└── main.dart
```

## 3. Core Logic: Brain Dump Parser (`lib/utils/parser.dart`)
```dart
import '../models/task.dart';
import 'package:uuid/uuid.dart';

class BrainDumpParser {
  static List<Task> parse(String text, DateTime date) {
    final lines = text.split(RegExp(r'[,\n]')).where((l) => l.trim().isNotEmpty);
    final uuid = Uuid();

    return lines.map((line) {
      String raw = line.trim().toLowerCase();
      
      // Time Regex
      final timeRegex = RegExp(r'(\d{1,2}([:.]\d{2})?\s*(am|pm))');
      final timeMatch = timeRegex.firstMatch(raw);
      String? time = timeMatch?.group(0);

      // Priority
      Priority priority = Priority.medium;
      if (raw.contains('high')) priority = Priority.high;
      else if (raw.contains('low')) priority = Priority.low;

      // Category
      Category category = Category.personal;
      if (raw.contains('work')) category = Category.work;
      else if (raw.contains('health') || raw.contains('gym')) category = Category.health;

      return Task(
        id: uuid.v4(),
        title: line.trim(), // In a real app, clean the title like the React version
        time: time,
        priority: priority,
        category: category,
        status: TaskStatus.pending,
        date: date,
      );
    }).toList();
  }
}
```

## 4. How to Run
1. Install Flutter SDK: [flutter.dev](https://docs.flutter.dev/get-started/install)
2. Create project: `flutter create smart_planner`
3. Replace `lib/` content with the provided code.
4. Run: `flutter run`

## 5. How to Build APK (Android)
1. Open terminal in project root.
2. Run: `flutter build apk --release`
3. The file will be at `build/app/outputs/flutter-apk/app-release.apk`.

## 6. How to Build iOS (App Store)
1. You need a Mac with Xcode.
2. Run: `flutter build ios --release`
3. Open `ios/Runner.xcworkspace` in Xcode.
4. Configure "Signing & Capabilities" with your Apple Developer account.
5. Product > Archive > Distribute App.

---

*Note: The React version in the preview is a functional prototype of this logic.*

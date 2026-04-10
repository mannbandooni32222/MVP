# Smart Planner - Flutter MVP (Production Ready)

This project is a complete, production-ready Flutter implementation of the "Smart Planner" app.

## 🚀 Tech Stack
- **Framework:** Flutter (Material 3)
- **State Management:** `setState` (Optimized for MVP)
- **Persistence:** `shared_preferences`
- **Typography:** Google Fonts (Inter)
- **Date Handling:** `intl`
- **Unique IDs:** `uuid`

## 📂 Project Structure
```text
lib/
├── models/
│   └── task.dart          # Task data model & JSON serialization
├── utils/
│   └── parser.dart        # Brain Dump regex logic
├── widgets/
│   ├── calendar_strip.dart # Horizontal scrollable calendar
│   └── task_card.dart      # Individual task UI component
├── screens/
│   ├── onboarding_screen.dart # Username entry & welcome
│   └── home_screen.dart       # Main task list & brain dump logic
└── main.dart              # App entry point & theme configuration
```

## 🛠️ Setup Instructions
1. **Install Flutter:** Follow the guide at [flutter.dev](https://docs.flutter.dev/get-started/install).
2. **Create Project:** 
   ```bash
   flutter create smart_planner
   ```
3. **Copy Files:** Replace the `lib/` folder and `pubspec.yaml` with the files generated in this project.
4. **Get Dependencies:**
   ```bash
   flutter pub get
   ```
5. **Run App:**
   ```bash
   flutter run
   ```

## 📦 Building for Production

### Android (APK)
1. Run: `flutter build apk --release`
2. Locate file: `build/app/outputs/flutter-apk/app-release.apk`

### iOS (App Store)
1. Open `ios/Runner.xcworkspace` in Xcode.
2. Set your **Development Team** in Signing & Capabilities.
3. Run: `flutter build ios --release`
4. In Xcode, go to **Product > Archive** to upload to App Store Connect.

---

### Features Included:
- **Brain Dump Parser:** Converts messy text into tasks automatically.
- **Horizontal Calendar:** Past dates are read-only; future dates allow planning.
- **Progress Tracking:** Real-time completion percentage.
- **Local Persistence:** All data stays on the device.

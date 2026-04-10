import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';
import 'screens/onboarding_screen.dart';
import 'services/storage_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartPlannerApp());
}

class SmartPlannerApp extends StatelessWidget {
  const SmartPlannerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Smart Planner',
      theme: ThemeData(
        primaryColor: const Color(0xFF2A6DF4),
        scaffoldBackgroundColor: const Color(0xFFF7F7F7),
        textTheme: GoogleFonts.interTextTheme(),
        useMaterial3: true,
      ),
      home: const MainWrapper(),
    );
  }
}

class MainWrapper extends StatefulWidget {
  const MainWrapper({super.key});

  @override
  State<MainWrapper> createState() => _MainWrapperState();
}

class _MainWrapperState extends State<MainWrapper> {
  final StorageService _storage = StorageService();
  String? _username;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _checkUser();
  }

  Future<void> _checkUser() async {
    final name = await _storage.getUsername();
    setState(() {
      _username = name;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF2A6DF4)),
        ),
      );
    }

    if (_username == null) {
      return OnboardingScreen(
        onComplete: () => setState(() => _checkUser()),
      );
    }

    return const HomeScreen();
  }
}

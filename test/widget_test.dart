import 'package:flutter_test/flutter_test.dart';
import 'package:smart_planner/main.dart';

void main() {
  testWidgets('App should load', (WidgetTester tester) async {
    await tester.pumpWidget(const SmartPlannerApp());
    expect(find.byType(SmartPlannerApp), findsOneWidget);
  });
}

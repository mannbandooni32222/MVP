import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/task.dart';
import '../services/storage_service.dart';
import '../utils/parser.dart';
import '../widgets/calendar_strip.dart';
import '../widgets/task_card.dart';
import 'help_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final StorageService _storage = StorageService();
  List<Task> _allTasks = [];
  DateTime _selectedDate = DateTime.now();
  String _username = "";
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final name = await _storage.getUsername();
    final tasks = await _storage.getTasks();
    setState(() {
      _username = name ?? "User";
      _allTasks = tasks;
      _isLoading = false;
    });
  }

  Future<void> _saveTasks() async {
    await _storage.saveTasks(_allTasks);
  }

  void _toggleTaskStatus(Task task) {
    setState(() {
      if (task.status == TaskStatus.pending) task.status = TaskStatus.inProgress;
      else if (task.status == TaskStatus.inProgress) task.status = TaskStatus.completed;
      else task.status = TaskStatus.pending;
    });
    _saveTasks();
  }

  void _deleteTask(String id) {
    setState(() {
      _allTasks.removeWhere((t) => t.id == id);
    });
    _saveTasks();
  }

  void _showBrainDump() {
    final controller = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 24, right: 24, top: 24),
        decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(2)))),
            const SizedBox(height: 24),
            const Text("Brain Dump", style: TextStyle(fontSize: 24, fontWeight: FontWeight.black)),
            const Text("Type naturally. We'll handle the rest.", style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            TextField(
              controller: controller,
              maxLines: 5,
              autofocus: true,
              decoration: InputDecoration(
                hintText: "e.g. Gym at 6am high priority, call mom work...",
                filled: true,
                fillColor: Colors.grey[50],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(24), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.all(20),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 64,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2A6DF4), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                onPressed: () {
                  if (controller.text.trim().isNotEmpty) {
                    final newTasks = TaskParser.parseBrainDump(controller.text, _selectedDate);
                    setState(() {
                      _allTasks.addAll(newTasks);
                    });
                    _saveTasks();
                    Navigator.pop(context);
                  }
                },
                child: const Text("Convert to Tasks", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now();
    final isPast = _selectedDate.isBefore(DateTime(today.year, today.month, today.day));
    
    final dailyTasks = _allTasks.where((t) => 
      DateUtils.isSameDay(t.date, _selectedDate)
    ).toList();

    final completed = dailyTasks.where((t) => t.status == TaskStatus.completed).length;
    final progress = dailyTasks.isEmpty ? 0.0 : completed / dailyTasks.length;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            CalendarStrip(
              selectedDate: _selectedDate,
              onDateSelected: (date) => setState(() => _selectedDate = date),
            ),
            _buildProgressSection(progress),
            Expanded(
              child: _isLoading 
                ? const Center(child: CircularProgressIndicator())
                : dailyTasks.isEmpty 
                  ? _buildEmptyState()
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(24, 12, 24, 100),
                      itemCount: dailyTasks.length,
                      itemBuilder: (context, index) => TaskCard(
                        task: dailyTasks[index],
                        isReadOnly: isPast,
                        onToggle: () => _toggleTaskStatus(dailyTasks[index]),
                        onEdit: () => _editTask(dailyTasks[index]),
                      ),
                    ),
            ),
          ],
        ),
      ),
      floatingActionButton: isPast ? null : FloatingActionButton.large(
        backgroundColor: const Color(0xFF2A6DF4),
        elevation: 12,
        shadowColor: const Color(0xFF2A6DF4).withOpacity(0.4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        onPressed: _showBrainDump,
        child: const Icon(Icons.add_rounded, color: Colors.white, size: 40),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                DateFormat('MMMM yyyy').format(_selectedDate).toUpperCase(), 
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.5)
              ),
              const SizedBox(height: 4),
              Text("Hi, $_username!", style: const TextStyle(fontSize: 28, fontWeight: FontWeight.black, letterSpacing: -0.5)),
            ],
          ),
          Container(
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey[100]!)),
            child: IconButton(
              icon: const Icon(Icons.help_outline_rounded, color: Colors.grey),
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const HelpScreen())),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressSection(double progress) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 20, offset: const Offset(0, 10))],
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text("DAILY PROGRESS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                Text("${(progress * 100).toInt()}%", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.black, color: Color(0xFF2A6DF4))),
              ],
            ),
            const SizedBox(height: 16),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.grey[100],
                color: const Color(0xFF2A6DF4),
                minHeight: 10,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_rounded, size: 64, color: Colors.grey[200]),
          const SizedBox(height: 16),
          const Text("No tasks for this day", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  void _editTask(Task task) {
    // Show edit modal...
    final titleController = TextEditingController(text: task.title);
    final notesController = TextEditingController(text: task.notes);
    Priority priority = task.priority;
    Category category = task.category;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 24, right: 24, top: 24),
          decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(32))),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text("Edit Task", style: TextStyle(fontSize: 24, fontWeight: FontWeight.black)),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                    onPressed: () {
                      _deleteTask(task.id);
                      Navigator.pop(context);
                    },
                  ),
                ],
              ),
              const SizedBox(height: 24),
              TextField(
                controller: titleController,
                decoration: InputDecoration(
                  labelText: "Title",
                  filled: true,
                  fillColor: Colors.grey[50],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 16),
              const Text("Priority", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              Row(
                children: Priority.values.map((p) => Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ChoiceChip(
                    label: Text(p.name.toUpperCase()),
                    selected: priority == p,
                    onSelected: (val) => setModalState(() => priority = p),
                  ),
                )).toList(),
              ),
              const SizedBox(height: 16),
              const Text("Category", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              Row(
                children: Category.values.map((c) => Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ChoiceChip(
                    label: Text(c.name.toUpperCase()),
                    selected: category == c,
                    onSelected: (val) => setModalState(() => category = c),
                  ),
                )).toList(),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: notesController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: "Notes",
                  filled: true,
                  fillColor: Colors.grey[50],
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 64,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2A6DF4), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24))),
                  onPressed: () {
                    setState(() {
                      task.title = titleController.text;
                      task.notes = notesController.text;
                      task.priority = priority;
                      task.category = category;
                    });
                    _saveTasks();
                    Navigator.pop(context);
                  },
                  child: const Text("Save Changes", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

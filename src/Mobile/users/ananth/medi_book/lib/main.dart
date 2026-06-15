// lib/main.dart

import 'package:flutter/material.dart';
import 'theme.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(const MyMediBookApp());
}

class MyMediBookApp extends StatelessWidget {
  const MyMediBookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Medi Book',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: const LoginScreen(),
    );
  }
}
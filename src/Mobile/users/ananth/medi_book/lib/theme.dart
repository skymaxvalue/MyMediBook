// lib/theme.dart

import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF4A6CF7);
  static const Color primaryDark = Color(0xFF3B5BDB);
  static const Color background = Color(0xFFF5F6FA);
  static const Color white = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFDCDCDC);
  static const Color textDark = Color(0xFF1A1A2E);
  static const Color textGrey = Color(0xFF555555);
  static const Color textLight = Color(0xFF888888);
  static const Color error = Color(0xFFE74C3C);
  static const Color success = Color(0xFF27AE60);
  static const Color tabCompleted = Color(0xFF9ED9B6);
  static const Color tabActive = Color(0xFF9DB6D9);
}

class AppTheme {
  static ThemeData get theme => ThemeData(
        fontFamily: 'SourceSansPro',
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        scaffoldBackgroundColor: AppColors.background,
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.white,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: AppColors.error),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
        ),
        useMaterial3: true,
      );
}

// Gradient decoration used across screens
BoxDecoration get primaryGradient => const BoxDecoration(
      gradient: LinearGradient(
        colors: [AppColors.primary, AppColors.primaryDark],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      ),
    );
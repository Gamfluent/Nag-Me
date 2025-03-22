# Productivity App Documentation

## Overview
A modern task management solution designed to boost productivity through intelligent reminders and AI assistance. The app provides a seamless experience for managing tasks with priority-based notifications and AI-powered task creation.

## Tech Stack:
- Frontend: React Native with TypeScript, Expo, and Expo Router
- Backend/Database: Supabase
- UI Framework: React Native Paper
- AI Processing: DeepSeek

## Core Features

### 1. Main Dashboard
- **Direct Access**: No login required
- **Dark Theme Interface**
- **Task Organization**:
  - Two main sections:
    1. Pending Tasks
    2. Completed Tasks
  - Task sorting order:
    1. Due Date (primary sort)
    2. Priority Level (secondary sort)
- **Key Components**:
  - Task List View
  - Add Task Button
  - AI Chat Interface
  - Settings & Profile Menu

### 2. Task Management

#### Manual Task Creation
Users can add tasks with:
- Task Name
- Optional Description
- Due Date & Time
- Priority Rating (0-10)

#### AI-Powered Task Creation
- Natural language task input via chat
- Powered by Deepseek R1 API
- Example: "Remind me to submit my report by Friday at 5 PM"
- Automatic extraction of task details

### 3. Smart Reminder System
- **Dynamic Notification Frequency**:
  - Priority-based (0-10 scale)
  - Deadline-proximity aware
- **Customizable Settings**:
  - Snooze functionality
  - Repeat options
  - Custom notification preferences

### 4. Task Completion Flow
- One-click completion marking
- Dedicated "Completed Tasks" section
- Task history tracking

### 5. User Preferences
- Notification settings
- App appearance customization
- Reminder frequency control

## Technical Architecture

### Backend Infrastructure
- **Data Storage**: Local
- **Notification System**:
  - Local push notifications
  - Firebase Cloud Messaging (FCM)
- **AI Integration**: Deepseek R1 API

## Roadmap

### Planned Features
1. Recurring Tasks
2. Collaboration & Task Sharing
3. Calendar Integration
4. Voice Command Support

## Notes for Developers
- Prioritize user experience in notification timing
- Implement efficient data synchronization
- Focus on battery-efficient background processes
- Ensure reliable AI task parsing
# CourseAlign Database Schema

## Collections Overview

### 1. Users Collection
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  name: string;
  department: string;
  studentId?: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  bookmarkedCourses: ObjectId[]; // References to Course._id
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Courses Collection
```typescript
interface Course {
  _id: ObjectId;
  code: string; // e.g., "CS101"
  title: string;
  description: string;
  department: string;
  level: number; // 100, 200, 300, 400
  semester: 'first' | 'second' | 'both';
  credits: number;
  prerequisites: string[];
  objectives: string[];
  outline: {
    week: number;
    topic: string;
    content: string;
  }[];
  assessment: {
    type: string; // "exam", "assignment", "quiz"
    weight: number; // percentage
    description: string;
  }[];
  instructor: string;
  resources: {
    type: 'book' | 'article' | 'video' | 'website';
    title: string;
    url?: string;
    author?: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. ChatHistory Collection
```typescript
interface ChatHistory {
  _id: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  sessionId: string; // UUID for grouping related messages
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  context: {
    topic?: string;
    courseWeek?: number;
    relatedOutline?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. ExamSessions Collection
```typescript
interface ExamSession {
  _id: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  sessionType: 'practice' | 'mock' | 'review';
  questions: {
    id: string;
    question: string;
    type: 'multiple_choice' | 'short_answer' | 'essay';
    options?: string[]; // for multiple choice
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
    feedback: string;
    points: number;
    timeSpent: number; // seconds
  }[];
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  maxScore: number;
  timeLimit: number; // minutes
  timeUsed: number; // minutes
  status: 'in_progress' | 'completed' | 'abandoned';
  aiGeneratedQuestions: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  completedAt?: Date;
}
```

### 5. Bookmarks Collection
```typescript
interface Bookmark {
  _id: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  type: 'course' | 'topic' | 'resource';
  reference?: string; // specific topic or resource within course
  notes?: string;
  tags: string[];
  createdAt: Date;
}
```

### 6. UserProgress Collection
```typescript
interface UserProgress {
  _id: ObjectId;
  userId: ObjectId;
  courseId: ObjectId;
  completedTopics: string[];
  currentWeek: number;
  studyTimeMinutes: number;
  lastAccessedAt: Date;
  progressPercentage: number;
  achievements: {
    type: string;
    title: string;
    description: string;
    unlockedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Indexes for Performance

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ studentId: 1 }, { unique: true, sparse: true });

// Courses
db.courses.createIndex({ code: 1, department: 1 });
db.courses.createIndex({ level: 1, semester: 1 });
db.courses.createIndex({ department: 1, isActive: 1 });

// ChatHistory
db.chathistory.createIndex({ userId: 1, courseId: 1 });
db.chathistory.createIndex({ sessionId: 1 });
db.chathistory.createIndex({ createdAt: -1 });

// ExamSessions
db.examsessions.createIndex({ userId: 1, courseId: 1 });
db.examsessions.createIndex({ userId: 1, createdAt: -1 });

// Bookmarks
db.bookmarks.createIndex({ userId: 1, courseId: 1 }, { unique: true });

// UserProgress
db.userprogress.createIndex({ userId: 1, courseId: 1 }, { unique: true });
```
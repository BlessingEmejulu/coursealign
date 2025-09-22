export interface Course {
  id: string
  code: string
  title: string
  units: number
  level: '100' | '200' | '300' | '400'
  semester: '1st' | '2nd'
  department: string
  isBookmarked: boolean
}

export const COURSE_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level' },
  { value: '400', label: '400 Level' }
] as const

export const COURSE_SEMESTERS = [
  { value: 'all', label: 'All Semesters' },
  { value: '1st', label: '1st Semester' },
  { value: '2nd', label: '2nd Semester' }
] as const

export const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    code: 'CIS 104',
    title: 'Programming Logic with C# & QBASIC',
    units: 2,
    level: '100',
    semester: '2nd',
    department: 'CIS Dept',
    isBookmarked: false
  },
  {
    id: '2',
    code: 'CIS 101',
    title: 'Introduction to Computer Science',
    units: 3,
    level: '100',
    semester: '1st',
    department: 'CIS Dept',
    isBookmarked: true
  },
  {
    id: '3',
    code: 'CIS 201',
    title: 'Data Structures and Algorithms',
    units: 3,
    level: '200',
    semester: '1st',
    department: 'CIS Dept',
    isBookmarked: false
  },
  {
    id: '4',
    code: 'CIS 202',
    title: 'Object-Oriented Programming',
    units: 3,
    level: '200',
    semester: '2nd',
    department: 'CIS Dept',
    isBookmarked: true
  },
  {
    id: '5',
    code: 'CIS 301',
    title: 'Database Management Systems',
    units: 4,
    level: '300',
    semester: '1st',
    department: 'CIS Dept',
    isBookmarked: false
  },
  {
    id: '6',
    code: 'CIS 302',
    title: 'Web Development Technologies',
    units: 3,
    level: '300',
    semester: '2nd',
    department: 'CIS Dept',
    isBookmarked: false
  },
  {
    id: '7',
    code: 'CIS 401',
    title: 'Software Engineering',
    units: 4,
    level: '400',
    semester: '1st',
    department: 'CIS Dept',
    isBookmarked: true
  },
  {
    id: '8',
    code: 'CIS 402',
    title: 'Final Year Project',
    units: 6,
    level: '400',
    semester: '2nd',
    department: 'CIS Dept',
    isBookmarked: false
  }
]
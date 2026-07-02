import type { College } from './types';

// Starter dataset. Add more entries here in the same shape —
// this is where your full 6,000-school dataset would eventually live
// (ideally loaded from a JSON file or API rather than hardcoded).
export const colleges: College[] = [
  {
    id: '1', name: 'University of Michigan', shortName: 'Michigan', websiteURL: 'https://umich.edu',
    description: 'Public research university in Ann Arbor.', institutionType: 'Public',
    city: 'Ann Arbor', state: 'MI',
    admissions: { acceptanceRate: 0.18, satRange: { low: 1350, high: 1530 }, actRange: { low: 31, high: 34 }, averageGPA: 3.88 },
    financials: { tuitionInState: 17786, tuitionOutOfState: 57273, roomAndBoard: 13268, averageNetPrice: 21000 },
    academics: { graduationRate: 0.93, studentFacultyRatio: 15, popularMajors: ['Engineering', 'Business', 'Computer Science'] },
    studentLife: { undergradEnrollment: 32695 },
    rankings: { usNewsNational: 21 },
  },
  {
    id: '2', name: 'James Madison University', shortName: 'JMU', websiteURL: 'https://jmu.edu',
    description: 'Public university in Harrisonburg, Virginia.', institutionType: 'Public',
    city: 'Harrisonburg', state: 'VA',
    admissions: { acceptanceRate: 0.79, satRange: { low: 1090, high: 1250 }, actRange: { low: 22, high: 28 }, averageGPA: 3.6 },
    financials: { tuitionInState: 12106, tuitionOutOfState: 30122, roomAndBoard: 11888, averageNetPrice: 19500 },
    academics: { graduationRate: 0.82, studentFacultyRatio: 16, popularMajors: ['Business', 'Health Sciences', 'Education'] },
    studentLife: { undergradEnrollment: 20141 },
    rankings: {},
  },
  {
    id: '3', name: 'Massachusetts Institute of Technology', shortName: 'MIT', websiteURL: 'https://mit.edu',
    description: 'Elite private research university.', institutionType: 'Private',
    city: 'Cambridge', state: 'MA',
    admissions: { acceptanceRate: 0.04, satRange: { low: 1520, high: 1580 }, actRange: { low: 34, high: 36 }, averageGPA: 3.96 },
    financials: { tuitionInState: 57986, tuitionOutOfState: 57986, roomAndBoard: 19100, averageNetPrice: 12000 },
    academics: { graduationRate: 0.96, studentFacultyRatio: 3, popularMajors: ['Computer Science', 'Engineering', 'Physics'] },
    studentLife: { undergradEnrollment: 4657 },
    rankings: { usNewsNational: 2 },
  },
  {
    id: '4', name: 'George Mason University', shortName: 'GMU', websiteURL: 'https://gmu.edu',
    description: 'Public university in Fairfax, Virginia.', institutionType: 'Public',
    city: 'Fairfax', state: 'VA',
    admissions: { acceptanceRate: 0.90, satRange: { low: 1050, high: 1240 }, actRange: { low: 21, high: 27 }, averageGPA: 3.5 },
    financials: { tuitionInState: 12206, tuitionOutOfState: 35424, roomAndBoard: 12800, averageNetPrice: 18000 },
    academics: { graduationRate: 0.71, studentFacultyRatio: 17, popularMajors: ['Business', 'IT', 'Nursing'] },
    studentLife: { undergradEnrollment: 27400 },
    rankings: {},
  },
  {
    id: '5', name: 'University of Virginia', shortName: 'UVA', websiteURL: 'https://virginia.edu',
    description: 'Public flagship university founded by Thomas Jefferson.', institutionType: 'Public',
    city: 'Charlottesville', state: 'VA',
    admissions: { acceptanceRate: 0.19, satRange: { low: 1350, high: 1510 }, actRange: { low: 31, high: 34 }, averageGPA: 4.3 },
    financials: { tuitionInState: 19698, tuitionOutOfState: 55348, roomAndBoard: 13480, averageNetPrice: 17800 },
    academics: { graduationRate: 0.95, studentFacultyRatio: 15, popularMajors: ['Economics', 'Biology', 'Computer Science'] },
    studentLife: { undergradEnrollment: 17402 },
    rankings: { usNewsNational: 24 },
  },
];

export const centerInfo = {
  name: "Pradeep Singh Rajpoot",
  centerName: "Pradeep CSC & Digital Seva Kendra",
  cscId: "CSC-ID-XXXX-XXXX",
  location: "Main Market, Dharampura, Madhya Pradesh",
  phone: "+91 98765 43210",
  email: "pradeep.csc@example.com",
  workingHours: "Mon - Sat: 09:00 AM - 07:00 PM",
  sunday: "Closed",
  upiId: "pradeep@upi"
};

import { ShieldCheck, Landmark, FileText, Smartphone, Plane, Sprout, GraduationCap } from 'lucide-react'

export const services = [
  {
    title: "Aadhaar Services",
    description: "New enrollment, biometric updates, PVC card printing, and address changes.",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600",
    badge: "Most Popular"
  },
  {
    title: "Banking (AEPS)",
    description: "Cash withdrawal, money transfer, balance enquiry, and zero balance account opening.",
    icon: Landmark,
    color: "bg-green-100 text-green-600",
    badge: "Instant"
  },
  {
    title: "Government IDs",
    description: "PAN Card (New/Correction), Voter ID, Passport Seva, and Ration Card.",
    icon: FileText,
    color: "bg-orange-100 text-orange-600"
  },
  {
    title: "Utility Payments",
    description: "Electricity bills, water bills, mobile recharges, DTH, and FASTag.",
    icon: Smartphone,
    color: "bg-purple-100 text-purple-600"
  },
  {
    title: "Travel Booking",
    description: "IRCTC authorized train ticket booking, bus tickets, and flight reservations.",
    icon: Plane,
    color: "bg-red-100 text-red-600"
  },
  {
    title: "Insurance & Health",
    description: "Vehicle insurance (Bike/Car), Life Insurance, and Ayushman Bharat Card.",
    icon: Sprout,
    color: "bg-teal-100 text-teal-600"
  },
  {
    title: "Education & Skilling",
    description: "PMGDisha, computer course certifications, and university admission forms.",
    icon: GraduationCap,
    color: "bg-yellow-100 text-yellow-600"
  }
];

// export const upPortals = [
//   { name: "e-District UP", url: "https://edistrict.up.gov.in", desc: "Caste, Income, Domicile Certs" },
//   { name: "Bhulekh UP", url: "https://upbhulekh.gov.in", desc: "Land Records (Khatauni)" },
//   { name: "Jansunwai (IGRS)", url: "https://jansunwai.up.nic.in", desc: "Register Grievance/Complaint" },
//   { name: "UPPCL Electricity", url: "https://www.upenergy.in", desc: "Bill Pay & New Connection" },
//   { name: "Ration Card UP", url: "https://fcs.up.gov.in", desc: "Ration Card List & Status" },
//   { name: "Manav Sampada", url: "http://ehrms.upsdc.gov.in", desc: "Govt Employee Service Book" },
//   { name: "UP Agriculture", url: "http://upagriculture.com", desc: "Farmer Registration & PM Kisan" },
//   { name: "Bhu Naksha", url: "http://upbhunaksha.gov.in", desc: "View Land Maps Online" },
//   { name: "Voter Service", url: "https://voters.eci.gov.in", desc: "Voter ID Apply & Download" },
//   { name: "Labour Card", url: "https://uplabour.gov.in", desc: "Labour Registration & Schemes" },
//   { name: "UP Scholarship", url: "https://scholarship.up.gov.in", desc: "Student Scholarship Status" },
//   { name: "Parivahan UP", url: "https://parivahan.gov.in", desc: "Driving License & Vehicle Reg" },
// ];

export const upPortals = [
  { name: "e-District UP", url: "https://edistrict.up.gov.in", desc: "Caste, Income, Domicile Certs" },
  { name: "Bhulekh UP", url: "https://upbhulekh.gov.in", desc: "Land Records (Khatauni)" },
  { name: "Jansunwai (IGRS)", url: "https://jansunwai.up.nic.in", desc: "Register Grievance/Complaint" },
  { name: "UPPCL Electricity", url: "https://www.upenergy.in", desc: "Bill Pay & New Connection" },
  { name: "Ration Card UP", url: "https://fcs.up.gov.in", desc: "Ration Card List & Status" },
  { name: "Manav Sampada", url: "http://ehrms.upsdc.gov.in", desc: "Govt Employee Service Book" },
  { name: "UP Agriculture", url: "http://upagriculture.com", desc: "Farmer Registration & PM Kisan" },
  { name: "Bhu Naksha", url: "http://upbhunaksha.gov.in", desc: "View Land Maps Online" },
  { name: "Voter Service", url: "https://voters.eci.gov.in", desc: "Voter ID Apply & Download" },
  { name: "Labour Card", url: "https://uplabour.gov.in", desc: "Labour Registration & Schemes" },
  { name: "UP Scholarship", url: "https://scholarship.up.gov.in", desc: "Student Scholarship Status" },
  { name: "Parivahan UP", url: "https://parivahan.gov.in", desc: "Driving License & Vehicle Reg" },
];

export const banks = {
  airtel: { name: "Airtel Payments Bank", color: "bg-red-600", text: "text-white", logoText: "airtel" },
  paytm: { name: "Paytm Payments Bank", color: "bg-blue-900", text: "text-white", logoText: "Paytm" },
  fino: { name: "Fino Payments Bank", color: "bg-purple-700", text: "text-white", logoText: "Fino" },
  ippb: { name: "India Post Payments Bank", color: "bg-slate-800", text: "text-white", logoText: "IPPB" },
  sbi: { name: "State Bank of India", color: "bg-blue-600", text: "text-white", logoText: "SBI" },
  bob: { name: "Bank of Baroda", color: "bg-orange-600", text: "text-white", logoText: "BoB" }
};

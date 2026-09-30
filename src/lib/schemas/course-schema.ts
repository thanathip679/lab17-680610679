import { z } from "zod";
import type { Course } from "@/lib/types";

export const createCourseFormSchema = (courses: Course[]) =>
  z.object({
    courseId: z
      .string()
      .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
      .refine(
        (id) => !courses.some((course) => course.courseId === id),
        "รหัสวิชานี้มีอยู่แล้ว"
      ),
    courseTitle: z
      .string()
      .min(1, "กรุณากรอกชื่อวิชา")
      .max(100, "ชื่อวิชายาวได้ไม่เกิน 100 ตัวอักษร"),
    program: z.enum(["CPE", "ISNE"], {
      message: "เลือกหลักสูตร",
    }),
    semester: z.enum(["1", "2", "3"], {
      message: "เลือกภาคการศึกษา",
    }),
    description: z
      .string()
      .max(100, "รายละเอียดยาวได้ไม่เกิน 100 ตัวอักษร")
      .optional(),
    notifyByEmail: z.boolean().default(false),
    instructors: z
      .array(
        z.object({
          name: z.string().min(1, "กรอกชื่อผู้สอน"),
          email: z
            .string()
            .min(1, "ต้องเป็นอีเมล @cmu.ac.th")
            .email("รูปแบบอีเมลไม่ถูกต้อง")
            .regex(/@cmu\.ac\.th$/, "ต้องเป็นอีเมล @cmu.ac.th"),
        })
      )
      .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
      .max(3, "มีผู้สอนได้ไม่เกิน 3 คน")
      .refine(
        (instructors) => {
          const emails = instructors.map((inst) => inst.email);
          return new Set(emails).size === emails.length; 
        },
        {
          message: "อีเมลผู้สอนซ้ำกัน",
        }
      ),
  });

export type CourseFormValues = z.infer<ReturnType<typeof createCourseFormSchema>>;
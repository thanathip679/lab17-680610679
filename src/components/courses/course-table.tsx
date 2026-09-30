import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  // ฟังก์ชันช่วยแปลงตัวเลขภาคการศึกษาเป็นข้อความ
  const formatSemester = (semester?: "1" | "2" | "3") => {
    if (semester === "1") return "ภาคการศึกษาที่ 1";
    if (semester === "2") return "ภาคการศึกษาที่ 2";
    if (semester === "3") return "ภาคฤดูร้อน";
    return "-";
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell className="align-top pt-4">{course.courseId}</TableCell>
              <TableCell className="align-top pt-4 font-medium">{course.courseTitle}</TableCell>
              <TableCell className="align-top pt-4">
                {course.program && (
                  <Badge variant="outline">{course.program}</Badge>
                )}
              </TableCell>
              <TableCell className="align-top pt-4 text-muted-foreground">
                {formatSemester(course.semester)}
              </TableCell>
              <TableCell className="align-top pt-4 text-sm text-muted-foreground max-w-[200px]">
                {course.description || "-"}
              </TableCell>
              <TableCell className="align-top pt-4">
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  <div className="flex flex-col gap-2">
                    {course.instructors.map((inst, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-sm">{inst.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {inst.email}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="align-top pt-4">
                {course.notifyByEmail ? (
                  <Badge>รับ</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-transparent text-muted-foreground shadow-none">ไม่รับ</Badge>
                )}
              </TableCell>
              <TableCell className="align-top pt-4">
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
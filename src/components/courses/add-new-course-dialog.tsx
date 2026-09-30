import { useEffect, useState } from "react";
import { PlusCircle, RotateCcw, X } from "lucide-react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { createCourseFormSchema, type CourseFormValues } from "@/lib/schemas/course-schema";
import { useEnrollmentStore } from "@/lib/enrollment-store";

const defaultFormValues: Partial<CourseFormValues> = {
  courseId: "",
  courseTitle: "",
  program: undefined,
  semester: undefined,
  description: "",
  notifyByEmail: false,
  instructors: [{ name: "", email: "" }],
};

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseFormSchema(courses)) as any, 
    defaultValues: defaultFormValues as CourseFormValues,
    mode: "onBlur",
  });

  const { control, handleSubmit, reset, formState: { errors } } = form;

  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructors",
  });

  
  const descriptionValue = useWatch({ control, name: "description" }) || "";

  
  useEffect(() => {
    if (!open) {
      reset(defaultFormValues as CourseFormValues);
    }
  }, [open, reset]);

  const onSubmit = (data: CourseFormValues) => {
    addCourse({
      courseId: data.courseId.trim(),
      courseTitle: data.courseTitle.trim(),
      program: data.program,
      semester: data.semester,
      description: data.description?.trim(),
      notifyByEmail: data.notifyByEmail,
      instructors: data.instructors,
    });
    setOpen(false); 
  };

  const handleResetForm = () => {
    reset(defaultFormValues as CourseFormValues);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusCircle className="mr-2 h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว ใส่อีเมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100 ตัวอักษร แล้วกดบันทึก
            </DialogDescription>
          </DialogHeader>

          {/* รหัสวิชา */}
          <Controller
            control={control}
            name="courseId"
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label htmlFor="courseId" className={fieldState.invalid ? "text-destructive" : ""}>รหัสวิชา</Label>
                <Input
                  id="courseId"
                  placeholder="เช่น 261305"
                  inputMode="numeric"
                  aria-invalid={fieldState.invalid ? "true" : undefined}
                  className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...field}
                />
                {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {/* ชื่อวิชา */}
          <Controller
            control={control}
            name="courseTitle"
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label htmlFor="courseTitle" className={fieldState.invalid ? "text-destructive" : ""}>ชื่อวิชา</Label>
                <Input
                  id="courseTitle"
                  placeholder="เช่น Mobile Application Development"
                  aria-invalid={fieldState.invalid ? "true" : undefined}
                  className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...field}
                />
                {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {/* หลักสูตร */}
          <Controller
            control={control}
            name="program"
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label className={fieldState.invalid ? "text-destructive" : ""}>หลักสูตร</Label>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger aria-invalid={fieldState.invalid ? "true" : undefined} className={fieldState.invalid ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="เลือกหลักสูตร" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPE">CPE - วิศวกรรมคอมพิวเตอร์</SelectItem>
                    <SelectItem value="ISNE">ISNE - วิศวกรรมระบบสารสนเทศและเครือข่าย</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {/* ภาคการศึกษา */}
          <Controller
            control={control}
            name="semester"
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label className={fieldState.invalid ? "text-destructive" : ""}>ภาคการศึกษา</Label>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="sem-1" />
                    <Label htmlFor="sem-1" className="font-normal cursor-pointer">ภาคการศึกษาที่ 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="sem-2" />
                    <Label htmlFor="sem-2" className="font-normal cursor-pointer">ภาคการศึกษาที่ 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="sem-3" />
                    <Label htmlFor="sem-3" className="font-normal cursor-pointer">ภาคฤดูร้อน</Label>
                  </div>
                </RadioGroup>
                {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {/* รายละเอียด */}
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <div className="grid gap-1.5">
                <Label htmlFor="description" className={fieldState.invalid ? "text-destructive" : ""}>รายละเอียด (ไม่บังคับ)</Label>
                <Textarea
                  id="description"
                  aria-invalid={fieldState.invalid ? "true" : undefined}
                  className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                  {...field}
                />
                <div className="flex justify-between">
                  {fieldState.error ? (
                    <p className="text-sm text-destructive">{fieldState.error.message}</p>
                  ) : (
                    <span />
                  )}
                  <p className={`text-sm ${descriptionValue.length > 100 ? "text-destructive" : "text-muted-foreground"}`}>
                    {descriptionValue.length}/100 ตัวอักษร
                  </p>
                </div>
              </div>
            )}
          />

          {/* ผู้สอน (Array Field) */}
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label>ผู้สอน</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              {fields.length}/3 คน - กรอกชื่อผู้สอน และอีเมล name@cmu.ac.th (ห้ามซ้ำกัน)
            </p>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start mt-2">
                <span className="mt-2 text-sm w-4">{index + 1}.</span>
                
                <div className="grid gap-1.5 flex-1">
                  <Controller
                    control={control}
                    name={`instructors.${index}.name`}
                    render={({ field: inputField, fieldState }) => (
                      <>
                        <Input
                          placeholder="กรอกชื่อผู้สอน"
                          aria-invalid={fieldState.invalid ? "true" : undefined}
                          className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                          {...inputField}
                        />
                        {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                      </>
                    )}
                  />
                </div>
                
                <div className="grid gap-1.5 flex-1">
                  <Controller
                    control={control}
                    name={`instructors.${index}.email`}
                    render={({ field: inputField, fieldState }) => (
                      <>
                        <Input
                          placeholder="ต้องเป็นอีเมล @cmu.ac.th"
                          aria-invalid={fieldState.invalid ? "true" : undefined}
                          className={fieldState.invalid ? "border-destructive focus-visible:ring-destructive" : ""}
                          {...inputField}
                        />
                        {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                      </>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length <= 1} 
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {/* แสดง Error เมื่ออีเมลซ้ำกัน */}
            {errors.instructors?.root && (
              <p className="text-sm text-destructive mt-1">{errors.instructors.root.message}</p>
            )}
            
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                disabled={fields.length >= 3} // เพิ่มไม่ได้ถ้าครบ 3 คน
                onClick={() => append({ name: "", email: "" })}
              >
                + เพิ่มผู้สอน
              </Button>
            </div>
          </div>

          {/* รับข่าวสารทางอีเมล */}
          <Controller
            control={control}
            name="notifyByEmail"
            render={({ field }) => (
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm mt-2">
                <div className="space-y-0.5">
                  <Label>รับข่าวสารทางอีเมล</Label>
                  <p className="text-sm text-muted-foreground">
                    แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            {/* ปุ่มล้างฟอร์ม */}
            <Button type="button" variant="outline" onClick={handleResetForm}>
              <RotateCcw className="mr-2 h-4 w-4" /> ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
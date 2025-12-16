import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Mail, Phone } from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="space-y-6">
      <Badge>สมัครสมาชิก (รอแอดมินอนุมัติ)</Badge>
      <Card className="space-y-4">
        <CardHeader title="สร้างบัญชีใหม่" subtitle="ข้อมูลทั้งหมดใช้ภาษาไทยได้" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">อีเมล</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <Mail className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" placeholder="you@example.com" />
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">เบอร์โทรศัพท์</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <Phone className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" placeholder="08xxxxxxxx" />
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">รหัสผ่าน</span>
            <input className="card p-3 w-full bg-slate-50 outline-none" type="password" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">ยืนยันรหัสผ่าน</span>
            <input className="card p-3 w-full bg-slate-50 outline-none" type="password" />
          </label>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4" />
          สมัครแล้วต้องรอแอดมินตรวจสอบก่อนใช้งาน API
        </div>
        <div className="flex gap-3">
          <Button type="button">ส่งคำขอสมัคร</Button>
          <Button variant="ghost" type="button">มีบัญชีแล้ว? เข้าสู่ระบบ</Button>
        </div>
      </Card>
    </main>
  );
}

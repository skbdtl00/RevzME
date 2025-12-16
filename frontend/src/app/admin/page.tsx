import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, CheckCircle2, Clock3 } from "lucide-react";

const pendingUsers = [
  { email: "merchant@revz.me", phone: "0800000000", status: "รออนุมัติ" },
  { email: "demo@shop.com", phone: "0899999999", status: "รออนุมัติ" },
];

export default function AdminPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge>แดชบอร์ดแอดมิน</Badge>
        <p className="text-sm text-slate-500">อนุมัติผู้ใช้ใหม่และตรวจสอบสถานะระบบ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4" /> สมัครใหม่
          </div>
          <p className="text-2xl font-semibold">2 รายการ</p>
        </Card>
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4" /> ระบบพร้อมใช้งาน
          </div>
          <p className="text-2xl font-semibold text-emerald-600">Healthy</p>
        </Card>
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4" /> คิว webhook
          </div>
          <p className="text-2xl font-semibold">0</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="คำขอใช้งานล่าสุด" subtitle="ต้องอนุมัติก่อนใช้งาน API" />
        <div className="divide-y">
          {pendingUsers.map((user) => (
            <div key={user.email} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-slate-500">{user.phone}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost">ปฏิเสธ</Button>
                <Button>อนุมัติ</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <ShieldCheck className="h-4 w-4" />
        ผู้ใช้ทุกคนต้องได้รับการยืนยันก่อนเรียก API
      </div>
    </main>
  );
}

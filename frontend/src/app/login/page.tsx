import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="space-y-6">
      <Badge>เข้าสู่ระบบ</Badge>
      <Card className="space-y-4">
        <CardHeader title="ล็อกอินเพื่อจัดการธุรกรรม" />
        <div className="space-y-3">
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">อีเมล</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <User className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" placeholder="you@example.com" />
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">รหัสผ่าน</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <Lock className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" type="password" />
            </div>
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="button">เข้าสู่ระบบ</Button>
          <Button variant="ghost" type="button">สมัครสมาชิก</Button>
        </div>
      </Card>
    </main>
  );
}

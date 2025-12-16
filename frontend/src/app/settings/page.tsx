import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Phone, KeyRound, Banknote } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge>Settings</Badge>
        <p className="text-sm text-slate-500">กำหนดค่าการรับเงินและความปลอดภัย</p>
      </div>

      <Card className="space-y-4">
        <CardHeader title="การตั้งค่ารับเงิน" subtitle="TrueMoney + Slip Verify" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">เบอร์รับซอง TrueMoney</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <Phone className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" placeholder="089xxxxxxx" />
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">Planaria Slip API Key</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <KeyRound className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" placeholder="********" />
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">ชื่อผู้รับ (ต้องตรง / contains)</span>
            <input className="card p-3 w-full bg-slate-50 outline-none" placeholder="RevzME" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">หมายเลขบัญชี/พร้อมเพย์ที่แสดง</span>
            <div className="card p-3 flex items-center gap-2 bg-slate-50">
              <Banknote className="h-4 w-4 text-slate-500" />
              <input className="w-full bg-transparent outline-none" placeholder="123-4-56789-0" />
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">ประเภทบัญชี (สูงสุด 64 ตัวอักษร)</span>
            <input className="card p-3 w-full bg-slate-50 outline-none" placeholder="PromptPay / Bank" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-600">ชื่อธนาคารที่แสดง</span>
            <input className="card p-3 w-full bg-slate-50 outline-none" placeholder="กสิกรไทย" />
          </label>
        </div>
        <div className="flex gap-3">
          <Button>บันทึกการตั้งค่า</Button>
          <Button variant="ghost">รีเซ็ต</Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Settings2 className="h-4 w-4" />
          การตั้งค่าจะถูกใช้ในทุกการสร้างรายการใหม่
        </div>
      </Card>
    </main>
  );
}

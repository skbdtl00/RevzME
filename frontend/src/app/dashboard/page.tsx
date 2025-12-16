import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Receipt, Timer } from "lucide-react";

const stats = [
  { label: "ยอดรอชำระ", value: formatCurrency(1250), icon: <Timer className="h-5 w-5" /> },
  { label: "สำเร็จเดือนนี้", value: formatCurrency(8200), icon: <Receipt className="h-5 w-5" /> },
  { label: "รับผ่าน TrueMoney", value: formatCurrency(4200), icon: <Wallet className="h-5 w-5" /> },
];

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge>แดชบอร์ดผู้ใช้</Badge>
        <p className="text-sm text-slate-500">สรุปธุรกรรมและลิงก์ชำระล่าสุด</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{item.label}</span>
              <span className="text-slate-700">{item.icon}</span>
            </div>
            <p className="text-2xl font-semibold">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <CardHeader
          title="สร้างรายการใหม่ (ตัวอย่าง payload)"
          subtitle="POST /v1/transactions/create"
        />
        <div className="rounded-xl bg-slate-900 text-slate-50 p-4 text-sm font-mono space-y-2">
          <p>{`{ "method": 1, "amount": 150.00, "callback": "https://merchant/callback" }`}</p>
          <p className="text-slate-300">ขั้นต่ำ TrueMoney 10 บาท / สลิป 5 บาท</p>
        </div>
        <div className="flex gap-3">
          <Button>คัดลอกตัวอย่าง</Button>
          <Button variant="ghost">ดูเอกสาร API</Button>
        </div>
      </Card>
    </main>
  );
}

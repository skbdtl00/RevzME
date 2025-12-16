import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from "lucide-react";

const data = [
  { label: "วันนี้", value: "12 รายการ", amount: "฿2,150" },
  { label: "สัปดาห์นี้", value: "68 รายการ", amount: "฿14,320" },
  { label: "เดือนนี้", value: "224 รายการ", amount: "฿52,880" },
];

export default function StatsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge>สถิติ</Badge>
        <p className="text-sm text-slate-500">ข้อมูลรวมผู้ใช้และผู้ดูแล</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {data.map((item) => (
          <Card key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{item.label}</span>
              <BarChart3 className="h-4 w-4" />
            </div>
            <p className="text-xl font-semibold">{item.value}</p>
            <p className="text-sm text-slate-500">{item.amount}</p>
          </Card>
        ))}
      </div>
      <Card className="space-y-3">
        <CardHeader title="ภาพรวม" subtitle="เทรนด์การชำระเงิน" />
        <div className="flex items-center gap-3 text-slate-600">
          <TrendingUp className="h-5 w-5" />
          กราฟและตารางสรุปสามารถเชื่อม API เพื่อนำข้อมูลจริงมาแสดง
        </div>
      </Card>
    </main>
  );
}

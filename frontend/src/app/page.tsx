import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Wallet,
  Banknote,
  Gauge,
  ArrowRight,
  Settings,
} from "lucide-react";

const featureList = [
  { icon: <ShieldCheck className="h-5 w-5" />, title: "API Key", desc: "ป้องกันทุก endpoint" },
  { icon: <Wallet className="h-5 w-5" />, title: "TrueMoney Wallet", desc: "รับซองอั่งเปาอัตโนมัติ" },
  { icon: <Banknote className="h-5 w-5" />, title: "Slip Verify", desc: "Planaria API + ชื่อผู้รับ" },
  { icon: <Gauge className="h-5 w-5" />, title: "หมดอายุ 10 นาที", desc: "ควบคุมเวลาชำระเงิน" },
];

export default function Home() {
  return (
    <main className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
        <div className="space-y-6">
          <Badge>Revz.ME Payment Gateway</Badge>
          <div className="card p-8 space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold">
              เกตเวย์มินิมอล สำหรับ Slip Verify + TrueMoney
            </h1>
            <p className="text-slate-600 leading-relaxed">
              สร้างธุรกรรมผ่าน API, รับลิงก์ชำระเงิน, ตรวจสอบสถานะจ่ายสำเร็จ
              พร้อมตั้งค่าหมายเลขรับเงิน, ชื่อผู้รับ, และบัญชีธนาคารที่แสดงผล
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button>สมัครใช้งาน <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">แดชบอร์ดผู้ใช้</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featureList.map((item) => (
              <Card key={item.title} className="flex gap-3 items-start">
                <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="space-y-4">
          <CardHeader
            title="สรุป API"
            subtitle="10 นาทีต่อหนึ่งคำขอชำระ"
          />
          <div className="rounded-xl bg-slate-900 text-slate-50 p-4 text-sm space-y-2 font-mono">
            <p>POST /v1/transactions/create</p>
            <p className="text-slate-300">{"{ method: 0|1, amount: 10, callback: \"https://...\" }"}</p>
            <p>GET /v1/transactions/:id</p>
            <p>GET /v1/transactions/:id/isPaid</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Settings className="h-4 w-4" />
            ผู้ใช้ปรับค่าหมายเลขรับเงิน, ชื่อผู้รับ, บัญชีธนาคารใน Settings
          </div>
        </Card>
      </section>
    </main>
  );
}

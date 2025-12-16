import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchTransaction, checkPaid } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Clock3, ShieldCheck, Wallet, Banknote } from "lucide-react";

type Props = { params: { id: string } };

export default async function PaymentPage({ params }: Props) {
  const { id } = params;

  const trx = await fetchTransaction(id).catch(() => null);
  if (!trx) return notFound();

  const paid = await checkPaid(id).catch(() => false);
  const methodIcon =
    trx.method === 1 ? <Wallet className="h-4 w-4" /> : <Banknote className="h-4 w-4" />;

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge>ชำระเงิน #{id.slice(0, 8)}</Badge>
        <span className="text-sm text-slate-500 flex items-center gap-1">
          <Clock3 className="h-4 w-4" /> หมดอายุภายใน 10 นาที
        </span>
      </div>

      <Card className="space-y-4">
        <CardHeader title="รายละเอียดการชำระ" subtitle="ระบบ Revz.ME" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {methodIcon}
            {trx.method === 1 ? "TrueMoney Gift" : "ตรวจสลิปโอน"}
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(trx.amount)}</p>
        </div>
        <div className="rounded-xl bg-slate-900 text-slate-50 p-4 text-sm font-mono space-y-2">
          <p>payment_url: {trx.paymentUrl}</p>
          <p>token_checksum: {trx.tokenChecksum}</p>
          <p>callback: {trx.callback || "-"}</p>
        </div>
        <div className="flex gap-3">
          <Button disabled={paid}>{paid ? "ชำระแล้ว" : "เปิดลิงก์ชำระ"}</Button>
          <Button variant="ghost">ดาวน์โหลดใบแจ้ง</Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4" />
          ระบบตรวจสอบสถานะผ่าน API ทุกครั้งก่อนแสดงเป็นจ่ายสำเร็จ
        </div>
      </Card>
    </main>
  );
}

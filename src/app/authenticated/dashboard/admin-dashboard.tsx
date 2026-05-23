import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AlertCircle, Coins, MessageSquare, ArrowRight } from "lucide-react";

interface AdminDashboardProps {
  reportsCount: number;
  escalatedRefundsCount: number;
  escalatedComplaintsCount: number;
}

export default function AdminDashboard({
  reportsCount,
  escalatedRefundsCount,
  escalatedComplaintsCount,
}: AdminDashboardProps) {
  const cards = [
    {
      title: "Laporan Pengguna",
      value: reportsCount,
      description: "Daftar laporan pelanggaran dari pengguna dalam sistem.",
      href: "/authenticated/laporan",
      icon: AlertCircle,
      colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      gradientClass: "from-amber-500 to-yellow-400",
      actionText: "Kelola Laporan",
    },
    {
      title: "Refund yang Dieskalasi",
      value: escalatedRefundsCount,
      description:
        "Permintaan pengembalian dana yang dialihkan ke pihak admin.",
      href: "/authenticated/refund",
      icon: Coins,
      colorClass: "text-red-500 bg-red-500/10 border-red-500/20",
      gradientClass: "from-red-500 to-rose-400",
      actionText: "Kelola Refund",
    },
    {
      title: "Komplain yang Dieskalasi",
      value: escalatedComplaintsCount,
      description:
        "Komplain kedai dari pelanggan yang membutuhkan mediasi admin.",
      href: "/authenticated/komplain",
      icon: MessageSquare,
      colorClass: "text-violet-500 bg-violet-500/10 border-violet-500/20",
      gradientClass: "from-violet-500 to-purple-400",
      actionText: "Kelola Komplain",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Dashboard Admin
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Pusat pemantauan pelaporan, eskalasi komplain, dan persetujuan
          pengembalian dana (refund) sistem Canteeners.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group block">
              <Card className="h-full border border-muted/60 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden bg-card/60 backdrop-blur-xs">
                {/* Accent Line on hover */}
                <div
                  className={`absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${card.gradientClass}`}
                />

                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    {card.title}
                  </span>
                  <div
                    className={`p-2 rounded-lg border ${card.colorClass} transition-colors duration-300`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <span className="text-4xl font-extrabold tracking-tight">
                      {card.value}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      kasus
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>

                  <div className="flex items-center text-xs font-semibold text-primary/80 group-hover:text-primary pt-2 transition-colors">
                    {card.actionText}
                    <ArrowRight className="h-3 w-3 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"; // ✅ replaced use-toast
import { CheckCircle2, LogOut, Clock3, ArrowLeftRight } from "lucide-react";

type MarkType = "IN" | "OUT";

export default function EmployeeDashboard() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<MarkType | null>(null);
  const [lastMark, setLastMark] = useState<{
    type: MarkType;
    at: string;
  } | null>(null);

  // Guard: must be logged in
  useEffect(() => {
    const t = localStorage.getItem("token") || sessionStorage.getItem("token");
    const emp =
      localStorage.getItem("employeeId") ||
      sessionStorage.getItem("employeeId");
    if (!t || !emp) {
      router.replace("/employee/login");
      return;
    }
    setToken(t);
    setEmployeeId(emp);
  }, [router]);

  // simple live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const timeStr = useMemo(() => now.toLocaleTimeString(), [now]);
  const dateStr = useMemo(() => now.toLocaleDateString(), [now]);

  async function mark(type: MarkType) {
    if (!token) return;
    setLoading(type);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to mark attendance");
      }
      const at = new Date().toLocaleTimeString();
      setLastMark({ type, at });
      toast.success(`Marked ${type} at ${at}`);
    } catch (err: any) {
      toast.error(
        err?.message ?? "Could not mark attendance. Please try again."
      );
    } finally {
      setLoading(null);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("employeeId");
    router.replace("/employee/login");
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-white">
        <div className="mx-auto grid max-w-5xl gap-6 p-6 md:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Attendance</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium">{employeeId}</span>
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign out of this device</TooltipContent>
            </Tooltip>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Clock */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-emerald-600" /> Time
                </CardTitle>
                <span className="text-sm text-muted-foreground">{dateStr}</span>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-4xl font-bold tracking-tight">
                  {timeStr}
                </div>
                <div className="rounded-lg border bg-emerald-50 px-3 py-2 text-emerald-800">
                  {lastMark ? (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Last:{" "}
                      <span className="font-semibold">
                        {lastMark.type}
                      </span> at {lastMark.at}
                    </div>
                  ) : (
                    <div className="text-sm text-emerald-800/80">
                      No action yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-emerald-600" /> Mark
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button
                  className="h-11 bg-emerald-600 hover:bg-emerald-600/90"
                  disabled={loading !== null}
                  onClick={() => mark("IN")}
                >
                  {loading === "IN" ? "Marking IN..." : "Mark IN"}
                </Button>
                <Button
                  className="h-11"
                  variant="secondary"
                  disabled={loading !== null}
                  onClick={() => mark("OUT")}
                >
                  {loading === "OUT" ? "Marking OUT..." : "Mark OUT"}
                </Button>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Your action is saved immediately with your employee ID.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}

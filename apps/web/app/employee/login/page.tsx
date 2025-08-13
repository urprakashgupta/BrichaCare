"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Shield,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  // Caps Lock detection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      setCapsLock(e.getModifierState?.("CapsLock") ?? false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  const canSubmit =
    empId.trim().length >= 3 && password.length >= 3 && !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: empId.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Invalid credentials");
      }

      const { token } = await res.json();
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem("token", token);
      storage.setItem("employeeId", empId.trim());

      toast.success(`Welcome! Signed in as ${empId.toUpperCase()}.`);
      router.push("/employee/dashboard");
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-white">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Left visuals */}
          <section className="relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/40 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl"
            />

            <div className="relative z-10 flex h-full flex-col">
              <header className="flex items-center justify-between p-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">Employee Board</div>
                </div>
                <div className="rounded-lg border bg-muted p-2">
                  <BadgeCheck className="h-5 w-5 text-emerald-600" />
                </div>
              </header>

              <div className="relative mx-auto grid max-w-xl flex-1 place-items-center px-6 py-10 sm:px-10">
                <div className="w-full">
                  <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                        <User2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          Hello, Teammate
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Secure workspace access
                        </div>
                      </div>
                    </div>

                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-white/70">
                      <Image
                        src="/placeholder-benzj.png"
                        alt="Team"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <MiniStat label="Attendance" value="—" tone="emerald" />
                      <MiniStat label="Shifts" value="—" tone="teal" />
                      <MiniStat label="Tasks" value="—" tone="lime" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Login form */}
          <section className="flex items-center justify-center p-6 sm:p-10">
            <Card className="w-full max-w-md border-emerald-100 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                    <CardDescription>
                      Enter your credentials to access the board.
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="rounded-lg border bg-muted p-2">
                        <BadgeCheck className="h-5 w-5 text-emerald-600" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Your data is encrypted at rest.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={onSubmit} className="grid gap-4">
                  {/* EMP ID */}
                  <div className="grid gap-2">
                    <Label htmlFor="emp-id" className="flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      Employee ID
                    </Label>
                    <Input
                      id="emp-id"
                      placeholder="EMP01"
                      autoCapitalize="characters"
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value.toUpperCase())}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
                        #{empId || "EMP-ID"}
                      </span>
                      <span className="hidden sm:inline">
                        Shown on your badge
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Fingerprint className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(capsLock && "pr-24")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      {capsLock && (
                        <div className="pointer-events-none absolute right-10 top-2 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                          CAPS ON
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Remember device */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 text-emerald-600" />
                      Remember this device
                    </div>
                    <Switch checked={remember} onCheckedChange={setRemember} />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="mt-2 h-11 text-base"
                  >
                    {loading ? (
                      "Verifying…"
                    ) : (
                      <>
                        Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    By continuing you agree to the company usage policy.
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </TooltipProvider>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "teal" | "lime";
}) {
  const toneMap = {
    emerald: "from-emerald-100 to-emerald-50 text-emerald-900",
    teal: "from-teal-100 to-teal-50 text-teal-900",
    lime: "from-lime-100 to-lime-50 text-lime-900",
  } as const;
  return (
    <div
      className={cn("rounded-xl border bg-gradient-to-br p-3", toneMap[tone])}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

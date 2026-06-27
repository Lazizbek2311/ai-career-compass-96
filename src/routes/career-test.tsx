import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeCareer } from "@/lib/career.functions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  User,
  Heart,
  BookOpen,
  Brain,
  Gauge,
  Target,
  CheckCircle2,
  Cpu,
  Code2,
  Sigma,
  Briefcase,
  Stethoscope,
  Wrench,
  Palette,
  DollarSign,
  Megaphone,
  GraduationCap,
  Scale,
  FlaskConical,
  ShieldCheck,
  Bot,
  Atom,
  TestTube,
  Leaf,
  Globe2,
  History,
  Languages,
  BookText,
  TrendingUp,
  Star,
  Check,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/career-test")({
  head: () => ({
    meta: [
      { title: "AI Career Test — CareerAI" },
      {
        name: "description",
        content:
          "Take the AI-powered career assessment to discover your perfect career path based on your interests, personality, and skills.",
      },
    ],
  }),
  component: CareerTestPage,
});

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Interests", icon: Heart },
  { id: 3, title: "Subjects", icon: BookOpen },
  { id: 4, title: "Personality", icon: Brain },
  { id: 5, title: "Skills", icon: Gauge },
  { id: 6, title: "Goals", icon: Target },
  { id: 7, title: "Review", icon: CheckCircle2 },
];

const INTERESTS = [
  { label: "Artificial Intelligence", icon: Cpu },
  { label: "Programming", icon: Code2 },
  { label: "Mathematics", icon: Sigma },
  { label: "Business", icon: Briefcase },
  { label: "Medicine", icon: Stethoscope },
  { label: "Engineering", icon: Wrench },
  { label: "Design", icon: Palette },
  { label: "Finance", icon: DollarSign },
  { label: "Marketing", icon: Megaphone },
  { label: "Teaching", icon: GraduationCap },
  { label: "Psychology", icon: Brain },
  { label: "Law", icon: Scale },
  { label: "Science", icon: FlaskConical },
  { label: "Cybersecurity", icon: ShieldCheck },
  { label: "Robotics", icon: Bot },
];

const SUBJECTS = [
  { label: "Mathematics", icon: Sigma },
  { label: "Physics", icon: Atom },
  { label: "Chemistry", icon: TestTube },
  { label: "Biology", icon: Leaf },
  { label: "English", icon: Languages },
  { label: "History", icon: History },
  { label: "Geography", icon: Globe2 },
  { label: "Computer Science", icon: Code2 },
  { label: "Economics", icon: TrendingUp },
  { label: "Literature", icon: BookText },
];

const PERSONALITY_QUESTIONS = [
  "I enjoy solving difficult problems.",
  "I like working with people.",
  "I enjoy creating new ideas.",
  "I prefer leading a team.",
  "I enjoy analyzing data.",
  "I like building things.",
];

const ANSWERS = [
  "Strongly Agree",
  "Agree",
  "Neutral",
  "Disagree",
  "Strongly Disagree",
];

const SKILLS = [
  "Communication",
  "Leadership",
  "Creativity",
  "Programming",
  "Mathematics",
  "English",
  "Teamwork",
  "Critical Thinking",
];

type FormState = {
  fullName: string;
  age: string;
  country: string;
  education: string;
  grade: string;
  interests: string[];
  subjects: string[];
  personality: Record<string, string>;
  skills: Record<string, number>;
  preferredCountry: string;
  expectedSalary: string;
  workMode: string;
  companyType: string;
  workLifeBalance: number;
};

const initialState: FormState = {
  fullName: "",
  age: "",
  country: "",
  education: "",
  grade: "",
  interests: [],
  subjects: [],
  personality: {},
  skills: SKILLS.reduce((acc, s) => ({ ...acc, [s]: 3 }), {}),
  preferredCountry: "",
  expectedSalary: "",
  workMode: "",
  companyType: "",
  workLifeBalance: 7,
};

function CareerTestPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(initialState);
  const progress = Math.round((step / STEPS.length) * 100);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleArray = (key: "interests" | "subjects", value: string) =>
    setData((d) => ({
      ...d,
      [key]: d[key].includes(value)
        ? d[key].filter((v) => v !== value)
        : [...d[key], value],
    }));

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const navigate = useNavigate();
  const analyze = useServerFn(analyzeCareer);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyze({ data });
      localStorage.setItem("careerai:report", JSON.stringify(result));
      toast.success("Your AI career report is ready!");
      navigate({ to: "/my-results" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      toast.error(msg.includes("402") ? "AI credits exhausted. Please add credits to continue." : msg.includes("429") ? "Rate limited. Please try again in a moment." : "Could not generate report. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="relative mx-auto max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3 text-[var(--brand)]" />
            AI Career Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Discover Your <span className="gradient-text">Perfect Path</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Answer a few questions and our AI will craft a tailored career plan for you.
          </p>
        </div>


        {/* Progress */}
        <div className="glass rounded-2xl p-5 mb-6 shadow-elegant">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">
              Step {step} of {STEPS.length} —{" "}
              <span className="text-muted-foreground font-normal">
                {STEPS[step - 1].title}
              </span>
            </p>
            <p className="text-sm font-semibold gradient-text">{progress}%</p>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="mt-5 grid grid-cols-7 gap-2">
            {STEPS.map((s) => {
              const done = s.id < step;
              const active = s.id === step;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-xl border transition-all ${
                      active
                        ? "gradient-brand text-white border-transparent shadow-glow"
                        : done
                          ? "bg-accent text-foreground border-transparent"
                          : "bg-background text-muted-foreground border-border group-hover:border-foreground/30"
                    }`}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs text-center leading-tight ${
                      active ? "font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-6 sm:p-8 shadow-elegant"
          >
            {step === 1 && <Step1 data={data} update={update} />}
            {step === 2 && (
              <Step2
                selected={data.interests}
                toggle={(v) => toggleArray("interests", v)}
              />
            )}
            {step === 3 && (
              <Step3
                selected={data.subjects}
                toggle={(v) => toggleArray("subjects", v)}
              />
            )}
            {step === 4 && (
              <Step4
                values={data.personality}
                onChange={(q, v) =>
                  update("personality", { ...data.personality, [q]: v })
                }
              />
            )}
            {step === 5 && (
              <Step5
                values={data.skills}
                onChange={(s, v) =>
                  update("skills", { ...data.skills, [s]: v })
                }
              />
            )}
            {step === 6 && <Step6 data={data} update={update} />}
            {step === 7 && <Step7 data={data} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={prev}
            disabled={step === 1}
            className="rounded-full h-11 px-5 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < STEPS.length ? (
            <Button
              onClick={next}
              className="rounded-full h-11 px-6 gradient-brand text-white border-0 hover:opacity-90 shadow-elegant group"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <Button
                size="lg"
                className="rounded-full h-14 px-8 text-base gradient-brand text-white border-0 hover:opacity-90 shadow-elegant group"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze with AI
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Timer className="h-3 w-3" /> About 10 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------------- Steps ---------------- */

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Step1({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      <StepHeader
        title="Tell us about yourself"
        subtitle="We'll use this to personalize your career recommendations."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Lazizbek Karimov"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="18"
            value={data.age}
            onChange={(e) => update("age", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Uzbekistan"
            value={data.country}
            onChange={(e) => update("country", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Education Level</Label>
          <Select
            value={data.education}
            onValueChange={(v) => update("education", v)}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="school">High School</SelectItem>
              <SelectItem value="bachelor">Bachelor's</SelectItem>
              <SelectItem value="master">Master's</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Current Grade / University Year</Label>
          <Input
            id="grade"
            placeholder="11th grade / 2nd year"
            value={data.grade}
            onChange={(e) => update("grade", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

function SelectableGrid({
  items,
  selected,
  toggle,
}: {
  items: { label: string; icon: React.ComponentType<{ className?: string }> }[];
  selected: string[];
  toggle: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => {
        const active = selected.includes(it.label);
        return (
          <button
            key={it.label}
            type="button"
            onClick={() => toggle(it.label)}
            className={`group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
              active
                ? "border-transparent gradient-brand text-white shadow-elegant"
                : "border-border bg-card/50 hover:border-foreground/30 hover:bg-accent"
            }`}
          >
            <div
              className={`grid h-9 w-9 place-items-center rounded-xl ${
                active ? "bg-white/20" : "bg-accent"
              }`}
            >
              <it.icon
                className={`h-4 w-4 ${active ? "text-white" : "text-foreground"}`}
              />
            </div>
            <span className="text-sm font-medium">{it.label}</span>
            {active && (
              <Check className="absolute top-3 right-3 h-4 w-4 text-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Step2({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader
        title="What interests you?"
        subtitle="Select all the areas that spark your curiosity. Choose as many as you like."
      />
      <SelectableGrid items={INTERESTS} selected={selected} toggle={toggle} />
    </div>
  );
}

function Step3({
  selected,
  toggle,
}: {
  selected: string[];
  toggle: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader
        title="Your favorite school subjects"
        subtitle="Pick the subjects you enjoy or perform best in."
      />
      <SelectableGrid items={SUBJECTS} selected={selected} toggle={toggle} />
    </div>
  );
}

function Step4({
  values,
  onChange,
}: {
  values: Record<string, string>;
  onChange: (q: string, v: string) => void;
}) {
  return (
    <div>
      <StepHeader
        title="A bit about your personality"
        subtitle="There are no wrong answers. Pick what feels most natural."
      />
      <div className="space-y-5">
        {PERSONALITY_QUESTIONS.map((q) => (
          <div key={q} className="rounded-2xl border bg-card/50 p-4 sm:p-5">
            <p className="font-medium mb-3">{q}</p>
            <RadioGroup
              value={values[q] || ""}
              onValueChange={(v) => onChange(q, v)}
              className="grid grid-cols-2 sm:grid-cols-5 gap-2"
            >
              {ANSWERS.map((a) => {
                const id = `${q}-${a}`;
                const active = values[q] === a;
                return (
                  <Label
                    key={a}
                    htmlFor={id}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-xs text-center font-medium transition-all ${
                      active
                        ? "border-transparent gradient-brand text-white shadow-elegant"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                  >
                    <RadioGroupItem id={id} value={a} className="sr-only" />
                    {a}
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5({
  values,
  onChange,
}: {
  values: Record<string, number>;
  onChange: (s: string, v: number) => void;
}) {
  return (
    <div>
      <StepHeader
        title="Rate your skills"
        subtitle="Be honest — this helps us build the most accurate roadmap."
      />
      <div className="space-y-4">
        {SKILLS.map((s) => (
          <div key={s} className="rounded-2xl border bg-card/50 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">{s}</p>
              <span className="text-xs text-muted-foreground">
                {values[s]} / 5
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = values[s] >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange(s, n)}
                    className={`flex-1 h-10 rounded-xl border transition-all flex items-center justify-center ${
                      active
                        ? "border-transparent gradient-brand shadow-elegant"
                        : "border-border bg-background hover:border-foreground/30"
                    }`}
                    aria-label={`${s} ${n}`}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        active
                          ? "text-white fill-white"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step6({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div>
      <StepHeader
        title="Your career goals"
        subtitle="Let us know where you'd like to land."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Preferred country to work</Label>
          <Input
            placeholder="USA, Germany, Uzbekistan..."
            value={data.preferredCountry}
            onChange={(e) => update("preferredCountry", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Expected salary (USD / month)</Label>
          <Input
            placeholder="3000"
            value={data.expectedSalary}
            onChange={(e) => update("expectedSalary", e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label>Remote or Office</Label>
          <Select value={data.workMode} onValueChange={(v) => update("workMode", v)}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Startup or Big Company</Label>
          <Select
            value={data.companyType}
            onValueChange={(v) => update("companyType", v)}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="big">Big Company</SelectItem>
              <SelectItem value="any">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label>Work-Life Balance importance</Label>
            <span className="text-sm font-semibold gradient-text">
              {data.workLifeBalance} / 10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={data.workLifeBalance}
            onChange={(e) =>
              update("workLifeBalance", Number(e.target.value))
            }
            className="w-full accent-[var(--brand)]"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not important</span>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step7({ data }: { data: FormState }) {
  const rows: { label: string; value: string }[] = [
    { label: "Full Name", value: data.fullName || "—" },
    { label: "Age", value: data.age || "—" },
    { label: "Country", value: data.country || "—" },
    { label: "Education", value: data.education || "—" },
    { label: "Grade / Year", value: data.grade || "—" },
    { label: "Preferred country", value: data.preferredCountry || "—" },
    { label: "Expected salary", value: data.expectedSalary ? `$${data.expectedSalary}` : "—" },
    { label: "Work mode", value: data.workMode || "—" },
    { label: "Company type", value: data.companyType || "—" },
    { label: "Work-Life balance", value: `${data.workLifeBalance} / 10` },
  ];

  return (
    <div>
      <StepHeader
        title="Review your answers"
        subtitle="Make sure everything looks right before we run the AI analysis."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Personal & Goals">
          <dl className="divide-y divide-border/60">
            {rows.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <dt className="text-muted-foreground">{r.label}</dt>
                <dd className="font-medium text-right max-w-[60%] truncate">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Interests">
          {data.interests.length ? (
            <div className="flex flex-wrap gap-2">
              {data.interests.map((i) => (
                <span
                  key={i}
                  className="rounded-full glass px-3 py-1 text-xs font-medium"
                >
                  {i}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No interests selected.</p>
          )}
        </Section>

        <Section title="Favorite Subjects">
          {data.subjects.length ? (
            <div className="flex flex-wrap gap-2">
              {data.subjects.map((i) => (
                <span
                  key={i}
                  className="rounded-full glass px-3 py-1 text-xs font-medium"
                >
                  {i}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No subjects selected.</p>
          )}
        </Section>

        <Section title="Skills">
          <div className="space-y-2">
            {Object.entries(data.skills).map(([s, v]) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                <span className="w-32 text-muted-foreground truncate">{s}</span>
                <div className="flex-1 h-2 rounded-full bg-accent overflow-hidden">
                  <div
                    className="h-full gradient-brand rounded-full"
                    style={{ width: `${(v / 5) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-xs font-semibold text-right">
                  {v}/5
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Personality" wide>
          {Object.keys(data.personality).length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {PERSONALITY_QUESTIONS.map((q) => (
                <div
                  key={q}
                  className="rounded-xl border bg-background/60 p-3 text-sm"
                >
                  <p className="text-muted-foreground text-xs">{q}</p>
                  <p className="font-medium mt-1">
                    {data.personality[q] || "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No personality answers yet.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card/50 p-5 ${wide ? "lg:col-span-2" : ""}`}
    >
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

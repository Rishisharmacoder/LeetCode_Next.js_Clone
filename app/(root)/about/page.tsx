import Link from "next/link";
import { ArrowRight, Code2, Rocket, Target, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    icon: Code2,
    title: "Practice real problems",
    description:
      "Solve coding challenges in a clean and focused environment built for daily learning.",
  },
  {
    icon: Target,
    title: "Track your progress",
    description:
      "Monitor your performance, revisit past submissions, and build momentum over time.",
  },
  {
    icon: Users,
    title: "Learn with others",
    description:
      "Grow alongside a developer community that values consistency, mentorship, and improvement.",
  },
  {
    icon: Rocket,
    title: "Build stronger skills",
    description:
      "Develop a sharper understanding of algorithms, problem-solving, and clean coding patterns.",
  },
];

const stats = [
  { value: "500+", label: "Problems" },
  { value: "10K+", label: "Developers" },
  { value: "24/7", label: "Practice" },
  { value: "98%", label: "Motivation" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-32 px-4">
      <div className="mx-auto max-w-6xl">
        <section className="mb-20 text-center">
          <Badge
            variant="secondary"
            className="mb-6 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
          >
            About us
          </Badge>

          <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-6xl">
            Learn, practice, and level up your coding skills.
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
            This platform is designed to help developers improve through
            real-world problem solving, focused practice, and measurable progress.
            Whether you are just starting or preparing for technical interviews,
            it gives you the tools to keep learning every day.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white/80 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-neutral-900/60"
            >
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Our mission
            </p>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Build everyday confidence through consistent coding practice.
            </h2>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
              We believe coding is a skill that improves with repetition,
              curiosity, and discipline. Our goal is to make that process simple,
              engaging, and motivating for developers at every level.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              From beginner concepts to advanced problem-solving, the experience is
              designed to keep you moving forward with clear challenges and practical
              feedback.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-indigo-50 p-8 shadow-lg dark:border-amber-900 dark:from-amber-950/60 dark:to-indigo-950/60">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Why this platform exists
            </h3>
            <ul className="space-y-4 text-gray-700 dark:text-gray-200">
              <li>• Focus on hands-on problem-solving over theory alone.</li>
              <li>• Encourages steady progress instead of random practice.</li>
              <li>• Helps learners build interview-ready technical confidence.</li>
            </ul>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Highlights
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              What makes this experience valuable
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="border-gray-200 bg-white/80 shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:border-gray-800 dark:bg-neutral-900/60"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-gray-200 bg-white/80 px-8 py-10 text-center shadow-sm dark:border-gray-800 dark:bg-neutral-900/60">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Ready to start solving?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Jump into the practice arena and begin improving your coding skills with
            every challenge you solve.
          </p>

          <Link href="/problems">
            <Button className="bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-500">
              Explore Problems
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}

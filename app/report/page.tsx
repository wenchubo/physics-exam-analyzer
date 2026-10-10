"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  LoaderCircle,
  Target,
} from "lucide-react";

type Question = {
  number?: number | string;
  questionNumber?: number | string;
  studentAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean | null;
  score?: number | string | null;
  knowledgePoint?: string;
  errorReason?: string;
  suggestion?: string;
  analysis?: string;
};

type AnalysisReport = {
  questions?: Question[];
  uncertainItems?: string[];
  generalAdvice?: string | string[];
  error?: string;
};

export default function ReportPage() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("physics-analysis");

      if (saved) {
        setReport(JSON.parse(saved) as AnalysisReport);
      }
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <LoaderCircle className="animate-spin text-blue-600" size={28} />
        <span className="ml-3 text-gray-500">正在读取分析报告……</span>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20">
        <a href="/" className="text-sm text-blue-600 hover:underline">
          ← 返回首页
        </a>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={36} />
          <h1 className="text-2xl font-bold">暂时没有分析报告</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            请先返回首页上传答题卡，完成分析后再查看报告。
          </p>

          <a
            href="/"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            上传答题卡
          </a>
        </div>
      </main>
    );
  }

  const questions = report.questions ?? [];
  const uncertainItems = report.uncertainItems ?? [];
  const advice = report.generalAdvice;

  const adviceList = Array.isArray(advice)
    ? advice
    : advice
      ? [advice]
      : [];

  const confirmedErrors = questions.filter(
    (question) => question.isCorrect === false
  );

  return (
    <main className="min-h-screen bg-[#fafbfc] text-[#172033]">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a href="/" className="text-sm text-gray-500 hover:text-blue-600">
            <ArrowLeft className="mr-2 inline" size={17} />
            返回首页
          </a>

          <span className="font-bold">物理 AI 智批</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
            <CheckCircle2 size={18} />
            分析结果已生成
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            你的物理学习报告
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            以下内容来自 AI 对上传图片的初步识别。请结合原试卷、标准答案和老师的批改结果核对。
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <BookOpen className="mb-4 text-blue-600" size={24} />
            <p className="text-sm text-gray-500">识别题目数</p>
            <p className="mt-2 text-3xl font-bold">{questions.length}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <CircleAlert className="mb-4 text-orange-500" size={24} />
            <p className="text-sm text-gray-500">AI 初步判断错误数</p>
            <p className="mt-2 text-3xl font-bold">
              {confirmedErrors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <Target className="mb-4 text-purple-600" size={24} />
            <p className="text-sm text-gray-500">待核对项目</p>
            <p className="mt-2 text-3xl font-bold">
              {uncertainItems.length}
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-bold">题目分析</h2>

          {questions.length === 0 ? (
            <p className="text-sm leading-6 text-gray-500">
              暂时没有识别到题目。请检查图片是否清晰，并确保题号、答案和批改痕迹能够看清。
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => {
                const number =
                  question.number ?? question.questionNumber ?? index + 1;

                return (
                  <article
                    key={`${number}-${index}`}
                    className="rounded-xl border border-gray-100 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold">第 {number} 题</h3>

                      {question.isCorrect === true ? (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                          初步判断正确
                        </span>
                      ) : question.isCorrect === false ? (
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-700">
                          初步判断错误
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          尚未确认
                        </span>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">学生答案</p>
                        <p className="mt-2 break-words text-sm">
                          {question.studentAnswer || "暂未识别"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">参考答案</p>
                        <p className="mt-2 break-words text-sm">
                          {question.correctAnswer || "尚未核对"}
                        </p>
                      </div>
                    </div>

                    {question.knowledgePoint && (
                      <p className="mt-4 text-sm">
                        <span className="text-gray-500">相关知识点：</span>
                        {question.knowledgePoint}
                      </p>
                    )}

                    {question.errorReason && (
                      <p className="mt-3 text-sm leading-6">
                        <span className="text-gray-500">可能的错误原因：</span>
                        {question.errorReason}
                      </p>
                    )}

                    {question.suggestion && (
                      <p className="mt-3 text-sm leading-6">
                        <span className="text-gray-500">改进建议：</span>
                        {question.suggestion}
                      </p>
                    )}

                    {question.analysis && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {question.analysis}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <CircleAlert className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold">需要人工核对</h2>
          </div>

          {uncertainItems.length === 0 ? (
            <p className="text-sm leading-6 text-gray-500">
              AI 没有额外列出待核对项目。但这不代表所有识别结果都准确，仍应与原卷核对。
            </p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
              {uncertainItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Lightbulb className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold">学习建议</h2>
          </div>

          {adviceList.length > 0 ? (
            <ul className="space-y-3 text-sm leading-6 text-gray-700">
              {adviceList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-gray-600">
              当前没有生成学习建议。完成题库匹配和知识点分析后，这里可以进一步展示针对性的复习方向。
            </p>
          )}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/practice"
            className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700"
          >
            开始专项练习
          </a>

          <a
            href="/"
            className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-4 font-semibold hover:bg-gray-50"
          >
            返回首页
          </a>
        </div>
      </section>
    </main>
  );
}

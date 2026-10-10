"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";

type PracticeQuestion = {
  number: number;
  type: string;
  question: string;
  answer: string;
  explanation: string;
  knowledgePoint: string;
};

export default function PracticePage() {
  const [knowledgePoints, setKnowledgePoints] = useState("");
  const [count, setCount] = useState("10");
  const [customCount, setCustomCount] = useState("15");
  const [difficulty, setDifficulty] = useState("接近原试卷");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>(
    {}
  );

  async function generateQuestions() {
    const actualCount = count === "custom" ? Number(customCount) : Number(count);

    if (!Number.isInteger(actualCount) || actualCount < 1 || actualCount > 50) {
      setError("题目数量必须是 1 到 50 之间的整数。");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setShowAnswers({});

    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: actualCount,
          knowledgePoints: knowledgePoints.trim(),
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成练习题失败，请稍后重试。");
      }

      if (!Array.isArray(data.questions)) {
        throw new Error("返回的数据格式不正确，请稍后重试。");
      }

      setQuestions(data.questions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "发生未知错误，请稍后重试。"
      );
    } finally {
      setLoading(false);
    }
  }

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

      <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
            <Sparkles size={18} />
            个性化练习
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            把不会的知识点，
            <br />
            <span className="text-blue-600">练到真正掌握。</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            选择知识点和练习数量，生成对应的高中物理练习题。每道题都附有参考答案和解析。
          </p>
        </div>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <label className="mb-3 block font-semibold">
            <Target className="mr-2 inline text-blue-600" size={19} />
            想练习哪些知识点？
          </label>

          <textarea
            value={knowledgePoints}
            onChange={(event) => setKnowledgePoints(event.target.value)}
            placeholder="例如：加速度、匀变速直线运动、速度—时间图像。也可以留空。"
            className="min-h-28 w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
          />

          <div className="mt-7">
            <label className="mb-3 block font-semibold">
              <BookOpen className="mr-2 inline text-blue-600" size={19} />
              你想做多少道题？
            </label>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {["5", "10", "20", "30", "custom"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCount(value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    count === value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {value === "custom" ? "自定义" : `${value} 道`}
                </button>
              ))}
            </div>

            {count === "custom" && (
              <div className="mt-4">
                <label
                  htmlFor="custom-count"
                  className="mb-2 block text-sm text-gray-600"
                >
                  输入题目数量（1—50）
                </label>

                <input
                  id="custom-count"
                  type="number"
                  min="1"
                  max="50"
                  value={customCount}
                  onChange={(event) => setCustomCount(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-400"
                />
              </div>
            )}
          </div>

          <div className="mt-7">
            <label
              htmlFor="difficulty"
              className="mb-3 block font-semibold"
            >
              练习难度
            </label>

            <div className="relative">
              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-blue-400"
              >
                <option>基础巩固</option>
                <option>接近原试卷</option>
                <option>综合提升</option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-400">
              难度由 AI 根据要求生成，实际难度仍需结合题目核对；接入完整原卷题库后，才能更可靠地对齐试卷难度。
            </p>
          </div>

          <button
            type="button"
            onClick={generateQuestions}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={19} />
                正在生成练习题……
              </>
            ) : (
              <>
                <Sparkles size={19} />
                生成我的练习题
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-600">
              {error}
            </p>
          )}
        </section>

        {questions.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">本次练习</h2>
              <span className="text-sm text-gray-500">
                共 {questions.length} 道题
              </span>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const number = question.number ?? index + 1;
                const isOpen = Boolean(showAnswers[number]);

                return (
                  <article
                    key={`${number}-${index}`}
                    className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        第 {number} 题
                      </span>

                      {question.type && (
                        <span className="text-xs text-gray-400">
                          {question.type}
                        </span>
                      )}
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
                      {question.question}
                    </div>

                    {question.knowledgePoint && (
                      <p className="mt-4 text-xs text-gray-400">
                        知识点：{question.knowledgePoint}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setShowAnswers((previous) => ({
                          ...previous,
                          [number]: !previous[number],
                        }))
                      }
                      className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {isOpen ? "收起答案解析" : "查看答案解析"}
                      {isOpen ? (
                        <ChevronUp size={17} />
                      ) : (
                        <ChevronDown size={17} />
                      )}
                    </button>

                    {isOpen && (
                      <div className="mt-4 space-y-4 rounded-xl bg-gray-50 p-4">
                        <div>
                          <h3 className="mb-2 text-sm font-semibold">
                            参考答案
                          </h3>
                          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                            {question.answer || "暂未提供参考答案"}
                          </p>
                        </div>

                        <div>
                          <h3 className="mb-2 text-sm font-semibold">
                            解题解析
                          </h3>
                          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                            {question.explanation || "暂未提供解题解析"}
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

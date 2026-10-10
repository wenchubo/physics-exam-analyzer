"use client";

import { useEffect, useState } from "react";

const bank = [
  {
    question: "关于质点，下列说法正确的是？",
    options: [
      "A. 任何物体都能看作质点",
      "B. 研究地球公转时，地球可以看作质点",
      "C. 质点没有质量",
      "D. 质点是不存在的物体",
    ],
    answer: "B",
    explanation:
      "当物体的大小和形状对研究问题的影响可以忽略时，可以将物体看作质点。",
    knowledgePoint: "质点",
  },
  {
    question: "下列物理量中，属于矢量的是？",
    options: ["A. 时间", "B. 路程", "C. 位移", "D. 速率"],
    answer: "C",
    explanation:
      "位移既有大小，又有方向，是矢量；时间、路程和速率是标量。",
    knowledgePoint: "位移",
  },
  {
    question:
      "某物体在 4 s 内由静止加速到 12 m/s，其平均加速度是多少？",
    options: [
      "A. 2 m/s²",
      "B. 3 m/s²",
      "C. 4 m/s²",
      "D. 48 m/s²",
    ],
    answer: "B",
    explanation: "a=(v-v₀)/t=(12-0)/4=3 m/s²。",
    knowledgePoint: "加速度",
  },
  {
    question: "关于速度和加速度，下列说法正确的是？",
    options: [
      "A. 速度越大，加速度一定越大",
      "B. 速度变化越大，加速度一定越大",
      "C. 加速度描述速度变化的快慢",
      "D. 加速度为零，速度一定为零",
    ],
    answer: "C",
    explanation:
      "加速度描述速度变化的快慢。速度大不代表加速度大，加速度为零时速度可以不为零。",
    knowledgePoint: "加速度",
  },
  {
    question:
      "物体做匀变速直线运动，初速度为 2 m/s，加速度为 3 m/s²，3 s 末速度是多少？",
    options: [
      "A. 5 m/s",
      "B. 8 m/s",
      "C. 9 m/s",
      "D. 11 m/s",
    ],
    answer: "D",
    explanation: "由 v=v₀+at，得 v=2+3×3=11 m/s。",
    knowledgePoint: "匀变速直线运动",
  },
  {
    question:
      "自由落体运动的物体，在不计空气阻力时，其加速度如何？",
    options: [
      "A. 越来越大",
      "B. 越来越小",
      "C. 始终为零",
      "D. 始终为重力加速度 g",
    ],
    answer: "D",
    explanation:
      "自由落体运动只受重力作用，加速度始终为重力加速度 g。",
    knowledgePoint: "自由落体",
  },
  {
    question:
      "一物体受到两个同一直线、同方向的力，大小分别为 3 N 和 5 N，合力大小是多少？",
    options: ["A. 2 N", "B. 3 N", "C. 5 N", "D. 8 N"],
    answer: "D",
    explanation:
      "同一直线上同方向的两个力，合力大小等于二力之和：3+5=8 N。",
    knowledgePoint: "力的合成",
  },
  {
    question: "关于弹力，下列说法正确的是？",
    options: [
      "A. 只有弹簧才能产生弹力",
      "B. 相互接触的物体之间一定有弹力",
      "C. 弹力是物体发生弹性形变时产生的相互作用",
      "D. 弹力方向总是竖直向下",
    ],
    answer: "C",
    explanation:
      "弹力与物体间的弹性形变有关，方向与形变情况及接触方式有关。",
    knowledgePoint: "弹力",
  },
  {
    question: "物体做匀速直线运动时，其加速度是多少？",
    options: [
      "A. 0",
      "B. 1 m/s²",
      "C. 与速度相等",
      "D. 不一定",
    ],
    answer: "A",
    explanation:
      "匀速直线运动的速度大小和方向均不变，因此加速度为零。",
    knowledgePoint: "匀速直线运动",
  },
  {
    question:
      "一物体从静止开始做匀加速直线运动，加速度为 2 m/s²，2 s 内位移是多少？",
    options: ["A. 2 m", "B. 4 m", "C. 6 m", "D. 8 m"],
    answer: "B",
    explanation:
      "由 x=v₀t+½at²，得 x=0+½×2×2²=4 m。",
    knowledgePoint: "位移公式",
  },
];

type Question = (typeof bank)[number];

type WrongRecord = {
  question: Question;
  userAnswer: string;
  wrongCount: number;
  lastWrongAt: string;
};

const STORAGE_KEY = "physics-ai-wrong-book-v1";

export default function PracticePage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("5");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const [wrongRecords, setWrongRecords] = useState<WrongRecord[]>([]);
  const [showWrongBook, setShowWrongBook] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 读取浏览器中已经保存的错题
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setWrongRecords(parsed as WrongRecord[]);
        }
      }
    } catch {
      console.error("读取错题本失败。");
    } finally {
      setHydrated(true);
    }
  }, []);

  // 数据加载完成后，自动保存错题
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongRecords));
    } catch {
      setMessage("错题保存失败，请检查浏览器的存储设置。");
    }
  }, [wrongRecords, hydrated]);

  // 根据知识点筛选题目
  function generateQuestions() {
    const keywords = topic
      .trim()
      .toLowerCase()
      .split(/[，,、\s]+/)
      .filter(Boolean);

    const matched = bank.filter(
      (q) =>
        keywords.length === 0 ||
        keywords.some((word) =>
          (
            q.knowledgePoint +
            q.question +
            q.explanation
          )
            .toLowerCase()
            .includes(word)
        )
    );

    if (matched.length === 0) {
      setQuestions([]);
      setMessage(
        "暂时没有匹配的题目。试试输入“加速度”“位移”或“弹力”。"
      );
      return;
    }

    const amount = Math.min(Number(count), matched.length);

    setQuestions(matched.slice(0, amount));
    setAnswers({});
    setShowAnswers(false);
    setHasSubmitted(false);
    setMessage(`已生成 ${amount} 道练习题。`);
  }

  // 提交答案并自动记录错题
  function submitAnswers() {
    if (hasSubmitted) {
      setShowAnswers(true);
      return;
    }

    const incorrect = questions.filter(
      (q, i) => answers[i] !== q.answer
    );

    const now = new Date().toISOString();

    setWrongRecords((previous) => {
      const updated = [...previous];

      incorrect.forEach((q) => {
        const existingIndex = updated.findIndex(
          (record) => record.question.question === q.question
        );

        const userAnswer =
          questions.findIndex(
            (item) => item.question === q.question
          ) >= 0
            ? answers[
                questions.findIndex(
                  (item) => item.question === q.question
                )
              ] || "未作答"
            : "未作答";

        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            userAnswer,
            wrongCount: updated[existingIndex].wrongCount + 1,
            lastWrongAt: now,
          };
        } else {
          updated.push({
            question: q,
            userAnswer,
            wrongCount: 1,
            lastWrongAt: now,
          });
        }
      });

      return updated;
    });

    const correctCount = questions.length - incorrect.length;

    setHasSubmitted(true);
    setShowAnswers(true);
    setMessage(
      `本次答对 ${correctCount} 道，答错 ${incorrect.length} 道。错题已自动记录。`
    );
  }

  // 从错题本中移除已经掌握的题目
  function removeWrongQuestion(questionText: string) {
    setWrongRecords((previous) =>
      previous.filter(
        (record) => record.question.question !== questionText
      )
    );
  }

  // 将错题重新加入当前练习
  function reviewWrongQuestion(record: WrongRecord) {
    setQuestions([record.question]);
    setAnswers({});
    setShowAnswers(false);
    setHasSubmitted(false);
    setShowWrongBook(false);
    setMessage("已载入错题，请重新作答。");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 统计各知识点错题数量
  const topicStats = wrongRecords.reduce<Record<string, number>>(
    (stats, record) => {
      const point = record.question.knowledgePoint;
      stats[point] = (stats[point] || 0) + 1;
      return stats;
    },
    {}
  );

  const score = questions.filter(
    (q, i) => answers[i] === q.answer
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <a
          href="/physics-exam-analyzer/"
          className="text-blue-600 hover:underline"
        >
          ← 返回首页
        </a>

        <h1 className="mt-8 text-3xl font-bold">
          高中物理个性化练习
        </h1>

        <p className="mt-3 leading-7 text-slate-500">
          练习、订正、记录错题，逐步找到自己的知识漏洞。
        </p>

        {/* 错题统计 */}
        <section className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">错题总数</p>
            <p className="mt-2 text-3xl font-bold text-red-500">
              {wrongRecords.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">累计答对</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {hasSubmitted ? score : "—"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              当前练习的答对题数
            </p>
          </div>
        </section>

        {/* 知识点诊断 */}
        {Object.keys(topicStats).length > 0 && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">错题知识点统计</h2>

            <div className="mt-4 space-y-4">
              {Object.entries(topicStats)
                .sort((a, b) => b[1] - a[1])
                .map(([point, total]) => (
                  <div key={point}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{point}</span>
                      <span className="text-red-500">
                        {total} 道
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-red-400"
                        style={{
                          width: `${
                            (total / wrongRecords.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* 练习设置 */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">生成练习</h2>

          <label className="mt-5 block font-semibold">
            练习知识点
          </label>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：加速度、位移、弹力；留空表示全部"
            className="mt-3 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
          />

          <label className="mt-5 block font-semibold">
            题目数量
          </label>

          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3"
          >
            <option value="5">5 道</option>
            <option value="10">10 道</option>
          </select>

          <button
            onClick={generateQuestions}
            className="mt-6 w-full rounded-xl bg-blue-600 p-4 font-semibold text-white transition hover:bg-blue-700"
          >
            生成练习题
          </button>

          {message && (
            <p className="mt-4 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-700">
              {message}
            </p>
          )}
        </section>

        {/* 题目列表 */}
        {questions.length > 0 && (
          <section className="mt-8 space-y-5">
            {questions.map((q, i) => (
              <article
                key={`${q.question}-${i}`}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-blue-600">
                  {q.knowledgePoint}
                </p>

                <h2 className="mt-2 font-semibold leading-7">
                  第 {i + 1} 题：{q.question}
                </h2>

                <div className="mt-4 space-y-3">
                  {q.options.map((option) => {
                    const selected = answers[i] === option[0];
                    const isCorrect = option[0] === q.answer;

                    let optionStyle =
                      "flex cursor-pointer gap-3 rounded-xl border p-3 transition ";

                    if (showAnswers && isCorrect) {
                      optionStyle +=
                        "border-green-300 bg-green-50 ";
                    } else if (
                      showAnswers &&
                      selected &&
                      !isCorrect
                    ) {
                      optionStyle +=
                        "border-red-300 bg-red-50 ";
                    } else {
                      optionStyle +=
                        "border-slate-200 hover:bg-slate-50 ";
                    }

                    return (
                      <label key={option} className={optionStyle}>
                        <input
                          type="radio"
                          name={`question-${i}`}
                          checked={selected}
                          disabled={hasSubmitted}
                          onChange={() =>
                            setAnswers((old) => ({
                              ...old,
                              [i]: option[0],
                            }))
                          }
                          className="mt-1"
                        />

                        <span>{option}</span>

                        {showAnswers && isCorrect && (
                          <span className="ml-auto text-sm text-green-700">
                            正确答案
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {showAnswers && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold">
                      正确答案：{q.answer}
                    </p>

                    <p className="mt-2 text-sm leading-6">
                      {answers[i] === q.answer
                        ? "回答正确！继续保持。"
                        : answers[i]
                          ? `你的答案是 ${answers[i]}，请对照解析检查思路。`
                          : "你还没有作答，这道题已按未答题记录。"}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      <span className="font-semibold">解析：</span>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </article>
            ))}

            <button
              onClick={submitAnswers}
              disabled={hasSubmitted}
              className="w-full rounded-xl bg-slate-800 p-4 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {hasSubmitted
                ? "已提交，错题已记录"
                : "提交答案并自动记录错题"}
            </button>
          </section>
        )}

        {/* 错题本 */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">我的错题本</h2>
              <p className="mt-2 text-sm text-slate-500">
                已记录 {wrongRecords.length} 道错题
              </p>
            </div>

            <button
              onClick={() => setShowWrongBook(!showWrongBook)}
              className="shrink-0 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              {showWrongBook ? "收起错题本" : "查看错题"}
            </button>
          </div>

          {showWrongBook && (
            <div className="mt-6 space-y-4">
              {wrongRecords.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  暂时没有错题。完成练习并提交答案后，答错的题目会自动保存到这里。
                </p>
              ) : (
                wrongRecords.map((record) => (
                  <article
                    key={record.question.question}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-600">
                        {record.question.knowledgePoint}
                      </span>

                      <span className="text-xs text-slate-400">
                        错误次数：{record.wrongCount}
                      </span>
                    </div>

                    <h3 className="mt-3 font-semibold leading-6">
                      {record.question.question}
                    </h3>

                    <p className="mt-3 text-sm text-red-600">
                      你的上次答案：{record.userAnswer}
                    </p>

                    <p className="mt-2 text-sm text-green-700">
                      正确答案：{record.question.answer}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {record.question.explanation}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => reviewWrongQuestion(record)}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        重新练习
                      </button>

                      <button
                        onClick={() =>
                          removeWrongQuestion(
                            record.question.question
                          )
                        }
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        已掌握，移出错题本
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>

        <footer className="mt-8 pb-8 text-center text-xs leading-6 text-slate-400">
          错题记录保存在当前浏览器中。
          <br />
          当前使用内置题库，尚未接入真正的 AI 自动出题与阅卷服务。
        </footer>
      </div>
    </main>
  );
}

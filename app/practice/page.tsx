"use client";

import { useState } from "react";

const bank = [
  {
    question: "关于质点，下列说法正确的是？",
    options: ["A. 任何物体都能看作质点", "B. 研究地球公转时，地球可以看作质点", "C. 质点没有质量", "D. 质点是不存在的物体"],
    answer: "B",
    explanation: "当物体的大小和形状对研究问题的影响可以忽略时，可以将物体看作质点。",
    knowledgePoint: "质点"
  },
  {
    question: "下列物理量中，属于矢量的是？",
    options: ["A. 时间", "B. 路程", "C. 位移", "D. 速率"],
    answer: "C",
    explanation: "位移既有大小，又有方向，是矢量；时间、路程和速率是标量。",
    knowledgePoint: "位移"
  },
  {
    question: "某物体在 4 s 内由静止加速到 12 m/s，其平均加速度是多少？",
    options: ["A. 2 m/s²", "B. 3 m/s²", "C. 4 m/s²", "D. 48 m/s²"],
    answer: "B",
    explanation: "a=(v-v₀)/t=(12-0)/4=3 m/s²。",
    knowledgePoint: "加速度"
  },
  {
    question: "关于速度和加速度，下列说法正确的是？",
    options: ["A. 速度越大，加速度一定越大", "B. 速度变化越大，加速度一定越大", "C. 加速度描述速度变化的快慢", "D. 加速度为零，速度一定为零"],
    answer: "C",
    explanation: "加速度描述速度变化的快慢。速度大不代表加速度大，加速度为零时速度可以不为零。",
    knowledgePoint: "加速度"
  },
  {
    question: "物体做匀变速直线运动，初速度为 2 m/s，加速度为 3 m/s²，3 s 末速度是多少？",
    options: ["A. 5 m/s", "B. 8 m/s", "C. 9 m/s", "D. 11 m/s"],
    answer: "D",
    explanation: "由 v=v₀+at，得 v=2+3×3=11 m/s。",
    knowledgePoint: "匀变速直线运动"
  },
  {
    question: "自由落体运动的物体，在不计空气阻力时，其加速度如何？",
    options: ["A. 越来越大", "B. 越来越小", "C. 始终为零", "D. 始终为重力加速度 g"],
    answer: "D",
    explanation: "自由落体运动只受重力作用，加速度始终为重力加速度 g。",
    knowledgePoint: "自由落体"
  },
  {
    question: "一物体受到两个同一直线、同方向的力，大小分别为 3 N 和 5 N，合力大小是多少？",
    options: ["A. 2 N", "B. 3 N", "C. 5 N", "D. 8 N"],
    answer: "D",
    explanation: "同一直线上同方向的两个力，合力大小等于二力之和：3+5=8 N。",
    knowledgePoint: "力的合成"
  },
  {
    question: "关于弹力，下列说法正确的是？",
    options: ["A. 只有弹簧才能产生弹力", "B. 相互接触的物体之间一定有弹力", "C. 弹力是物体发生弹性形变时产生的相互作用", "D. 弹力方向总是竖直向下"],
    answer: "C",
    explanation: "弹力与物体间的弹性形变有关，方向与形变情况及接触方式有关。",
    knowledgePoint: "弹力"
  },
  {
    question: "物体做匀速直线运动时，其加速度是多少？",
    options: ["A. 0", "B. 1 m/s²", "C. 与速度相等", "D. 不一定"],
    answer: "A",
    explanation: "匀速直线运动的速度大小和方向均不变，因此加速度为零。",
    knowledgePoint: "匀速直线运动"
  },
  {
    question: "一物体从静止开始做匀加速直线运动，加速度为 2 m/s²，2 s 内位移是多少？",
    options: ["A. 2 m", "B. 4 m", "C. 6 m", "D. 8 m"],
    answer: "B",
    explanation: "由 x=v₀t+½at²，得 x=0+½×2×2²=4 m。",
    knowledgePoint: "位移公式"
  }
];

export default function PracticePage() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("5");
  const [questions, setQuestions] = useState<typeof bank>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [message, setMessage] = useState("");

  function generateQuestions() {
    const keywords = topic.trim().toLowerCase().split(/[，,、\s]+/).filter(Boolean);

    const matched = bank.filter((q) =>
      keywords.length === 0 ||
      keywords.some((word) =>
        (q.knowledgePoint + q.question + q.explanation).toLowerCase().includes(word)
      )
    );

    if (matched.length === 0) {
      setQuestions([]);
      setMessage("暂时没有匹配的题目。试试输入“加速度”“位移”或“弹力”，也可以清空知识点查看全部题目。");
      return;
    }

    const amount = Math.min(Number(count), matched.length);
    setQuestions(matched.slice(0, amount));
    setAnswers({});
    setShowAnswers(false);
    setMessage(`已生成 ${amount} 道练习题。当前使用内置题库，尚未接入 AI。`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800">
      <div className="mx-auto max-w-3xl">
        <a href="/physics-exam-analyzer/" className="text-blue-600">
          ← 返回首页
        </a>

        <h1 className="mt-8 text-3xl font-bold">高中物理个性化练习</h1>
        <p className="mt-3 text-slate-500">
          选择知识点，生成练习题，提交答案后查看解析。
        </p>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <label className="block font-semibold">练习知识点</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：加速度、位移、弹力；留空表示全部"
            className="mt-3 w-full rounded-xl border p-3"
          />

          <label className="mt-5 block font-semibold">题目数量</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="mt-3 w-full rounded-xl border bg-white p-3"
          >
            <option value="5">5 道</option>
            <option value="10">10 道</option>
          </select>

          <button
            onClick={generateQuestions}
            className="mt-6 w-full rounded-xl bg-blue-600 p-4 font-semibold text-white hover:bg-blue-700"
          >
            生成练习题
          </button>

          {message && <p className="mt-4 text-sm text-slate-500">{message}</p>}
        </section>

        {questions.length > 0 && (
          <section className="mt-8 space-y-5">
            {questions.map((q, i) => (
              <article key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-blue-600">{q.knowledgePoint}</p>
                <h2 className="mt-2 font-semibold">
                  第 {i + 1} 题：{q.question}
                </h2>

                <div className="mt-4 space-y-3">
                  {q.options.map((option) => (
                    <label key={option} className="flex cursor-pointer gap-3">
                      <input
                        type="radio"
                        name={`question-${i}`}
                        checked={answers[i] === option[0]}
                        onChange={() =>
                          setAnswers((old) => ({ ...old, [i]: option[0] }))
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {showAnswers && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold">
                      正确答案：{q.answer}
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {answers[i]
                        ? answers[i] === q.answer
                          ? "回答正确！"
                          : "回答错误，再看看解析。"
                        : "你还没有作答。"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      解析：{q.explanation}
                    </p>
                  </div>
                )}
              </article>
            ))}

            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="w-full rounded-xl bg-slate-800 p-4 font-semibold text-white"
            >
              {showAnswers ? "隐藏答案与解析" : "提交答案并查看解析"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

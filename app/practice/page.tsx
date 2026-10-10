"use client";

import { useEffect, useState } from "react";

type Question = {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type WrongRecord = {
  id: number;
  count: number;
  lastWrong: string;
};

const questions: Question[] = [
  {
    id: 1,
    topic: "质点与参考系",
    question: "研究下列物体的运动时，最适合将物体看成质点的是？",
    options: [
      "研究地球自转时的地球",
      "研究火车从北京到上海的运行时间",
      "研究跳水运动员的空中姿态",
      "研究足球旋转时的运动",
    ],
    answer: 1,
    explanation:
      "研究火车长距离运行时，火车的大小和形状对研究结果影响很小，可以忽略，将火车看成质点。",
  },
  {
    id: 2,
    topic: "位移与路程",
    question: "一个人绕操场一圈回到出发点，他的位移和路程分别是？",
    options: [
      "位移为零，路程为零",
      "位移不为零，路程为零",
      "位移为零，路程不为零",
      "位移和路程都不为零",
    ],
    answer: 2,
    explanation:
      "位移只由初位置和末位置决定。回到出发点，位移为零；实际经过的轨迹长度不为零。",
  },
  {
    id: 3,
    topic: "速度与加速度",
    question: "关于加速度，下列说法正确的是？",
    options: [
      "速度越大，加速度一定越大",
      "速度变化越快，加速度越大",
      "速度为零，加速度一定为零",
      "加速度方向一定与速度方向相同",
    ],
    answer: 1,
    explanation:
      "加速度描述速度变化的快慢。速度大不代表加速度大，速度为零时也可能存在加速度。",
  },
  {
    id: 4,
    topic: "匀变速直线运动",
    question: "物体做匀加速直线运动，初速度为 2 m/s，加速度为 3 m/s²，3 s 末速度为多少？",
    options: ["5 m/s", "8 m/s", "9 m/s", "11 m/s"],
    answer: 1,
    explanation:
      "根据 v = v₀ + at，代入 v = 2 + 3 × 3 = 11 m/s。注意正确答案应为 11 m/s。",
  },
  {
    id: 5,
    topic: "自由落体",
    question: "忽略空气阻力，同一地点两个不同质量的物体同时自由下落，它们的加速度？",
    options: [
      "质量大的更大",
      "质量小的更大",
      "相同，均为当地重力加速度",
      "无法确定",
    ],
    answer: 2,
    explanation:
      "自由落体运动只受重力作用，在同一地点忽略空气阻力时，所有物体的自由落体加速度相同。",
  },
  {
    id: 6,
    topic: "力的合成",
    question: "两个大小均为 3 N 的共点力，夹角为 90°，合力大小为？",
    options: ["0 N", "3 N", "3√2 N", "6 N"],
    answer: 2,
    explanation:
      "根据平行四边形定则，F = √(3² + 3²) = 3√2 N。",
  },
  {
    id: 7,
    topic: "弹力",
    question: "关于弹力，下列说法正确的是？",
    options: [
      "两个物体接触就一定有弹力",
      "弹力一定发生在接触的物体之间",
      "只有弹簧才能产生弹力",
      "物体发生形变后一定不能恢复原状",
    ],
    answer: 1,
    explanation:
      "弹力通常发生在相互接触且存在弹性形变的物体之间。仅仅接触不一定有弹力。",
  },
  {
    id: 8,
    topic: "运动图像",
    question: "在速度—时间图像中，图线与时间轴围成的面积表示什么？",
    options: ["加速度", "位移", "平均速度", "时间"],
    answer: 1,
    explanation:
      "速度—时间图像中，图线与时间轴围成的有符号面积表示位移。面积的正负与速度方向有关。",
  },
  {
    id: 9,
    topic: "匀变速直线运动",
    question: "物体从静止开始做匀加速直线运动，加速度为 2 m/s²，2 s 内的位移是多少？",
    options: ["2 m", "4 m", "6 m", "8 m"],
    answer: 1,
    explanation:
      "使用 x = v₀t + ½at²。初速度为零，所以 x = ½ × 2 × 2² = 4 m。",
  },
  {
    id: 10,
    topic: "受力分析",
    question: "水平地面上的物体静止不动，且只受重力和地面的支持力，这两个力的关系是？",
    options: [
      "重力大于支持力",
      "支持力大于重力",
      "二力平衡",
      "两个力方向相同",
    ],
    answer: 2,
    explanation:
      "物体静止且只受这两个力，因此二力大小相等、方向相反，作用在同一物体上。",
  },
];

const STORAGE_KEY = "physics-ai-wrong-book-v2";

export default function PracticePage() {
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [wrongRecords, setWrongRecords] = useState<
    Record<number, WrongRecord>
  >({});
  const [showWrongBook, setShowWrongBook] = useState(false);
  const [topicFilter, setTopicFilter] = useState("全部知识点");
  const [practiceIds, setPracticeIds] = useState<number[]>(
    questions.map((q) => q.id)
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWrongRecords(JSON.parse(saved));
      }
    } catch {
      console.error("错题本读取失败");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongRecords));
    }
  }, [wrongRecords, hydrated]);

  const currentQuestions = questions.filter((q) =>
    practiceIds.includes(q.id)
  );

  const wrongQuestions = questions.filter(
    (q) => wrongRecords[q.id] !== undefined
  );

  const topics = [
    "全部知识点",
    ...Array.from(new Set(questions.map((q) => q.topic))),
  ];

  function chooseAnswer(id: number, index: number) {
    if (submitted) return;
    setAnswers((previous) => ({ ...previous, [id]: index }));
  }

  function submitAnswers() {
    const updated = { ...wrongRecords };

    currentQuestions.forEach((q) => {
      if (answers[q.id] !== q.answer) {
        const previous = updated[q.id];
        updated[q.id] = {
          id: q.id,
          count: (previous?.count ?? 0) + 1,
          lastWrong: new Date().toLocaleString(),
        };
      }
    });

    setWrongRecords(updated);
    setSubmitted(true);
  }

  function startPractice(ids: number[]) {
    setPracticeIds(ids);
    setAnswers({});
    setSubmitted(false);
    setShowWrongBook(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeWrongQuestion(id: number) {
    const updated = { ...wrongRecords };
    delete updated[id];
    setWrongRecords(updated);
  }

  function filterTopic(topic: string) {
    setTopicFilter(topic);
    const filtered =
      topic === "全部知识点"
        ? questions
        : questions.filter((q) => q.topic === topic);

    setPracticeIds(filtered.map((q) => q.id));
    setAnswers({});
    setSubmitted(false);
    setShowWrongBook(false);
  }

  const correctCount = currentQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;

  const accuracy = currentQuestions.length
    ? Math.round((correctCount / currentQuestions.length) * 100)
    : 0;

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "16px",
  } as const;

  const buttonStyle = {
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "14px",
  } as const;

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px 16px 60px",
        color: "#172033",
        background: "#f5f7fb",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "24px" }}>
        <div style={{ color: "#2563eb", fontSize: "13px" }}>
          YAI · PHYSICS LEARNING
        </div>
        <h1 style={{ fontSize: "30px", margin: "10px 0" }}>
          物理 AI 智批
        </h1>
        <p style={{ color: "#64748b", lineHeight: 1.7 }}>
          高中物理互动练习 · 自动判分 · 错题追踪
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ fontSize: "18px", marginTop: 0 }}>学习面板</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ color: "#64748b", fontSize: "13px" }}>题库题数</div>
            <strong style={{ fontSize: "25px" }}>{questions.length}</strong>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "13px" }}>错题数量</div>
            <strong style={{ fontSize: "25px" }}>
              {hydrated ? wrongQuestions.length : "—"}
            </strong>
          </div>
          <div>
            <div style={{ color: "#64748b", fontSize: "13px" }}>本次正确率</div>
            <strong style={{ fontSize: "25px" }}>
              {submitted ? `${accuracy}%` : "待练习"}
            </strong>
          </div>
        </div>
      </section>

      <section style={{ ...cardStyle, background: "#eff6ff" }}>
        <h2 style={{ fontSize: "17px", marginTop: 0 }}>选择学习模式</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button
            style={{
              ...buttonStyle,
              background: "#2563eb",
              color: "#fff",
            }}
            onClick={() => startPractice(questions.map((q) => q.id))}
          >
            全部练习
          </button>
          <button
            style={{
              ...buttonStyle,
              background: "#fff",
            }}
            onClick={() => {
              setShowWrongBook(true);
              setSubmitted(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            📚 我的错题本（{wrongQuestions.length}）
          </button>
          <button
            style={{
              ...buttonStyle,
              background: "#fff",
            }}
            onClick={() =>
              startPractice(
                questions
                  .filter((q) => wrongRecords[q.id])
                  .map((q) => q.id)
              )
            }
          >
            重新练习错题
          </button>
        </div>
      </section>

      {showWrongBook ? (
        <section>
          <h2 style={{ fontSize: "22px" }}>📚 我的错题本</h2>
          <p style={{ color: "#64748b" }}>
            答错或未作答的题目会自动记录。记录保存在当前浏览器中。
          </p>

          {wrongQuestions.length === 0 ? (
            <div style={cardStyle}>
              <p>错题本还是空的。</p>
              <p style={{ color: "#64748b" }}>
                返回练习，答错几道题并提交，就会自动收录。
              </p>
            </div>
          ) : (
            wrongQuestions.map((q) => (
              <article key={q.id} style={cardStyle}>
                <div style={{ color: "#2563eb", fontSize: "13px" }}>
                  {q.topic} · 错误 {wrongRecords[q.id].count} 次
                </div>
                <h3 style={{ fontSize: "17px", lineHeight: 1.6 }}>
                  {q.id}. {q.question}
                </h3>
                <p>
                  正确答案：{String.fromCharCode(65 + q.answer)}.{" "}
                  {q.options[q.answer]}
                </p>
                <p style={{ color: "#475569", lineHeight: 1.7 }}>
                  解析：{q.explanation}
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    style={{ ...buttonStyle, background: "#2563eb", color: "#fff" }}
                    onClick={() => startPractice([q.id])}
                  >
                    单题重练
                  </button>
                  <button
                    style={{ ...buttonStyle, background: "#fff" }}
                    onClick={() => removeWrongQuestion(q.id)}
                  >
                    移出错题本
                  </button>
                </div>
              </article>
            ))
          )}

          <button
            style={{ ...buttonStyle, background: "#fff" }}
            onClick={() => setShowWrongBook(false)}
          >
            返回练习页面
          </button>
        </section>
      ) : (
        <>
          <section style={cardStyle}>
            <h2 style={{ fontSize: "18px", marginTop: 0 }}>知识点筛选</h2>
            <select
              value={topicFilter}
              onChange={(e) => filterTopic(e.target.value)}
              style={{
                padding: "11px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#fff",
                width: "100%",
                maxWidth: "350px",
              }}
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </section>

          <h2 style={{ fontSize: "22px" }}>开始练习</h2>
          <p style={{ color: "#64748b" }}>
            当前共 {currentQuestions.length} 道题。选完答案后点击提交。
          </p>

          {currentQuestions.length === 0 && (
            <section style={cardStyle}>
              <p>当前没有可练习的题目。</p>
              <button
                style={buttonStyle}
                onClick={() => startPractice(questions.map((q) => q.id))}
              >
                返回全部练习
              </button>
            </section>
          )}

          {currentQuestions.map((q, questionIndex) => (
            <article key={q.id} style={cardStyle}>
              <div style={{ color: "#2563eb", fontSize: "13px" }}>
                第 {questionIndex + 1} 题 · {q.topic}
              </div>

              <h3 style={{ fontSize: "17px", lineHeight: 1.8 }}>
                {q.question}
              </h3>

              <div style={{ display: "grid", gap: "10px" }}>
                {q.options.map((option, index) => {
                  const selected = answers[q.id] === index;
                  const isCorrect = q.answer === index;
                  let background = "#fff";
                  let border = "1px solid #d1d5db";

                  if (submitted && isCorrect) {
                    background = "#dcfce7";
                    border = "1px solid #16a34a";
                  } else if (submitted && selected && !isCorrect) {
                    background = "#fee2e2";
                    border = "1px solid #dc2626";
                  } else if (selected) {
                    background = "#dbeafe";
                    border = "1px solid #2563eb";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => chooseAnswer(q.id, index)}
                      disabled={submitted}
                      style={{
                        ...buttonStyle,
                        textAlign: "left",
                        background,
                        border,
                        lineHeight: 1.6,
                        cursor: submitted ? "default" : "pointer",
                      }}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "14px",
                    borderRadius: "9px",
                    background:
                      answers[q.id] === q.answer ? "#f0fdf4" : "#fff7ed",
                    lineHeight: 1.8,
                  }}
                >
                  <strong>
                    {answers[q.id] === q.answer ? "回答正确" : "回答错误"}
                  </strong>
                  <div>
                    正确答案：{String.fromCharCode(65 + q.answer)}.{" "}
                    {q.options[q.answer]}
                  </div>
                  <div>解析：{q.explanation}</div>
                  {answers[q.id] !== q.answer && (
                    <div style={{ color: "#b45309", marginTop: "6px" }}>
                      已自动记录到错题本。
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}

          {currentQuestions.length > 0 && (
            <section style={cardStyle}>
              {!submitted ? (
                <button
                  onClick={submitAnswers}
                  style={{
                    ...buttonStyle,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    padding: "13px 22px",
                  }}
                >
                  提交答案并自动记录错题
                </button>
              ) : (
                <>
                  <h2 style={{ fontSize: "22px" }}>本次练习结果</h2>
                  <p>
                    共 {currentQuestions.length} 题，答对 {correctCount} 题，
                    正确率 {accuracy}%。
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <button
                      style={{
                        ...buttonStyle,
                        background: "#2563eb",
                        color: "#fff",
                      }}
                      onClick={() =>
                        startPractice(currentQuestions.map((q) => q.id))
                      }
                    >
                      再做一次
                    </button>
                    <button
                      style={{ ...buttonStyle, background: "#fff" }}
                      onClick={() => setShowWrongBook(true)}
                    >
                      查看我的错题本
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </>
      )}

      <footer
        style={{
          color: "#94a3b8",
          fontSize: "12px",
          lineHeight: 1.8,
          textAlign: "center",
          marginTop: "30px",
        }}
      >
        当前版本使用内置物理题库。
        <br />
        错题记录保存在本机浏览器中，不会自动同步到其他设备。
        <br />
        AI 自动识别试卷、生成题目及智能阅卷功能尚未接入。
      </footer>
    </main>
  );
}

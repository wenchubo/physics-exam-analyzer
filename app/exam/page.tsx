"use client";

import { useEffect, useState } from "react";

const answerKey: Record<number, string> = {
  1: "C",
  2: "C",
  3: "D",
  4: "C",
  5: "C",
  6: "D",
  7: "A",
  8: "A",
  9: "C",
  10: "D",
  11: "D",
  12: "A",
  13: "C",
  14: "D",
  15: "C",
  16: "B",
  17: "D",
  18: "B",
  19: "D",
  20: "CD",
  21: "BCD",
  22: "BD",
  23: "BC",
  24: "AD",
};

const questions = Array.from({ length: 31 }, (_, i) => i + 1);

const topics: Record<number, string> = {
  1: "运动的描述与基本概念",
  2: "运动的描述与基本概念",
  3: "运动的描述与基本概念",
  4: "运动的描述与基本概念",
  5: "运动的描述与基本概念",
  6: "匀变速直线运动",
  7: "匀变速直线运动",
  8: "匀变速直线运动",
  9: "匀变速直线运动",
  10: "匀变速直线运动",
};

function normalizeAnswer(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "").split("").sort().join("");
}

function readNumber(value: string) {
  if (value.trim() === "") return 0;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

export default function ExamPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [earned, setEarned] = useState<Record<number, string>>({});
  const [maximum, setMaximum] = useState<Record<number, string>>({});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("physics-exam-analysis-v1");

      if (raw) {
        const data = JSON.parse(raw);
        setAnswers(data.answers || {});
        setEarned(data.earned || {});
        setMaximum(data.maximum || {});
      }
    } catch {
      console.warn("读取本地记录失败");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "physics-exam-analysis-v1",
        JSON.stringify({ answers, earned, maximum })
      );
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [answers, earned, maximum]);

  const objectiveQuestions = questions.filter((q) => q <= 24);

  const gradedQuestions = objectiveQuestions.filter(
    (q) => (answers[q] || "").trim() !== ""
  );

  const correctQuestions = gradedQuestions.filter(
    (q) => normalizeAnswer(answers[q] || "") === answerKey[q]
  );

  const wrongQuestions = gradedQuestions.filter(
    (q) => normalizeAnswer(answers[q] || "") !== answerKey[q]
  );

  const manualEarned = questions
    .filter((q) => q >= 25)
    .reduce((sum, q) => sum + readNumber(earned[q] || ""), 0);

  const manualMaximum = questions
    .filter((q) => q >= 25)
    .reduce((sum, q) => sum + readNumber(maximum[q] || ""), 0);

  function updateAnswer(q: number, value: string) {
    setAnswers((old) => ({ ...old, [q]: value }));
  }

  function toggleChoice(q: number, option: string) {
    const current = normalizeAnswer(answers[q] || "");
    const next = current.includes(option)
      ? current.replace(option, "")
      : current + option;

    updateAnswer(q, next);
  }

  function handleImages(files: FileList | null) {
    if (!files) return;

    const selected = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const urls = selected.map((file) => URL.createObjectURL(file));
    setImageUrls((old) => [...old, ...urls]);
  }

  function clearAll() {
    if (!window.confirm("确定清空全部答案和分数吗？此操作不可撤销。")) {
      return;
    }

    setAnswers({});
    setEarned({});
    setMaximum({});
    localStorage.removeItem("physics-exam-analysis-v1");
  }

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "28px 18px 60px",
        color: "#182230",
        fontFamily: "Arial, 'Microsoft YaHei', sans-serif",
      }}
    >
      <a
        href="/physics-exam-analyzer/"
        style={{ color: "#52657a", textDecoration: "none" }}
      >
        ← 返回首页
      </a>

      <header style={{ marginTop: 26, marginBottom: 28 }}>
        <p style={{ color: "#5475b5", fontWeight: 700 }}>
          PHYSICS · EXAM ANALYSIS
        </p>

        <h1 style={{ fontSize: 34, margin: "8px 0" }}>
          高一物理月考分析
        </h1>

        <p style={{ color: "#637083", lineHeight: 1.8 }}>
          录入作答、核对答案、统计失分，逐步建立自己的错题档案。
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={headingStyle}>01 / 作答图片</h2>

        <p style={paragraphStyle}>
          选择试卷或答题纸照片，可以在页面中预览。当前版本尚未接入
          OCR，图片不会自动转化为答案，需要你核对后手动填写。
        </p>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImages(e.target.files)}
          style={{ maxWidth: "100%" }}
        />

        {imageUrls.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            {imageUrls.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`作答图片 ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  border: "1px solid #d9e0e8",
                  borderRadius: 10,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section style={cardStyle}>
        <h2 style={headingStyle}>02 / 客观题答案</h2>

        <p style={paragraphStyle}>
          单选题直接选择 A、B、C、D；多选题可以同时选择多个选项。
          未填写的题目不会被统计为错误。
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {objectiveQuestions.map((q) => {
            const multi = q >= 20;
            const isFilled = (answers[q] || "").trim() !== "";
            const isCorrect =
              isFilled &&
              normalizeAnswer(answers[q] || "") === answerKey[q];

            return (
              <div
                key={q}
                style={{
                  padding: 15,
                  border: "1px solid #e0e6ed",
                  borderRadius: 12,
                  background: isFilled
                    ? isCorrect
                      ? "#f0f9f3"
                      : "#fff5f2"
                    : "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <strong>
                    第 {q} 题
                    {multi ? " · 多选题" : " · 单选题"}
                  </strong>

                  {isFilled && (
                    <span
                      style={{
                        color: isCorrect ? "#187344" : "#b54732",
                        fontSize: 14,
                      }}
                    >
                      {isCorrect ? "答案正确" : "答案不一致"}
                    </span>
                  )}
                </div>

                {multi ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 12,
                    }}
                  >
                    {["A", "B", "C", "D"].map((option) => (
                      <label
                        key={option}
                        style={{
                          padding: "8px 14px",
                          border: "1px solid #d5dde7",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: normalizeAnswer(
                            answers[q] || ""
                          ).includes(option)
                            ? "#e8efff"
                            : "#ffffff",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={normalizeAnswer(
                            answers[q] || ""
                          ).includes(option)}
                          onChange={() => toggleChoice(q, option)}
                        />{" "}
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    {["A", "B", "C", "D"].map((option) => (
                      <label
                        key={option}
                        style={{
                          padding: "8px 14px",
                          border: "1px solid #d5dde7",
                          borderRadius: 8,
                          cursor: "pointer",
                          background:
                            answers[q] === option ? "#e8efff" : "#ffffff",
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${q}`}
                          checked={answers[q] === option}
                          onChange={() => updateAnswer(q, option)}
                        />{" "}
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {isFilled && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#657386",
                      marginBottom: 0,
                    }}
                  >
                    标准答案：{answerKey[q]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={headingStyle}>03 / 实验题与计算题评分</h2>

        <p style={paragraphStyle}>
          第 25—31 题请根据老师的评分细则填写得分和满分。
          目前不自动判断这些题目的计算过程是否正确。
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          {questions.filter((q) => q >= 25).map((q) => (
            <div
              key={q}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
                alignItems: "center",
                padding: 12,
                borderBottom: "1px solid #e4e9ef",
              }}
            >
              <strong>第 {q} 题</strong>

              <label style={{ fontSize: 13 }}>
                得分
                <input
                  type="number"
                  min="0"
                  value={earned[q] ?? ""}
                  onChange={(e) =>
                    setEarned((old) => ({
                      ...old,
                      [q]: e.target.value,
                    }))
                  }
                  style={inputStyle}
                  placeholder="得分"
                />
              </label>

              <label style={{ fontSize: 13 }}>
                满分
                <input
                  type="number"
                  min="0"
                  value={maximum[q] ?? ""}
                  onChange={(e) =>
                    setMaximum((old) => ({
                      ...old,
                      [q]: e.target.value,
                    }))
                  }
                  style={inputStyle}
                  placeholder="满分"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={headingStyle}>04 / 分析报告</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          <Stat
            label="已填写客观题"
            value={`${gradedQuestions.length}/24`}
          />
          <Stat
            label="客观题答对"
            value={`${correctQuestions.length}`}
          />
          <Stat
            label="客观题答错"
            value={`${wrongQuestions.length}`}
          />
          <Stat
            label="主观题已录得分"
            value={`${manualEarned}`}
          />
        </div>

        <div style={{ marginTop: 22 }}>
          <h3>客观题错题清单</h3>

          {wrongQuestions.length === 0 ? (
            <p style={paragraphStyle}>
              {gradedQuestions.length === 0
                ? "请先填写你的答案。"
                : "目前已填写的客观题全部与标准答案一致。"}
            </p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {wrongQuestions.map((q) => (
                <div
                  key={q}
                  style={{
                    padding: 13,
                    border: "1px solid #f0d3cc",
                    borderRadius: 10,
                    background: "#fff9f7",
                  }}
                >
                  <strong>第 {q} 题</strong>

                  <p style={{ margin: "8px 0" }}>
                    你的答案：{normalizeAnswer(answers[q] || "")}
                    {"　"}标准答案：{answerKey[q]}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#657386",
                      fontSize: 13,
                    }}
                  >
                    知识点：
                    {topics[q] || "待根据原题和评分细则补充"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <h3>主观题分数统计</h3>
          <p style={paragraphStyle}>
            已录入得分：{manualEarned} 分
          </p>
          <p style={paragraphStyle}>
            已录入满分：{manualMaximum} 分
          </p>
          <p style={paragraphStyle}>
            已录入部分的失分：{Math.max(0, manualMaximum - manualEarned)} 分
          </p>
        </div>

        <p
          style={{
            color: "#657386",
            fontSize: 13,
            marginTop: 22,
          }}
        >
          当前客观题统计只计算题目数量，不代表整张试卷的实际分数。
          后续需要录入每道客观题的分值，才能计算完整总分。
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={headingStyle}>05 / 本地记录</h2>

        <p style={paragraphStyle}>
          {saved
            ? "答案和分数已尝试保存到当前浏览器。"
            : "暂时无法确认保存成功，请不要清除浏览器数据。"}
        </p>

        <p style={{ ...paragraphStyle, fontSize: 13 }}>
          当前保存的是答案和分数，不包含上传图片。图片预览仅在当前页面有效。
          更换浏览器或清除网站数据后，本地记录可能丢失。
        </p>

        <button onClick={clearAll} style={dangerButtonStyle}>
          清空本次记录
        </button>
      </section>

      <footer
        style={{
          color: "#8993a2",
          fontSize: 12,
          textAlign: "center",
          marginTop: 30,
        }}
      >
        高一物理 · 错题分析工具
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid #e0e6ed",
        borderRadius: 12,
      }}
    >
      <p style={{ color: "#657386", fontSize: 13, margin: 0 }}>
        {label}
      </p>
      <strong style={{ fontSize: 25, display: "block", marginTop: 8 }}>
        {value}
      </strong>
    </div>
  );
}

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e0e6ed",
  borderRadius: 16,
  padding: 20,
  marginBottom: 20,
};

const headingStyle = {
  fontSize: 21,
  marginTop: 0,
  marginBottom: 14,
};

const paragraphStyle = {
  color: "#657386",
  lineHeight: 1.8,
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  padding: 9,
  marginTop: 6,
  border: "1px solid #d5dde7",
  borderRadius: 7,
};

const dangerButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #e4b9b1",
  borderRadius: 8,
  background: "#fff5f2",
  color: "#a33c2d",
  cursor: "pointer",
};

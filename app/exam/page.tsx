"use client";

import { useEffect, useMemo, useState } from "react";

const answerKey: Record<number, string> = {
  1: "C", 2: "C", 3: "D", 4: "C", 5: "C",
  6: "D", 7: "A", 8: "A", 9: "C", 10: "D",
  11: "D", 12: "A", 13: "C", 14: "D", 15: "C",
  16: "B", 17: "D", 18: "B", 19: "D",
  20: "CD", 21: "BCD", 22: "BD", 23: "BC", 24: "AD",
};

const topicNames: Record<number, string> = {
  1: "运动的描述", 2: "运动的描述", 3: "运动的描述",
  4: "运动的描述", 5: "运动的描述",
  6: "匀变速直线运动", 7: "匀变速直线运动",
  8: "匀变速直线运动", 9: "匀变速直线运动",
  10: "匀变速直线运动",
  11: "运动学综合", 12: "运动学综合",
  13: "运动学综合", 14: "运动学综合",
  15: "运动学综合", 16: "运动学综合",
  17: "运动学综合", 18: "运动学综合",
  19: "运动学综合",
  20: "运动学综合", 21: "运动学综合",
  22: "运动学综合", 23: "运动学综合",
  24: "运动学综合",
  25: "纸带实验", 26: "实验数据处理",
  27: "实验操作与分析",
  28: "刹车问题", 29: "匀变速直线运动",
  30: "追及与相遇", 31: "追及与相遇",
};

const allQuestions = Array.from({ length: 31 }, (_, i) => i + 1);
const options = ["A", "B", "C", "D"];

type RecordMap = Record<number, string>;

function cleanAnswer(value: string) {
  return value.toUpperCase().replace(/[^A-D]/g, "").split("").sort().join("");
}

function num(value: string) {
  if (value.trim() === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function Card({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <section style={{ ...styles.card, ...style }}>{children}</section>;
}

function MiniStat({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{ ...styles.statCard, background: color }}>
      <div style={{ fontSize: 22 }}>{emoji}</div>
      <div style={{ fontSize: 12, color: "#73758A", marginTop: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 25, fontWeight: 800, color: "#34344D", marginTop: 3 }}>
        {value}
      </div>
    </div>
  );
}

export default function ExamPage() {
  const [answers, setAnswers] = useState<RecordMap>({});
  const [earned, setEarned] = useState<RecordMap>({});
  const [maximum, setMaximum] = useState<RecordMap>({});
  const [notes, setNotes] = useState<RecordMap>({});
  const [activeTab, setActiveTab] = useState("全部");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("physics-exam-analysis-v2");
      if (!raw) return;
      const data = JSON.parse(raw);
      setAnswers(data.answers || {});
      setEarned(data.earned || {});
      setMaximum(data.maximum || {});
      setNotes(data.notes || {});
    } catch {
      console.warn("本地记录读取失败");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "physics-exam-analysis-v2",
        JSON.stringify({ answers, earned, maximum, notes })
      );
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [answers, earned, maximum, notes]);

  const filledAnswers = allQuestions.filter(
    (q) => q <= 24 && (answers[q] || "").trim() !== ""
  );

  const correctQuestions = filledAnswers.filter(
    (q) => cleanAnswer(answers[q] || "") === answerKey[q]
  );

  const wrongQuestions = filledAnswers.filter(
    (q) => cleanAnswer(answers[q] || "") !== answerKey[q]
  );

  const scoredQuestions = allQuestions.filter(
    (q) => maximum[q] !== undefined &&
      maximum[q].trim() !== "" &&
      earned[q] !== undefined &&
      earned[q].trim() !== ""
  );

  const totalEarned = scoredQuestions.reduce(
    (sum, q) => sum + Math.min(num(earned[q] || ""), num(maximum[q] || "")),
    0
  );

  const totalMaximum = scoredQuestions.reduce(
    (sum, q) => sum + num(maximum[q] || ""),
    0
  );

  const totalLost = Math.max(0, totalMaximum - totalEarned);
  const progress = Math.round((filledAnswers.length / 24) * 100);

  const filteredQuestions = useMemo(() => {
    if (activeTab === "客观题") return allQuestions.filter((q) => q <= 24);
    if (activeTab === "实验题") return allQuestions.filter((q) => q >= 25 && q <= 27);
    if (activeTab === "计算题") return allQuestions.filter((q) => q >= 28);
    if (activeTab === "错题") return wrongQuestions;
    return allQuestions;
  }, [activeTab, wrongQuestions]);

  function setAnswer(q: number, value: string) {
    setAnswers((old) => ({ ...old, [q]: value }));
  }

  function toggleOption(q: number, option: string) {
    const current = cleanAnswer(answers[q] || "");
    const next = current.includes(option)
      ? current.replace(option, "")
      : current + option;
    setAnswer(q, next);
  }

  function setScore(
    setter: React.Dispatch<React.SetStateAction<RecordMap>>,
    q: number,
    value: string
  ) {
    setter((old) => ({ ...old, [q]: value }));
  }

  function uploadImages(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImageUrls((old) => [
      ...old,
      ...selected.map((file) => URL.createObjectURL(file)),
    ]);
  }

  function clearAll() {
    if (!window.confirm("确定清空本次所有答案、分数和备注吗？")) return;
    setAnswers({});
    setEarned({});
    setMaximum({});
    setNotes({});
    localStorage.removeItem("physics-exam-analysis-v2");
  }

  function statusFor(q: number) {
    if (q <= 24) {
      if (!(answers[q] || "").trim()) return "未填写";
      return cleanAnswer(answers[q] || "") === answerKey[q] ? "正确" : "错误";
    }
    if (
      maximum[q] !== undefined &&
      maximum[q].trim() !== "" &&
      earned[q] !== undefined &&
      earned[q].trim() !== ""
    ) {
      return num(earned[q] || "") >= num(maximum[q] || "") ? "已评分" : "已评分";
    }
    return "待评分";
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <a href="/physics-exam-analyzer/" style={styles.back}>
          ← 返回首页
        </a>

        <header style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <div style={styles.eyebrow}>MY PHYSICS JOURNAL ✦</div>
              <h1 style={styles.title}>物理月考小助手</h1>
              <p style={styles.subtitle}>
                慢慢整理，把每一道错题变成进步的起点。
              </p>
            </div>
            <div style={styles.heroEmoji}>🪐</div>
          </div>

          <div style={styles.examTag}>
            <span>📚</span> 高一物理 · 10 月月考
          </div>

          <div style={styles.progressBox}>
            <div style={styles.progressText}>
              <span>客观题录入进度</span>
              <strong>{filledAnswers.length} / 24 题</strong>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${progress}%` }} />
            </div>
            <div style={styles.progressHint}>
              {progress === 100 ? "太棒啦，客观题已经全部填写！🎉" : "一点点来，不用着急 ✨"}
            </div>
          </div>
        </header>

        <div style={styles.statGrid}>
          <MiniStat emoji="🌟" label="已录入得分" value={`${totalEarned} 分`} color="#FFF2D8" />
          <MiniStat emoji="🍑" label="已统计失分" value={`${totalLost} 分`} color="#FFE8E4" />
          <MiniStat emoji="🎯" label="客观题答对" value={`${correctQuestions.length} 题`} color="#E5F6EA" />
          <MiniStat emoji="📝" label="客观题错题" value={`${wrongQuestions.length} 题`} color="#E9EDFF" />
        </div>

        <Card>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionEyebrow}>STEP 01</div>
              <h2 style={styles.sectionTitle}>答题纸照片</h2>
            </div>
            <span style={styles.sectionEmoji}>📸</span>
          </div>

          <p style={styles.muted}>
            上传后可以预览答题纸。当前版本还没有接入 OCR 自动识别，请核对图片并手动录入答案。
          </p>

          <label style={styles.uploadButton}>
            ＋ 选择图片
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => uploadImages(e.target.files)}
              style={{ display: "none" }}
            />
          </label>

          {imageUrls.length > 0 && (
            <div style={styles.imageGrid}>
              {imageUrls.map((url, i) => (
                <div key={url} style={styles.imageBox}>
                  <img src={url} alt={`答题纸 ${i + 1}`} style={styles.previewImage} />
                  <div style={styles.imageLabel}>图片 {i + 1}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionEyebrow}>STEP 02</div>
              <h2 style={styles.sectionTitle}>我的答题卡</h2>
            </div>
            <span style={styles.sectionEmoji}>✏️</span>
          </div>

          <p style={styles.muted}>
            点击选项录入答案。多选题可以同时选择多个选项，答案顺序不影响核对结果。
          </p>

          <div style={styles.tabs}>
            {["全部", "客观题", "实验题", "计算题", "错题"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={styles.questionGrid}>
            {filteredQuestions.map((q) => {
              const status = statusFor(q);
              const isMulti = q >= 20 && q <= 24;
              const isObjective = q <= 24;
              const bg =
                status === "正确" ? "#E6F7EA" :
                status === "错误" ? "#FFE9E5" :
                status === "已评分" ? "#E9EDFF" : "#FFF9EF";

              return (
                <article key={q} id={`question-${q}`} style={{ ...styles.questionCard, borderColor: status === "错误" ? "#F2C1B8" : "#ECE7E1" }}>
                  <div style={styles.questionTop}>
                    <div style={{ ...styles.questionNumber, background: bg }}>
                      {String(q).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.questionTitle}>
                        第 {q} 题
                        {isMulti && <span style={styles.multiTag}>多选</span>}
                      </div>
                      <div style={styles.questionTopic}>
                        {topicNames[q] || "待补充知识点"}
                      </div>
                    </div>
                    <span
                      style={{
                        ...styles.statusPill,
                        background: bg,
                        color: status === "错误" ? "#B64E3F" : status === "正确" ? "#287A49" : "#77718A",
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  {isObjective ? (
                    <div style={styles.options}>
                      {options.map((option) => {
                        const selected = isMulti
                          ? cleanAnswer(answers[q] || "").includes(option)
                          : answers[q] === option;

                        return (
                          <button
                            key={option}
                            onClick={() =>
                              isMulti
                                ? toggleOption(q, option)
                                : setAnswer(q, option)
                            }
                            style={{
                              ...styles.option,
                              ...(selected ? styles.optionSelected : {}),
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={styles.scoreGrid}>
                      <label style={styles.fieldLabel}>
                        得分
                        <input
                          type="number"
                          min="0"
                          value={earned[q] ?? ""}
                          onChange={(e) => setScore(setEarned, q, e.target.value)}
                          placeholder="例如 3"
                          style={styles.input}
                        />
                      </label>
                      <label style={styles.fieldLabel}>
                        满分
                        <input
                          type="number"
                          min="0"
                          value={maximum[q] ?? ""}
                          onChange={(e) => setScore(setMaximum, q, e.target.value)}
                          placeholder="例如 5"
                          style={styles.input}
                        />
                      </label>
                      <div style={styles.lostBox}>
                        <span>失分</span>
                        <strong>
                          {earned[q]?.trim() && maximum[q]?.trim()
                            ? `${Math.max(0, num(maximum[q]) - num(earned[q]))}`
                            : "—"}
                        </strong>
                      </div>
                    </div>
                  )}

                  {isObjective && answers[q] && (
                    <div style={styles.answerHint}>
                      标准答案 <strong>{answerKey[q]}</strong>
                      {status === "错误" && (
                        <span style={{ marginLeft: 8, color: "#B64E3F" }}>
                          · 再检查一下这道题
                        </span>
                      )}
                    </div>
                  )}

                  <label style={styles.noteLabel}>
                    <span>💭 错题笔记 / 备注</span>
                    <input
                      value={notes[q] || ""}
                      onChange={(e) => setScore(setNotes, q, e.target.value)}
                      placeholder="记录错误原因、公式或需要复习的内容……"
                      style={styles.noteInput}
                    />
                  </label>

                  {isObjective && (
                    <div style={styles.objectiveScoreRow}>
                      <span>本题得分（选填）</span>
                      <div style={styles.objectiveScoreInputs}>
                        <input
                          type="number"
                          min="0"
                          value={earned[q] ?? ""}
                          onChange={(e) => setScore(setEarned, q, e.target.value)}
                          placeholder="得分"
                          style={styles.smallInput}
                        />
                        <span>/</span>
                        <input
                          type="number"
                          min="0"
                          value={maximum[q] ?? ""}
                          onChange={(e) => setScore(setMaximum, q, e.target.value)}
                          placeholder="满分"
                          style={styles.smallInput}
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </Card>

        <Card style={{ background: "#F6F2FF", borderColor: "#E7DDFB" }}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionEyebrow}>STEP 03</div>
              <h2 style={styles.sectionTitle}>我的错题小结</h2>
            </div>
            <span style={styles.sectionEmoji}>🌷</span>
          </div>

          {wrongQuestions.length === 0 ? (
            <p style={styles.muted}>
              {filledAnswers.length === 0
                ? "填写客观题后，这里会自动整理错题。"
                : "目前已填写的客观题都与标准答案一致，继续保持！"}
            </p>
          ) : (
            <div style={styles.wrongList}>
              {wrongQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    document.getElementById(`question-${q}`)?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  style={styles.wrongItem}
                >
                  <span style={styles.wrongNumber}>{q}</span>
                  <span style={{ flex: 1, textAlign: "left" }}>
                    <strong>第 {q} 题</strong>
                    <span style={styles.wrongTopic}>{topicNames[q] || "待补充知识点"}</span>
                  </span>
                  <span style={{ color: "#B64E3F", fontWeight: 700 }}>
                    查看 →
                  </span>
                </button>
              ))}
            </div>
          )}

          <div style={styles.summaryBox}>
            <div style={styles.summaryRow}>
              <span>已录入得分</span>
              <strong>{totalEarned} 分</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>已录入满分</span>
              <strong>{totalMaximum} 分</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>已统计失分</span>
              <strong style={{ color: "#C56B55" }}>{totalLost} 分</strong>
            </div>
            <p style={styles.summaryHint}>
              只统计同时填写了得分和满分的题目。客观题自动判定正确与否，但分值仍需按试卷实际分值填写。
            </p>
          </div>
        </Card>

        <div style={styles.footerCard}>
          <div>
            <div style={{ fontWeight: 800, color: "#45445B" }}>🌱 每一次复盘，都是进步</div>
            <div style={{ color: "#9290A2", fontSize: 12, marginTop: 5 }}>
              {saved ? "答案和分数已保存到当前浏览器" : "本地保存状态暂不可确认"}
            </div>
          </div>
          <button onClick={clearAll} style={styles.clearButton}>
            清空记录
          </button>
        </div>

        <p style={styles.footerNote}>
          提醒：目前尚未接入 OCR。刷新后答案和分数会尝试从本地恢复，但上传的图片不会保留。
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#FFF9F2",
    color: "#38364C",
    fontFamily: "Arial, 'Microsoft YaHei', sans-serif",
    padding: "26px 16px 60px",
  },
  container: { maxWidth: 980, margin: "0 auto" },
  back: {
    color: "#8A8498",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
  },
  hero: {
    marginTop: 24,
    padding: "30px 28px",
    borderRadius: 28,
    background: "linear-gradient(135deg, #E9F1FF 0%, #F4EDFF 56%, #FFF0E7 100%)",
    border: "1px solid #EAE3F4",
    boxShadow: "0 12px 35px rgba(100, 89, 130, 0.07)",
  },
  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  eyebrow: {
    color: "#8580B7",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 2,
  },
  title: {
    fontSize: "clamp(28px, 5vw, 39px)",
    margin: "12px 0 8px",
    letterSpacing: -1,
    color: "#38364C",
  },
  subtitle: {
    color: "#79768D",
    lineHeight: 1.8,
    fontSize: 14,
    margin: 0,
  },
  heroEmoji: {
    fontSize: 58,
    width: 88,
    height: 88,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.6)",
    borderRadius: 27,
  },
  examTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 22,
    padding: "9px 14px",
    background: "rgba(255,255,255,0.75)",
    borderRadius: 99,
    color: "#6D6A87",
    fontSize: 13,
    fontWeight: 700,
  },
  progressBox: { marginTop: 25 },
  progressText: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    fontSize: 13,
    color: "#77738D",
    marginBottom: 9,
  },
  progressTrack: {
    height: 10,
    background: "rgba(255,255,255,0.8)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #89B9F7, #A89AF3, #F2A9BB)",
    borderRadius: 99,
    transition: "width 0.3s ease",
  },
  progressHint: { color: "#8A8498", fontSize: 12, marginTop: 9 },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
    gap: 12,
    margin: "18px 0",
  },
  statCard: {
    borderRadius: 20,
    padding: "17px 18px",
    border: "1px solid rgba(140,130,160,0.09)",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #EFE8E0",
    borderRadius: 24,
    padding: "24px",
    marginBottom: 18,
    boxShadow: "0 7px 24px rgba(91, 75, 64, 0.035)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.8,
    color: "#A39AB8",
  },
  sectionTitle: {
    margin: "6px 0 0",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  sectionEmoji: {
    fontSize: 26,
    width: 48,
    height: 48,
    borderRadius: 17,
    display: "grid",
    placeItems: "center",
    background: "#FFF2E7",
  },
  muted: {
    color: "#858196",
    fontSize: 13,
    lineHeight: 1.85,
    margin: "14px 0 18px",
  },
  uploadButton: {
    display: "inline-block",
    padding: "11px 17px",
    borderRadius: 13,
    background: "#EAF1FF",
    color: "#5576BA",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 800,
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  imageBox: {
    border: "1px solid #ECE7F0",
    borderRadius: 15,
    overflow: "hidden",
    background: "#FBFAFD",
  },
  previewImage: {
    width: "100%",
    height: 190,
    objectFit: "contain",
    display: "block",
    background: "#F8F6FA",
  },
  imageLabel: {
    padding: 9,
    fontSize: 12,
    color: "#858196",
  },
  tabs: {
    display: "flex",
    gap: 7,
    flexWrap: "wrap",
    margin: "18px 0",
  },
  tab: {
    padding: "9px 14px",
    borderRadius: 99,
    border: "1px solid #EDE7E2",
    background: "#FFFFFF",
    color: "#8A8498",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
  },
  tabActive: {
    background: "#E9EDFF",
    color: "#596BB0",
    borderColor: "#D8DFFD",
  },
  questionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(275px, 1fr))",
    gap: 12,
  },
  questionCard: {
    border: "1px solid #ECE7E1",
    borderRadius: 19,
    padding: 15,
    background: "#FFFEFC",
    minWidth: 0,
  },
  questionTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  questionNumber: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    fontWeight: 900,
    color: "#55516C",
    flexShrink: 0,
  },
  questionTitle: { fontWeight: 800, fontSize: 14 },
  questionTopic: {
    fontSize: 11,
    color: "#9B96A9",
    marginTop: 4,
  },
  multiTag: {
    display: "inline-block",
    fontSize: 10,
    background: "#F1E9FF",
    color: "#8570B5",
    padding: "3px 6px",
    borderRadius: 6,
    marginLeft: 5,
  },
  statusPill: {
    fontSize: 10,
    padding: "5px 8px",
    borderRadius: 99,
    whiteSpace: "nowrap",
  },
  options: {
    display: "flex",
    gap: 9,
    marginTop: 17,
  },
  option: {
    flex: 1,
    minWidth: 0,
    height: 38,
    borderRadius: 12,
    border: "1px solid #E9E4E1",
    background: "#FFFFFF",
    color: "#7E788D",
    cursor: "pointer",
    fontWeight: 800,
  },
  optionSelected: {
    background: "#E8EEFF",
    borderColor: "#AABAF4",
    color: "#526BB3",
    boxShadow: "0 3px 9px rgba(109, 127, 194, 0.10)",
  },
  answerHint: {
    marginTop: 11,
    padding: "8px 10px",
    background: "#F7F5FC",
    color: "#858196",
    fontSize: 11,
    borderRadius: 9,
  },
  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 0.8fr",
    gap: 8,
    marginTop: 15,
    alignItems: "end",
  },
  fieldLabel: {
    fontSize: 11,
    color: "#858196",
    minWidth: 0,
  },
  input: {
    display: "block",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    border: "1px solid #E8E2E8",
    background: "#FFFFFF",
    borderRadius: 10,
    padding: "9px 8px",
    marginTop: 6,
    color: "#49465E",
    fontSize: 13,
  },
  lostBox: {
    borderRadius: 10,
    padding: "8px 10px",
    background: "#FFF0EB",
    color: "#B66B58",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 10,
  },
  noteLabel: {
    display: "block",
    marginTop: 14,
    color: "#A09AAC",
    fontSize: 11,
  },
  noteInput: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    marginTop: 7,
    padding: "9px 10px",
    borderRadius: 10,
    border: "1px solid #F0EAE6",
    background: "#FFFEFC",
    fontSize: 11,
    color: "#55516C",
  },
  objectiveScoreRow: {
    marginTop: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    fontSize: 10,
    color: "#A09AAC",
    flexWrap: "wrap",
  },
  objectiveScoreInputs: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  smallInput: {
    width: 58,
    padding: "7px 6px",
    border: "1px solid #E8E2E8",
    borderRadius: 8,
    fontSize: 11,
    color: "#55516C",
    background: "#FFFFFF",
  },
  wrongList: { display: "grid", gap: 8, marginTop: 14 },
  wrongItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    border: "1px solid #E8DFF5",
    background: "rgba(255,255,255,0.75)",
    borderRadius: 14,
    cursor: "pointer",
    color: "#4C4863",
  },
  wrongNumber: {
    width: 35,
    height: 35,
    display: "grid",
    placeItems: "center",
    borderRadius: 12,
    background: "#FFE4DF",
    color: "#B64E3F",
    fontWeight: 900,
  },
  wrongTopic: {
    display: "block",
    color: "#9690A8",
    fontSize: 11,
    marginTop: 4,
  },
  summaryBox: {
    background: "rgba(255,255,255,0.72)",
    padding: 17,
    borderRadius: 17,
    marginTop: 20,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    color: "#7D7890",
    fontSize: 13,
    borderBottom: "1px solid #F0EAF7",
  },
  summaryHint: {
    color: "#9A94A9",
    fontSize: 11,
    lineHeight: 1.8,
    margin: "12px 0 0",
  },
  footerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    padding: "18px 20px",
    background: "#FFFFFF",
    border: "1px solid #EFE8E0",
    borderRadius: 20,
  },
  clearButton: {
    border: "1px solid #F0D7D0",
    borderRadius: 11,
    padding: "9px 13px",
    background: "#FFF3EF",
    color: "#B76D5C",
    fontSize: 12,
    cursor: "pointer",
  },
  footerNote: {
    color: "#AAA3B0",
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: "center",
    marginTop: 16,
  },
};

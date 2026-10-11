"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const STORAGE_KEY = "physics-exam-analysis-v2";

const answerKey: Record<number, string> = {
  1: "C", 2: "C", 3: "D", 4: "C", 5: "C",
  6: "D", 7: "A", 8: "A", 9: "C", 10: "D",
  11: "D", 12: "A", 13: "C", 14: "D", 15: "C",
  16: "B", 17: "D", 18: "B", 19: "D",
  20: "CD", 21: "BCD", 22: "BD", 23: "BC", 24: "AD",
};

const topicNames: Record<number, string> = {
  1: "运动的描述",
  2: "运动的描述",
  3: "运动的描述",
  4: "运动的描述",
  5: "运动的描述",
  6: "匀变速直线运动",
  7: "匀变速直线运动",
  8: "匀变速直线运动",
  9: "匀变速直线运动",
  10: "匀变速直线运动",
  11: "运动学综合",
  12: "运动学综合",
  13: "运动学综合",
  14: "运动学综合",
  15: "运动学综合",
  16: "运动学综合",
  17: "运动学综合",
  18: "运动学综合",
  19: "运动学综合",
  20: "运动学综合",
  21: "运动学综合",
  22: "运动学综合",
  23: "运动学综合",
  24: "运动学综合",
  25: "纸带实验",
  26: "实验数据处理",
  27: "实验操作与分析",
  28: "刹车问题",
  29: "匀变速直线运动",
  30: "追及与相遇",
  31: "追及与相遇",
};

const allQuestions = Array.from({ length: 31 }, (_, i) => i + 1);
const options = ["A", "B", "C", "D"];

type RecordMap = Record<number, string>;

type SavedData = {
  answers?: RecordMap;
  earned?: RecordMap;
  maximum?: RecordMap;
  notes?: RecordMap;
};

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
  children: ReactNode;
  style?: CSSProperties;
}) {
  return <section style={{ ...styles.card, ...style }}>{children}</section>;
}

function MiniStat({
  emoji,
  label,
  value,
  color,
  detail,
}: {
  emoji: string;
  label: string;
  value: string;
  color: string;
  detail?: string;
}) {
  return (
    <div style={{ ...styles.statCard, background: color }}>
      <div style={styles.statTop}>
        <span style={styles.statEmoji}>{emoji}</span>
        <span style={styles.statLabel}>{label}</span>
      </div>
      <div style={styles.statValue}>{value}</div>
      {detail && <div style={styles.statDetail}>{detail}</div>}
    </div>
  );
}

function SectionHeading({
  step,
  title,
  emoji,
  description,
}: {
  step: string;
  title: string;
  emoji: string;
  description?: string;
}) {
  return (
    <div style={styles.sectionHeader}>
      <div>
        <div style={styles.sectionEyebrow}>{step}</div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {description && <p style={styles.sectionDescription}>{description}</p>}
      </div>
      <span style={styles.sectionEmoji}>{emoji}</span>
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
  const [loaded, setLoaded] = useState(false);

  // 先读取旧记录。读取完成前，不允许保存初始空数据。
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const data: SavedData = JSON.parse(raw);

        setAnswers(data.answers || {});
        setEarned(data.earned || {});
        setMaximum(data.maximum || {});
        setNotes(data.notes || {});
      }
    } catch {
      console.warn("本地记录读取失败");
    } finally {
      setLoaded(true);
    }
  }, []);

  // 只有确认旧数据读取完成后，才开始保存。
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, earned, maximum, notes })
      );
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [answers, earned, maximum, notes, loaded]);

  // 只统计已填写答案的客观题。
  const filledAnswers = allQuestions.filter(
    (q) => q <= 24 && (answers[q] || "").trim() !== ""
  );

  const correctQuestions = filledAnswers.filter(
    (q) => cleanAnswer(answers[q] || "") === answerKey[q]
  );

  const wrongQuestions = filledAnswers.filter(
    (q) => cleanAnswer(answers[q] || "") !== answerKey[q]
  );

  // 只统计同时填写了得分和满分的题目。
  const scoredQuestions = allQuestions.filter(
    (q) =>
      maximum[q] !== undefined &&
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

  const accuracy = filledAnswers.length
    ? Math.round((correctQuestions.length / filledAnswers.length) * 100)
    : 0;

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

    const selected = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setImageUrls((old) => [
      ...old,
      ...selected.map((file) => URL.createObjectURL(file)),
    ]);
  }

  function removeImage(url: string) {
    URL.revokeObjectURL(url);
    setImageUrls((old) => old.filter((item) => item !== url));
  }

  function clearAll() {
    const confirmed = window.confirm(
      "确定清空所有答案、分数和备注吗？此操作无法撤销。"
    );

    if (!confirmed) return;

    setAnswers({});
    setEarned({});
    setMaximum({});
    setNotes({});
    setActiveTab("全部");

    try {
      localStorage.removeItem(STORAGE_KEY);
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  function statusFor(q: number) {
    if (q <= 24) {
      if (!(answers[q] || "").trim()) return "未填写";

      return cleanAnswer(answers[q] || "") === answerKey[q]
        ? "正确"
        : "错误";
    }

    if (
      maximum[q] !== undefined &&
      maximum[q].trim() !== "" &&
      earned[q] !== undefined &&
      earned[q].trim() !== ""
    ) {
      return "已评分";
    }

    return "待评分";
  }

  function statusColor(status: string) {
    if (status === "正确") {
      return {
        background: "#E4F6E9",
        color: "#287A49",
        border: "#CDEBD5",
      };
    }

    if (status === "错误") {
      return {
        background: "#FFE9E5",
        color: "#B64E3F",
        border: "#F4D0C8",
      };
    }

    if (status === "已评分") {
      return {
        background: "#E9EDFF",
        color: "#596BB0",
        border: "#D8DFFD",
      };
    }

    return {
      background: "#F5F2ED",
      color: "#898394",
      border: "#ECE7E1",
    };
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <a href="/physics-exam-analyzer/" style={styles.back}>
          <span>←</span> 返回学习中心
        </a>

        <header style={styles.hero}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroTop}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={styles.eyebrow}>MY PHYSICS JOURNAL ✦</div>

              <h1 style={styles.title}>物理月考小助手</h1>

              <p style={styles.subtitle}>
                把每一次错误变成下一次进步的起点。
              </p>

              <div style={styles.examTag}>
                <span>📚</span>
                高一物理 · 10 月月考
              </div>
            </div>

            <div style={styles.heroEmoji}>🪐</div>
          </div>

          <div style={styles.progressBox}>
            <div style={styles.progressText}>
              <span>客观题录入进度</span>
              <strong>{filledAnswers.length} / 24 题</strong>
            </div>

            <div
              style={styles.progressTrack}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                }}
              />
            </div>

            <div style={styles.progressBottom}>
              <span style={styles.progressHint}>
                {progress === 100
                  ? "太棒啦，客观题已经全部填写！🎉"
                  : "一步一步来，不用着急 ✨"}
              </span>
              <strong style={styles.progressPercent}>{progress}%</strong>
            </div>
          </div>
        </header>

        <div style={styles.statGrid}>
          <MiniStat
            emoji="🌟"
            label="已录入得分"
            value={`${totalEarned} 分`}
            color="#FFF2D8"
            detail={`已填写 ${scoredQuestions.length} 道题`}
          />

          <MiniStat
            emoji="🍑"
            label="已统计失分"
            value={`${totalLost} 分`}
            color="#FFE8E4"
            detail="根据已填写分数计算"
          />

          <MiniStat
            emoji="🎯"
            label="客观题正确率"
            value={`${accuracy}%`}
            color="#E5F6EA"
            detail={`${correctQuestions.length} / ${filledAnswers.length || 0} 题`}
          />

          <MiniStat
            emoji="📝"
            label="客观题错题"
            value={`${wrongQuestions.length} 题`}
            color="#E9EDFF"
            detail="点击下方错题查看详情"
          />
        </div>

        <Card>
          <SectionHeading
            step="STEP 01"
            title="答题纸照片"
            emoji="📸"
            description="上传照片方便对照原卷，答案仍需手动录入。"
          />

          <p style={styles.muted}>
            当前版本暂未接入 OCR 自动识别。图片只在当前页面打开期间预览，
            刷新页面后需要重新上传。
          </p>

          <label style={styles.uploadButton}>
            <span>＋</span> 选择答题纸图片
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                uploadImages(e.target.files);
                e.currentTarget.value = "";
              }}
              style={{ display: "none" }}
            />
          </label>

          {imageUrls.length > 0 && (
            <div style={styles.imageGrid}>
              {imageUrls.map((url, i) => (
                <div key={url} style={styles.imageBox}>
                  <img
                    src={url}
                    alt={`答题纸 ${i + 1}`}
                    style={styles.previewImage}
                  />

                  <div style={styles.imageFooter}>
                    <span style={styles.imageLabel}>图片 {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      style={styles.removeImageButton}
                    >
                      移除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeading
            step="STEP 02"
            title="我的答题卡"
            emoji="✏️"
            description="选择答案、填写分数，还可以随时记录错题原因。"
          />

          <div style={styles.tipBox}>
            <span>💡</span>
            <span>
              第 20～24 题为多选题，可以选择多个选项。答案顺序不影响核对结果。
            </span>
          </div>

          <div style={styles.tabs}>
            {["全部", "客观题", "实验题", "计算题", "错题"].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
              >
                {tab}
                {tab === "错题" && wrongQuestions.length > 0 && (
                  <span style={styles.tabCount}>{wrongQuestions.length}</span>
                )}
              </button>
            ))}
          </div>

          <div style={styles.questionSummary}>
            <span>
              当前显示 <strong>{filteredQuestions.length}</strong> 道题
            </span>
            <span style={styles.questionSummaryHint}>
              {activeTab === "错题"
                ? "优先复盘错误题目"
                : "选择选项即可录入答案"}
            </span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyEmoji}>
                {activeTab === "错题" ? "🌷" : "📚"}
              </div>
              <strong>
                {activeTab === "错题"
                  ? "暂时没有已识别的错题"
                  : "这个分类暂时没有题目"}
              </strong>
              <p>
                {activeTab === "错题"
                  ? "先填写客观题答案，系统就会自动整理错题。"
                  : "可以切换其他分类继续录入。"}
              </p>
            </div>
          ) : (
            <div style={styles.questionGrid}>
              {filteredQuestions.map((q) => {
                const status = statusFor(q);
                const isMulti = q >= 20 && q <= 24;
                const isObjective = q <= 24;
                const palette = statusColor(status);

                const selectedAnswer = cleanAnswer(answers[q] || "");
                const isCorrect = status === "正确";

                return (
                  <article
                    key={q}
                    id={`question-${q}`}
                    style={{
                      ...styles.questionCard,
                      borderColor:
                        status === "错误" ? "#F2C1B8" : "#ECE7E1",
                      boxShadow:
                        status === "错误"
                          ? "0 4px 15px rgba(208, 116, 99, 0.05)"
                          : "none",
                    }}
                  >
                    <div style={styles.questionTop}>
                      <div
                        style={{
                          ...styles.questionNumber,
                          background: palette.background,
                          color: palette.color,
                        }}
                      >
                        {String(q).padStart(2, "0")}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.questionTitle}>
                          第 {q} 题
                          {isMulti && (
                            <span style={styles.multiTag}>多选</span>
                          )}
                        </div>

                        <div style={styles.questionTopic}>
                          {topicNames[q] || "待补充知识点"}
                        </div>
                      </div>

                      <span
                        style={{
                          ...styles.statusPill,
                          background: palette.background,
                          color: palette.color,
                        }}
                      >
                        {status}
                      </span>
                    </div>

                    {isObjective ? (
                      <div style={styles.options}>
                        {options.map((option) => {
                          const selected = isMulti
                            ? selectedAnswer.includes(option)
                            : answers[q] === option;

                          return (
                            <button
                              type="button"
                              key={option}
                              aria-pressed={selected}
                              aria-label={`第 ${q} 题选项 ${option}`}
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
                              {selected && (
                                <span style={styles.selectedMark}>✓</span>
                              )}
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
                            max={maximum[q] || undefined}
                            step="any"
                            value={earned[q] ?? ""}
                            onChange={(e) =>
                              setScore(setEarned, q, e.target.value)
                            }
                            placeholder="例如 3"
                            style={styles.input}
                          />
                        </label>

                        <label style={styles.fieldLabel}>
                          满分
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={maximum[q] ?? ""}
                            onChange={(e) =>
                              setScore(setMaximum, q, e.target.value)
                            }
                            placeholder="例如 5"
                            style={styles.input}
                          />
                        </label>

                        <div style={styles.lostBox}>
                          <span>本题失分</span>
                          <strong>
                            {earned[q]?.trim() && maximum[q]?.trim()
                              ? Math.max(
                                  0,
                                  num(maximum[q]) - num(earned[q])
                                )
                              : "—"}
                          </strong>
                        </div>
                      </div>
                    )}

                    {isObjective && answers[q] && (
                      <div
                        style={{
                          ...styles.answerHint,
                          background: isCorrect ? "#F0F9F1" : "#FFF2EF",
                        }}
                      >
                        <span>标准答案</span>
                        <strong style={{ color: isCorrect ? "#287A49" : "#B64E3F" }}>
                          {answerKey[q]}
                        </strong>

                        {status === "错误" && (
                          <span style={styles.answerHintText}>
                            建议记录错误原因
                          </span>
                        )}
                      </div>
                    )}

                    <label style={styles.noteLabel}>
                      <span style={styles.noteTitle}>💭 错题笔记 / 备注</span>
                      <textarea
                        value={notes[q] || ""}
                        onChange={(e) =>
                          setScore(setNotes, q, e.target.value)
                        }
                        placeholder="记录错误原因、公式、易错点或需要复习的内容……"
                        rows={2}
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
                            max={maximum[q] || undefined}
                            step="any"
                            aria-label={`第 ${q} 题得分`}
                            value={earned[q] ?? ""}
                            onChange={(e) =>
                              setScore(setEarned, q, e.target.value)
                            }
                            placeholder="得分"
                            style={styles.smallInput}
                          />

                          <span>/</span>

                          <input
                            type="number"
                            min="0"
                            step="any"
                            aria-label={`第 ${q} 题满分`}
                            value={maximum[q] ?? ""}
                            onChange={(e) =>
                              setScore(setMaximum, q, e.target.value)
                            }
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
          )}
        </Card>

        <Card style={styles.wrongCard}>
          <SectionHeading
            step="STEP 03"
            title="我的错题小结"
            emoji="🌷"
            description="把做错的题目找出来，再把失分原因整理清楚。"
          />

          {wrongQuestions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyEmoji}>🌱</div>
              <strong>
                {filledAnswers.length === 0
                  ? "从录入第一道题开始吧"
                  : "目前填写的客观题都答对啦"}
              </strong>
              <p>
                {filledAnswers.length === 0
                  ? "填写客观题后，这里会自动整理错题。"
                  : "继续保持，也别忘了核对试卷和标准答案。"}
              </p>
            </div>
          ) : (
            <>
              <div style={styles.wrongHeader}>
                <span>待复盘题目</span>
                <strong>{wrongQuestions.length} 道</strong>
              </div>

              <div style={styles.wrongList}>
                {wrongQuestions.map((q) => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => {
                      setActiveTab("全部");

                      window.setTimeout(() => {
                        document
                          .getElementById(`question-${q}`)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }, 50);
                    }}
                    style={styles.wrongItem}
                  >
                    <span style={styles.wrongNumber}>{q}</span>

                    <span style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <strong style={styles.wrongTitle}>第 {q} 题</strong>
                      <span style={styles.wrongTopic}>
                        {topicNames[q] || "待补充知识点"}
                      </span>
                      {notes[q]?.trim() && (
                        <span style={styles.notePreview}>
                          笔记：{notes[q]}
                        </span>
                      )}
                    </span>

                    <span style={styles.wrongAction}>查看 →</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={styles.summaryBox}>
            <div style={styles.summaryTitle}>📊 本次录入概况</div>

            <div style={styles.summaryRow}>
              <span>已录入客观题</span>
              <strong>{filledAnswers.length} / 24 题</strong>
            </div>

            <div style={styles.summaryRow}>
              <span>客观题答对</span>
              <strong style={{ color: "#287A49" }}>
                {correctQuestions.length} 题
              </strong>
            </div>

            <div style={styles.summaryRow}>
              <span>客观题答错</span>
              <strong style={{ color: "#B64E3F" }}>
                {wrongQuestions.length} 题
              </strong>
            </div>

            <div style={styles.summaryRow}>
              <span>已录入得分</span>
              <strong>{totalEarned} 分</strong>
            </div>

            <div style={styles.summaryRow}>
              <span>已录入满分</span>
              <strong>{totalMaximum} 分</strong>
            </div>

            <div style={{ ...styles.summaryRow, borderBottom: "none" }}>
              <span>已统计失分</span>
              <strong style={{ color: "#C56B55" }}>
                {totalLost} 分
              </strong>
            </div>

            <p style={styles.summaryHint}>
              只统计同时填写了得分和满分的题目。客观题正确率按已填写的客观题计算；
              分数需要根据试卷实际分值手动录入。
            </p>
          </div>
        </Card>

        <div style={styles.footerCard}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.footerTitle}>
              🌱 每一次复盘，都是进步
            </div>

            <div style={styles.saveStatus}>
              <span
                style={{
                  ...styles.saveDot,
                  background: saved ? "#64B88A" : "#E0A35C",
                }}
              />
              {!loaded
                ? "正在读取本地记录……"
                : saved
                  ? "答案、分数和备注已保存到当前浏览器"
                  : "暂时无法确认保存状态，请留意浏览器存储设置"}
            </div>
          </div>

          <button
            type="button"
            onClick={clearAll}
            style={styles.clearButton}
          >
            清空记录
          </button>
        </div>

        <p style={styles.footerNote}>
          提醒：当前版本尚未接入 OCR 自动识别。答案、分数和备注保存在当前浏览器；
          上传的图片不会保留。清除浏览器网站数据后，本地记录也可能丢失。
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(ellipse at 8% 0%, rgba(221,232,255,0.55), transparent 35%), #FFF9F3",
    color: "#38364C",
    fontFamily: "Arial, 'Microsoft YaHei', sans-serif",
    padding: "28px 16px 64px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: 1080,
    margin: "0 auto",
  },

  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#858096",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    padding: "9px 0",
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    marginTop: 18,
    padding: "clamp(23px, 4vw, 38px)",
    borderRadius: 30,
    background:
      "linear-gradient(130deg, #E8F1FF 0%, #F3EEFF 53%, #FFF0E6 100%)",
    border: "1px solid rgba(221,215,241,0.9)",
    boxShadow: "0 14px 38px rgba(100,89,130,0.08)",
  },

  heroGlowOne: {
    position: "absolute",
    width: 200,
    height: 200,
    right: 65,
    top: -115,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.35)",
    pointerEvents: "none",
  },

  heroGlowTwo: {
    position: "absolute",
    width: 160,
    height: 160,
    right: -55,
    bottom: -90,
    borderRadius: "50%",
    background: "rgba(255,220,216,0.35)",
    pointerEvents: "none",
  },

  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
  },

  eyebrow: {
    color: "#8580B7",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 2.4,
  },

  title: {
    fontSize: "clamp(29px, 5vw, 43px)",
    lineHeight: 1.2,
    margin: "13px 0 10px",
    letterSpacing: -1.4,
    color: "#38364C",
  },

  subtitle: {
    color: "#79768D",
    lineHeight: 1.9,
    fontSize: 14,
    margin: 0,
  },

  heroEmoji: {
    fontSize: 53,
    width: 88,
    height: 88,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: 28,
    boxShadow: "0 8px 25px rgba(113,103,151,0.08)",
  },

  examTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginTop: 21,
    padding: "10px 15px",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.85)",
    borderRadius: 99,
    color: "#6D6A87",
    fontSize: 12,
    fontWeight: 800,
  },

  progressBox: {
    marginTop: 27,
    position: "relative",
    zIndex: 1,
  },

  progressText: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    fontSize: 12,
    color: "#77738D",
    marginBottom: 10,
  },

  progressTrack: {
    height: 10,
    background: "rgba(255,255,255,0.8)",
    borderRadius: 99,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #8BBBF5, #A99BF3, #F2A9BB)",
    borderRadius: 99,
    transition: "width 0.35s ease",
  },

  progressBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },

  progressHint: {
    color: "#89839B",
    fontSize: 11,
  },

  progressPercent: {
    color: "#7A75A5",
    fontSize: 12,
  },

  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 13,
    margin: "19px 0",
  },

  statCard: {
    borderRadius: 21,
    padding: "17px 18px",
    border: "1px solid rgba(140,130,160,0.09)",
    boxShadow: "0 5px 16px rgba(91,75,64,0.025)",
    minWidth: 0,
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  statEmoji: {
    fontSize: 20,
  },

  statLabel: {
    color: "#73758A",
    fontSize: 12,
  },

  statValue: {
    fontSize: 27,
    fontWeight: 900,
    color: "#34344D",
    marginTop: 12,
    letterSpacing: -0.5,
  },

  statDetail: {
    fontSize: 10,
    color: "#89859A",
    marginTop: 7,
  },

  card: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #EFE8E2",
    borderRadius: 25,
    padding: "clamp(18px, 3vw, 27px)",
    marginBottom: 18,
    boxShadow: "0 7px 24px rgba(91,75,64,0.035)",
    minWidth: 0,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
  },

  sectionEyebrow: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 2,
    color: "#A39AB8",
  },

  sectionTitle: {
    margin: "7px 0 0",
    fontSize: 22,
    lineHeight: 1.4,
    letterSpacing: -0.6,
    color: "#403D55",
  },

  sectionDescription: {
    margin: "7px 0 0",
    color: "#918BA0",
    fontSize: 11,
    lineHeight: 1.7,
  },

  sectionEmoji: {
    fontSize: 25,
    width: 49,
    height: 49,
    flexShrink: 0,
    borderRadius: 17,
    display: "grid",
    placeItems: "center",
    background: "#FFF2E7",
  },

  muted: {
    color: "#858196",
    fontSize: 12,
    lineHeight: 1.9,
    margin: "17px 0",
  },

  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 17px",
    borderRadius: 13,
    background: "#EAF1FF",
    border: "1px solid #DCE6FF",
    color: "#5576BA",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 900,
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
    marginTop: 17,
  },

  imageBox: {
    border: "1px solid #ECE7F0",
    borderRadius: 15,
    overflow: "hidden",
    background: "#FBFAFD",
    minWidth: 0,
  },

  previewImage: {
    width: "100%",
    height: 190,
    objectFit: "contain",
    display: "block",
    background: "#F8F6FA",
  },

  imageFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    padding: "9px 10px",
  },

  imageLabel: {
    fontSize: 11,
    color: "#858196",
  },

  removeImageButton: {
    border: "none",
    background: "transparent",
    color: "#B76D5C",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
  },

  tipBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    padding: "12px 14px",
    marginTop: 18,
    background: "#F8F5FF",
    border: "1px solid #EAE2FB",
    borderRadius: 13,
    color: "#81799D",
    fontSize: 11,
    lineHeight: 1.8,
  },

  tabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    margin: "20px 0 14px",
  },

  tab: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 14px",
    borderRadius: 99,
    border: "1px solid #EDE7E2",
    background: "#FFFFFF",
    color: "#8A8498",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 800,
  },

  tabActive: {
    background: "#E9EDFF",
    color: "#596BB0",
    borderColor: "#D8DFFD",
    boxShadow: "0 3px 9px rgba(109,127,194,0.06)",
  },

  tabCount: {
    minWidth: 17,
    height: 17,
    padding: "0 4px",
    display: "inline-grid",
    placeItems: "center",
    borderRadius: 99,
    background: "#FFE4DF",
    color: "#B64E3F",
    fontSize: 9,
  },

  questionSummary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    color: "#8B8599",
    fontSize: 11,
    marginBottom: 14,
  },

  questionSummaryHint: {
    color: "#AAA3B0",
    fontSize: 10,
  },

  questionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 285px), 1fr))",
    gap: 13,
  },

  questionCard: {
    border: "1px solid #ECE7E1",
    borderRadius: 19,
    padding: 15,
    background: "#FFFEFC",
    minWidth: 0,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    scrollMarginTop: 20,
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
    fontSize: 12,
    fontWeight: 900,
    flexShrink: 0,
  },

  questionTitle: {
    fontWeight: 900,
    fontSize: 13,
    color: "#49465E",
  },

  questionTopic: {
    fontSize: 10,
    color: "#9B96A9",
    marginTop: 5,
    lineHeight: 1.5,
  },

  multiTag: {
    display: "inline-block",
    fontSize: 9,
    background: "#F1E9FF",
    color: "#8570B5",
    padding: "3px 6px",
    borderRadius: 6,
    marginLeft: 6,
    verticalAlign: "middle",
  },

  statusPill: {
    fontSize: 9,
    padding: "6px 8px",
    borderRadius: 99,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  options: {
    display: "flex",
    gap: 9,
    marginTop: 17,
  },

  option: {
    position: "relative",
    flex: 1,
    minWidth: 0,
    height: 40,
    borderRadius: 12,
    border: "1px solid #E9E4E1",
    background: "#FFFFFF",
    color: "#7E788D",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 900,
    transition: "background 0.15s ease, border-color 0.15s ease",
  },

  optionSelected: {
    background: "#E8EEFF",
    borderColor: "#AABAF4",
    color: "#526BB3",
    boxShadow: "0 3px 9px rgba(109,127,194,0.10)",
  },

  selectedMark: {
    position: "absolute",
    top: 2,
    right: 4,
    fontSize: 8,
    color: "#526BB3",
  },

  answerHint: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
    padding: "9px 10px",
    color: "#858196",
    fontSize: 10,
    borderRadius: 10,
  },

  answerHintText: {
    marginLeft: "auto",
    color: "#B64E3F",
    fontSize: 9,
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 0.8fr",
    gap: 8,
    marginTop: 16,
    alignItems: "end",
  },

  fieldLabel: {
    fontSize: 10,
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
    padding: "10px 8px",
    marginTop: 7,
    color: "#49465E",
    fontSize: 12,
  },

  lostBox: {
    borderRadius: 10,
    padding: "9px 8px",
    background: "#FFF0EB",
    color: "#B66B58",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    fontSize: 9,
    minWidth: 0,
  },

  noteLabel: {
    display: "block",
    marginTop: 15,
    color: "#A09AAC",
    fontSize: 10,
  },

  noteTitle: {
    display: "block",
    fontWeight: 700,
  },

  noteInput: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    resize: "vertical",
    minHeight: 54,
    marginTop: 8,
    padding: "10px 11px",
    borderRadius: 11,
    border: "1px solid #F0EAE6",
    background: "#FFFEFC",
    fontSize: 11,
    lineHeight: 1.7,
    color: "#55516C",
    fontFamily: "inherit",
  },

  objectiveScoreRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #F1ECE7",
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
    gap: 6,
  },

  smallInput: {
    width: 61,
    boxSizing: "border-box",
    padding: "8px 6px",
    border: "1px solid #E8E2E8",
    borderRadius: 8,
    fontSize: 10,
    color: "#55516C",
    background: "#FFFFFF",
  },

  emptyState: {
    textAlign: "center",
    padding: "28px 15px",
    background: "rgba(255,255,255,0.55)",
    border: "1px dashed #E8E0EF",
    borderRadius: 17,
    marginTop: 17,
  },

  emptyEmoji: {
    fontSize: 29,
    marginBottom: 10,
  },

  wrongCard: {
    background: "linear-gradient(145deg, #F8F4FF 0%, #FFF9F6 100%)",
    borderColor: "#E9DFF8",
  },

  wrongHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 11,
    borderBottom: "1px solid #EDE5F5",
    color: "#858096",
    fontSize: 11,
  },

  wrongList: {
    display: "grid",
    gap: 9,
    marginTop: 13,
  },

  wrongItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 12,
    border: "1px solid #E8DFF5",
    background: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    cursor: "pointer",
    color: "#4C4863",
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
  },

  wrongNumber: {
    width: 36,
    height: 36,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: 12,
    background: "#FFE4DF",
    color: "#B64E3F",
    fontWeight: 900,
    fontSize: 12,
  },

  wrongTitle: {
    display: "block",
    fontSize: 12,
  },

  wrongTopic: {
    display: "block",
    color: "#9690A8",
    fontSize: 10,
    marginTop: 4,
  },

  notePreview: {
    display: "block",
    color: "#88819C",
    fontSize: 10,
    marginTop: 5,
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },

  wrongAction: {
    color: "#B66B58",
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },

  summaryBox: {
    background: "rgba(255,255,255,0.76)",
    border: "1px solid #EEE6F4",
    padding: 17,
    borderRadius: 17,
    marginTop: 21,
  },

  summaryTitle: {
    color: "#56516F",
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 8,
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    color: "#7D7890",
    fontSize: 11,
    borderBottom: "1px solid #F0EAF7",
  },

  summaryHint: {
    color: "#9A94A9",
    fontSize: 10,
    lineHeight: 1.9,
    margin: "12px 0 0",
  },

  footerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
    flexWrap: "wrap",
    padding: "19px 21px",
    background: "#FFFFFF",
    border: "1px solid #EFE8E0",
    borderRadius: 20,
    boxShadow: "0 5px 17px rgba(91,75,64,0.025)",
  },

  footerTitle: {
    fontWeight: 900,
    color: "#45445B",
    fontSize: 13,
  },

  saveStatus: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    color: "#9290A2",
    fontSize: 10,
    marginTop: 8,
    lineHeight: 1.7,
  },

  saveDot: {
    width: 7,
    height: 7,
    flexShrink: 0,
    borderRadius: "50%",
  },

  clearButton: {
    border: "1px solid #F0D7D0",
    borderRadius: 11,
    padding: "10px 14px",
    background: "#FFF3EF",
    color: "#B76D5C",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
  },

  footerNote: {
    color: "#AAA3B0",
    fontSize: 10,
    lineHeight: 1.9,
    textAlign: "center",
    marginTop: 16,
    padding: "0 10px",
  },
};

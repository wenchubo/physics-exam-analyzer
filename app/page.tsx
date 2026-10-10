"use client";

import { useState } from "react";

const features = [
  {
    number: "01",
    icon: "📚",
    title: "知识学习",
    subtitle: "把物理知识装进自己的工具箱",
    description: "知识卡片 · 核心公式 · 易错提醒",
    color: "blue",
    href: "/physics-exam-analyzer/knowledge/index.html",
    button: "开始学习 ↗",
  },
  {
    number: "02",
    icon: "📝",
    title: "练习中心",
    subtitle: "在一次次练习中找到突破口",
    description: "精选题目 · 自动批改 · 答题解析",
    color: "orange",
    href: "/physics-exam-analyzer/practice.html",
    button: "开始练习 ↗",
  },
  {
    number: "03",
    icon: "📒",
    title: "我的错题本",
    subtitle: "把做错的题变成真正掌握的题",
    description: "错题回顾 · 反复练习 · 错因整理",
    color: "pink",
    href: "/physics-exam-analyzer/practice.html",
    button: "复习错题 ↗",
  },
  {
    number: "04",
    icon: "📊",
    title: "学习诊断",
    subtitle: "看见自己的进步与薄弱知识点",
    description: "知识点统计 · 薄弱环节 · 学习反馈",
    color: "green",
    href: "/physics-exam-analyzer/practice.html",
    button: "查看诊断 ↗",
  },
];

const experiments = [
  { icon: "🚗", title: "加速度实验", detail: "小车 · 轨道 · 运动数据" },
  { icon: "📈", title: "运动图像", detail: "观察位移、速度与时间" },
  { icon: "⚖️", title: "力的合成", detail: "理解力的大小与方向" },
];

export default function HomePage() {
  const [showExamInfo, setShowExamInfo] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF8F2] text-[#26354A]">
      {/* 顶部导航 */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a href="/physics-exam-analyzer/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCEBFA] text-2xl">
            ⚛
          </div>
          <div>
            <p className="text-lg font-black tracking-wide">物理实验室</p>
            <p className="text-[10px] tracking-[0.2em] text-[#8793A2]">
              PHYSICS LAB
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-7 text-sm text-[#68778A] md:flex">
          <a href="#features" className="transition hover:text-[#4278B8]">
            学习空间
          </a>
          <a href="#experiments" className="transition hover:text-[#4278B8]">
            实验工坊
          </a>
          <a href="#about" className="transition hover:text-[#4278B8]">
            关于本站
          </a>
        </div>

        <a
          href="/physics-exam-analyzer/practice.html"
          className="rounded-full border border-[#D9E0E8] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#8FB7E8]"
        >
          进入练习 →
        </a>
      </header>

      {/* 主视觉 */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:pb-24 md:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE7D8] bg-[#EFF4E9] px-4 py-2 text-xs font-semibold text-[#64805C]">
            <span className="h-2 w-2 rounded-full bg-[#83A976]" />
            YOUR PERSONAL PHYSICS SPACE
          </div>

          <h1 className="text-5xl font-black leading-[1.2] tracking-tight md:text-7xl">
            让物理
            <br />
            <span className="relative inline-block text-[#5388C6]">
              动起来
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 240 15"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 9 C55 1, 125 15, 236 5"
                  stroke="#E9B66B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-base leading-8 text-[#788494] md:text-lg">
            从一张试卷出发，找到知识漏洞；
            从一道错题出发，理解物理规律。
            在这里，把公式、练习和实验连接起来。
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              onClick={() => setShowExamInfo(!showExamInfo)}
              className="rounded-2xl bg-[#477FBD] px-6 py-4 font-bold text-white shadow-lg shadow-[#477FBD]/15 transition hover:-translate-y-0.5 hover:bg-[#376DA9]"
            >
              📄 开始试卷分析
              <span className="ml-3">↗</span>
            </button>

            <a
              href="/physics-exam-analyzer/knowledge/index.html"
              className="rounded-2xl border border-[#E1DFD7] bg-white px-6 py-4 font-bold transition hover:-translate-y-0.5 hover:border-[#9CBDE1]"
            >
              翻开知识卡片
            </a>
          </div>

          {showExamInfo && (
            <div
              id="exam-analysis"
              className="mt-5 rounded-2xl border border-[#D9E5F2] bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h2 className="font-bold">试卷分析工作台</h2>
                  <p className="mt-2 text-sm leading-6 text-[#788494]">
                    这里将用于上传试卷、录入你的作答，并结合标准答案和评分细则分析错题。
                    当前版本还没有接入文件识别与自动阅卷服务。
                  </p>
                  <div className="mt-4 rounded-xl bg-[#F5F7FA] p-3 text-sm leading-6">
                    <p>后续需要准备：</p>
                    <p>① 完整试卷（图片或 PDF）</p>
                    <p>② 你的作答内容</p>
                    <p>③ 标准答案及评分细则</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#8993A0]">
            <span>✳ 从基础概念开始</span>
            <span>✳ 记录每一次进步</span>
            <span>✳ 用实验理解规律</span>
          </div>
        </div>

        {/* 右侧插画区域 */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-3 top-5 h-24 w-24 rounded-full bg-[#F8DCA9]/60 blur-2xl" />
          <div className="absolute -left-4 bottom-8 h-28 w-28 rounded-full bg-[#BFD9F5]/70 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white bg-[#F0EEE6] p-5 shadow-[0_25px_70px_rgba(50,65,80,0.08)] md:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.18em] text-[#8C958F]">
                THE LITTLE LAB
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs text-[#8993A0]">
                今日探索
              </span>
            </div>

            <div className="relative mt-5 flex min-h-[270px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#E2EAF0]">
              <div className="absolute inset-0 opacity-40">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "radial-gradient(#8BA4BB 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <svg
                viewBox="0 0 420 280"
                className="relative w-full max-w-md"
                role="img"
                aria-label="小车沿斜面运动的物理实验示意图"
              >
                <path
                  d="M48 218 L365 88"
                  stroke="#A7B7C4"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M48 218 L365 88"
                  stroke="#F8FAFC"
                  strokeWidth="3"
                  strokeDasharray="8 10"
                />

                <path
                  d="M100 195 L100 230 M150 174 L150 230 M200 154 L200 230 M250 133 L250 230 M300 112 L300 230"
                  stroke="#B7C2CB"
                  strokeWidth="2"
                  strokeDasharray="4 5"
                />

                <g transform="translate(190 147) rotate(-22)">
                  <rect
                    x="-48"
                    y="-28"
                    width="96"
                    height="36"
                    rx="10"
                    fill="#F2B66D"
                    stroke="#D79B52"
                    strokeWidth="2"
                  />
                  <rect
                    x="-31"
                    y="-22"
                    width="24"
                    height="19"
                    rx="5"
                    fill="#FFF4D9"
                  />
                  <rect
                    x="7"
                    y="-22"
                    width="24"
                    height="19"
                    rx="5"
                    fill="#FFF4D9"
                  />
                  <circle
                    cx="-29"
                    cy="12"
                    r="11"
                    fill="#526B7E"
                    stroke="#F8FAFC"
                    strokeWidth="3"
                  />
                  <circle
                    cx="29"
                    cy="12"
                    r="11"
                    fill="#526B7E"
                    stroke="#F8FAFC"
                    strokeWidth="3"
                  />
                </g>

                <path
                  d="M225 87 Q250 67 275 73"
                  stroke="#5388C6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M264 62 L277 73 L263 82"
                  stroke="#5388C6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                <circle cx="90" cy="70" r="24" fill="#F6DCA8" />
                <path
                  d="M80 70 L100 70 M90 60 L90 80"
                  stroke="#BA9554"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <text
                  x="280"
                  y="51"
                  fontSize="14"
                  fill="#477FBD"
                  fontWeight="600"
                >
                  a = ?
                </text>
                <text
                  x="54"
                  y="258"
                  fontSize="12"
                  fill="#72879A"
                >
                  MOTION EXPERIMENT
                </text>
              </svg>

              <div className="absolute bottom-4 right-4 rotate-3 rounded-xl bg-white px-4 py-3 shadow-md">
                <p className="text-xs text-[#8A96A3]">探索问题</p>
                <p className="mt-1 text-sm font-bold">小车为什么会加速？</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xl">📐</p>
                <p className="mt-2 text-sm font-bold">公式</p>
                <p className="mt-1 text-xs text-[#8B96A3]">理解关系</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xl">🔍</p>
                <p className="mt-2 text-sm font-bold">观察</p>
                <p className="mt-1 text-xs text-[#8B96A3]">发现规律</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-xl">💡</p>
                <p className="mt-2 text-sm font-bold">思考</p>
                <p className="mt-1 text-xs text-[#8B96A3]">解决问题</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-24 hidden -rotate-6 rounded-2xl bg-white px-4 py-3 shadow-lg md:block">
            <span className="text-xl">✦</span>
            <span className="ml-2 text-sm font-bold">好奇心，是第一推动力</span>
          </div>
        </div>
      </section>

      {/* 学习空间 */}
      <section id="features" className="bg-white/70 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-[#7197BD]">
                YOUR LEARNING SPACE
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                你的物理工具箱
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#8792A0] md:text-base">
                每个工具都有自己的任务，组合起来就是完整的学习流程。
              </p>
            </div>
            <span className="rounded-full bg-[#F5F0E4] px-4 py-2 text-sm text-[#9A865F]">
              LEARN · PRACTICE · REFLECT
            </span>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const palettes: Record<
                string,
                { bg: string; icon: string; number: string }
              > = {
                blue: {
                  bg: "bg-[#EAF2FB]",
                  icon: "bg-[#D7E7F9]",
                  number: "text-[#719AC8]",
                },
                orange: {
                  bg: "bg-[#FBF0E2]",
                  icon: "bg-[#F7DFC0]",
                  number: "text-[#C79253]",
                },
                pink: {
                  bg: "bg-[#F8EBE8]",
                  icon: "bg-[#F2D8D1]",
                  number: "text-[#C58D81]",
                },
                green: {
                  bg: "bg-[#EAF1E6]",
                  icon: "bg-[#D8E6CF]",
                  number: "text-[#819C70]",
                },
              };

              const palette = palettes[feature.color];

              return (
                <article
                  key={feature.number}
                  className="group rounded-[1.7rem] border border-[#EDEBE4] bg-[#FFFEFA] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3B4B5C]/5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${palette.number}`}>
                      {feature.number}
                    </span>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${palette.icon}`}
                    >
                      {feature.icon}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {feature.title}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#6F7D8D]">
                    {feature.subtitle}
                  </p>

                  <div className={`mt-5 rounded-xl px-3 py-3 text-xs leading-5 ${palette.bg} text-[#68778A]`}>
                    {feature.description}
                  </div>

                  <a
                    href={feature.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#4C78A6] transition group-hover:gap-3"
                  >
                    {feature.button}
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 实验工坊 */}
      <section id="experiments" className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#E7EDF0] p-6 md:p-10">
          <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-[#718C9F]">
                EXPERIMENT WORKSHOP
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                不只看公式，
                <br />
                也要看见运动。
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#6D7D89] md:text-base">
                从观察小车的运动开始，把抽象的物理规律变成能够观察、操作和分析的实验。
              </p>
              <div className="mt-7 inline-flex rounded-xl border border-[#D2DDE3] bg-white/70 px-4 py-3 text-sm text-[#6F8797]">
                🧪 互动实验功能正在规划中
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {experiments.map((experiment, index) => (
                <div
                  key={experiment.title}
                  className={`rounded-2xl p-5 ${
                    index === 0
                      ? "bg-[#F8E6C9]"
                      : index === 1
                        ? "bg-[#DCEAF8]"
                        : "bg-[#E5EAD9]"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-3xl">
                    {experiment.icon}
                  </div>
                  <h3 className="mt-5 font-black">{experiment.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#74808A]">
                    {experiment.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 学习路径 */}
      <section className="px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-[#7197BD]">
              A LITTLE PROGRESS EVERY DAY
            </p>
            <h2 className="mt-3 text-3xl font-black">让学习形成闭环</h2>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-4">
            {[
              { icon: "📄", title: "发现问题", text: "从试卷和练习中定位漏洞" },
              { icon: "📚", title: "补充知识", text: "回到概念与公式重新理解" },
              { icon: "✍️", title: "再次练习", text: "用新题检验自己的掌握情况" },
              { icon: "📈", title: "复盘进步", text: "持续关注薄弱知识点的变化" },
            ].map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-[#EAE8E0] bg-white p-5 text-center"
              >
                <span className="text-3xl">{step.icon}</span>
                <p className="mt-3 font-black">{step.title}</p>
                <p className="mt-2 text-xs leading-5 text-[#84909C]">
                  {step.text}
                </p>
                {index < 3 && (
                  <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-xl text-[#B6C1C9] md:block">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer id="about" className="border-t border-[#EAE7DE] px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-[#8993A0] md:flex-row md:items-center">
          <div>
            <p className="font-black text-[#536273]">⚛ 物理实验室</p>
            <p className="mt-1 text-xs">
              把问题变成线索，把理解变成能力。
            </p>
          </div>
          <div className="text-xs leading-6 md:text-right">
            <p>高中物理学习与实验探索平台</p>
            <p>练习与错题记录保存在当前浏览器中。</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

import { NextResponse } from "next/server";

type PracticeQuestion = {
  number: number;
  type: string;
  question: string;
  answer: string;
  explanation: string;
  knowledgePoint: string;
};

const questionBank: Record<string, PracticeQuestion[]> = {
  加速度: [
    {
      number: 1,
      type: "计算题",
      question:
        "一辆汽车的速度由 4 m/s 增加到 10 m/s，经历了 3 s。求这段时间内汽车的平均加速度。",
      answer: "2 m/s²",
      explanation: "a = (v - v₀) / t = (10 - 4) / 3 = 2 m/s²。",
      knowledgePoint: "加速度",
    },
    {
      number: 2,
      type: "计算题",
      question:
        "某物体以 12 m/s 的速度运动，经过 4 s 后速度变为 4 m/s。求平均加速度。",
      answer: "-2 m/s²",
      explanation: "a = (4 - 12) / 4 = -2 m/s²。负号表示速度沿原方向的分量减小。",
      knowledgePoint: "加速度",
    },
  ],
  匀变速直线运动: [
    {
      number: 1,
      type: "计算题",
      question:
        "一辆汽车从静止开始，以 2 m/s² 的加速度做匀加速直线运动。求 5 s 末的速度。",
      answer: "10 m/s",
      explanation: "由 v = v₀ + at，得 v = 0 + 2 × 5 = 10 m/s。",
      knowledgePoint: "匀变速直线运动",
    },
    {
      number: 2,
      type: "计算题",
      question:
        "一个物体的初速度为 3 m/s，加速度为 2 m/s²。求它在 4 s 内的位移。",
      answer: "28 m",
      explanation: "x = v₀t + ½at² = 3 × 4 + ½ × 2 × 4² = 28 m。",
      knowledgePoint: "匀变速直线运动",
    },
  ],
  自由落体运动: [
    {
      number: 1,
      type: "计算题",
      question:
        "一个物体从静止开始自由下落，取 g = 10 m/s²。求下落 2 s 末的速度。",
      answer: "20 m/s，方向竖直向下",
      explanation: "自由落体初速度为零，v = gt = 10 × 2 = 20 m/s。",
      knowledgePoint: "自由落体运动",
    },
    {
      number: 2,
      type: "计算题",
      question:
        "一个物体从静止开始自由下落，取 g = 10 m/s²。求它前 3 s 内下落的高度。",
      answer: "45 m",
      explanation: "h = ½gt² = ½ × 10 × 3² = 45 m。",
      knowledgePoint: "自由落体运动",
    },
  ],
  参考系: [
    {
      number: 1,
      type: "概念题",
      question:
        "甲、乙两辆汽车沿同一直线同向行驶，甲车速度为 20 m/s，乙车速度为 15 m/s。以乙车为参考系，甲车的速度是多少？",
      answer: "5 m/s，沿汽车行驶方向",
      explanation: "同向运动时，相对速度为 20 - 15 = 5 m/s。",
      knowledgePoint: "参考系与相对运动",
    },
  ],
  速度: [
    {
      number: 1,
      type: "计算题",
      question: "某物体在 5 s 内的位移为 20 m，求这段时间内的平均速度。",
      answer: "4 m/s",
      explanation: "平均速度等于位移除以时间：v̄ = 20 / 5 = 4 m/s。",
      knowledgePoint: "速度与平均速度",
    },
  ],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const count = Math.min(
      50,
      Math.max(1, Number.parseInt(String(body.count ?? 5), 10) || 5)
    );

    const selectedPoints: string[] = Array.isArray(body.knowledgePoints)
      ? body.knowledgePoints.filter(
          (item: unknown): item is string => typeof item === "string"
        )
      : [];

    const difficulty =
      typeof body.difficulty === "string" ? body.difficulty : "接近原试卷";

    const availableQuestions = selectedPoints.length
      ? selectedPoints.flatMap((point) => questionBank[point] ?? [])
      : Object.values(questionBank).flat();

    if (availableQuestions.length === 0) {
      return NextResponse.json(
        {
          error: "所选知识点暂时没有练习题，请更换知识点。",
        },
        { status: 400 }
      );
    }

    const questions: PracticeQuestion[] = Array.from(
      { length: count },
      (_, index) => {
        const source = availableQuestions[index % availableQuestions.length];

        return {
          ...source,
          number: index + 1,
          question:
            difficulty === "基础巩固"
              ? source.question
              : source.question,
        };
      }
    );

    return NextResponse.json({
      success: true,
      mode: "local-question-bank",
      difficulty,
      count: questions.length,
      questions,
      message:
        "练习题已生成。当前版本使用本地题库，题目数量超过题库容量时会循环抽取。",
    });
  } catch {
    return NextResponse.json(
      { error: "生成练习题失败，请检查请求内容后重试。" },
      { status: 400 }
    );
  }
}

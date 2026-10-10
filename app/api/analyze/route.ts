import { NextResponse } from "next/server";
import exam from "../../../../data/exam.json";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json(
        { error: "请先上传答题卡图片。" },
        { status: 400 }
      );
    }

    const validFiles = files.filter(
      (file): file is File =>
        file instanceof File &&
        ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      return NextResponse.json(
        { error: "请上传 JPG、PNG 或 WebP 格式的图片。" },
        { status: 400 }
      );
    }

    if (validFiles.length > 5) {
      return NextResponse.json(
        { error: "最多只能上传 5 张图片。" },
        { status: 400 }
      );
    }

    const questions = exam.questions.map((question) => ({
      id: question.id,
      type: question.type,
      referenceAnswer: question.answer,
      knowledgePoints: question.knowledgePoints,
      status: question.status,
      studentAnswer: null,
      isCorrect: null,
      explanation:
        "当前版本尚未识别图片中的作答。请先核对学生答案，再进行判题。",
    }));

    return NextResponse.json({
      success: true,
      mode: "question-bank",
      message:
        "题库已加载，但当前版本还不能自动识别答题卡。请勿将未核对的答案当作批改结果。",
      examTitle: exam.title,
      totalQuestions: questions.length,
      recognizedQuestions: 0,
      pendingReview: questions.length,
      questions,
      suggestions: [
        "先核对原卷中缺失的题目图片和答案。",
        "录入学生答案后，再进行自动判题。",
        "后续可以接入有免费额度的 AI 服务，辅助识别图片和分析错因。",
      ],
    });
  } catch {
    return NextResponse.json(
      { error: "分析请求处理失败，请检查上传内容后重试。" },
      { status: 500 }
    );
  }
}
